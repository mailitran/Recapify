import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Col } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './TopGenre.css';
import TotalPlaylists from './TotalPlaylists';
import { useMetrics } from './TotalListeningMetricsContext'; // Import the context

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ListeningTime = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const { setTotalListeningTime } = useMetrics(); // Access setTotalListeningTime from context to update total listening time

    useEffect(() => {
        const fetchListeningData = async () => {
            const access_token = localStorage.getItem('access_token');
            if (!access_token) {
                setError("Access token not found");
                return;
            }

            try {
                const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                console.log("API Response:", response);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched Data:', data);

                if (!data.items || data.items.length === 0) {
                    setError("No listening data available for the past week");
                    return;
                }

                const listeningData = processListeningData(data.items);
                setChartData(listeningData.chartData);
                // Update totalListeningTime in context with the new value
                setTotalListeningTime(listeningData.totalListeningTime);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setError('Failed to load listening time data');
            }
        };

        fetchListeningData();
    }, []);

    const processListeningData = (items) => {
        const dailyListening = Array(7).fill(0);
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        let totalListeningTime = 0;

        items.forEach((item) => {
            const playedAt = new Date(item.played_at).getTime();
            if (playedAt >= oneWeekAgo) {
                const dayIndex = (new Date(playedAt).getDay() + 6) % 7; // Adjust for Monday start
                dailyListening[dayIndex] += item.track.duration_ms / (1000 * 60 * 60);
            }
        });

        // Calculate the total listening time by summing up all values in dailyListening array
        totalListeningTime = dailyListening.reduce((acc, time) => acc + time, 0);

        return {
            chartData: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [
                    {
                        label: 'Listening Time (hours)',
                        data: dailyListening,
                        fill: false,
                        borderColor: '#36A2EB',
                        tension: 0.1,
                        pointBackgroundColor: '#36A2EB',
                        pointRadius: 5,
                    },
                ],
            },
            totalListeningTime,
        };
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="top-box">
            <Card.Body>
                <h5>Listening Time by Day</h5>
                <Line data={chartData} className="mb-3" />
            </Card.Body>
        </Card>
    );
};

export default ListeningTime;
