import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { Card, Col } from 'react-bootstrap';

const TotalPlaylists = () => {
    //ststes for playlists and errors
    const [playlistCount, setPlaylistCount] = useState(0);
    const [error, setError] = useState(null);

    // useEffect hook to fetch playlist data when component mounts
    useEffect(() => {
        fetchPlaylistsData();
    }, []);

    //function to fetch data from Spotify API 
    const fetchPlaylistsData = async () => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            console.error("Access token not found");
            setError("Access token not found");
            return;
        }
        // making Api request 
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            // getting the error if there is any 
            if (!response.ok) {
                throw new Error(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Playlists Data:', data);

            // Set the total playlists count
            setPlaylistCount(data.total);
        } catch (error) {
            console.error("Error fetching playlists:", error);
            setError("Failed to load playlist data");
        }
    };

    // If there is an error display it 
    if (error) {
        return <div>{error}</div>;
    }

    //render the component 
    return (
            <Card className="top-box">
                <Card.Body>
                    <h5>Total Playlists Followed or Owned</h5>
                    <div>
                        <h1>
                            {/* Use CountUp for animated number display */}
                            <CountUp
                                start={0}
                                end={playlistCount}
                                duration={5}
                                separator=","
                                delay={5}
                            />
                        </h1>
                    </div>
                </Card.Body>
            </Card>
    );
};

export default TotalPlaylists;
