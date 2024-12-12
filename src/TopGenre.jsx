import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useMetrics } from './TotalListeningMetricsContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TopGenre() {
    // All the variables necessary for the component
    const [topGenre, setTopGenre] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setTotalGenres } = useMetrics();

    // calls getTop Genre when component mounts
    useEffect(() => {
        getTopGenre();
    }, []);

    // Fetches and processes the Top genre data from Spotify API 
    const getTopGenre = async () => {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${access_token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch top genres: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Count the occurances of each genre from top 50 artists
            const genreCounts = data.items.reduce((acc, artist) => {
                artist.genres.forEach((genre) => {
                    acc[genre] = acc[genre] ? acc[genre] + 1 : 1;
                });
                return acc;
            }, {});

            //get unique genres for setting context
            const totalUniqueGenres = Object.keys(genreCounts).length;
            // Update the context with total genres
            setTotalGenres(totalUniqueGenres);

            // Sort genres by count and take the top 10
            const sortedGenres = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1]) 
                .slice(0, 10);

            // separate counts and genres for the chart 
            const genres = sortedGenres.map(([genre]) => genre);
            const counts = sortedGenres.map(([_, count]) => count);

            // setting the chart data 
            setTopGenre({
                labels: genres,
                datasets: [{
                    label: 'Number of Artists per Genre',
                    data: counts,
                    backgroundColor: '#4e73df', 
                    borderColor: '#4e73df', 
                    borderWidth: 1,
                }],
            });
        } catch (err) {
            console.error(err);
            setError("Failed to load top genres");
        } finally {
            setLoading(false);
        }
    };

    // loading message if data is stilll being fetches
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // error message if there was an error
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Render the bar chart with top genres data
    return (
        <div className="container mt-5">
            <div className="chart-box">
            <h5>TOP GENRE</h5>
                <Bar data={topGenre} options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: false,
                        },
                        legend: {
                            display: false,
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                    },
                }} />
            </div>
        </div>
    );
}

export default TopGenre;
