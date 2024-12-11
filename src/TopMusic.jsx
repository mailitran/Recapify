import { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import './TopMusic.css';
import './RecommendMusic';
import RecommendMusic from './RecommendMusic';

const limit = 3; // Limit number of items to fetch (Top 3)

function TopMusic() {
    const [topArtists, setTopArtists] = useState([]); // Store top artists
    const [topTracks, setTopTracks] = useState([]); // Store top tracks
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Store error message

    useEffect(() => {
        getTopMusic('artists');
        getTopMusic('tracks');
    }, []);

    // Retrieve the top 3 tracks/artists from the last 6 months
    const getTopMusic = async (type) => {
        try {
            const access_token = localStorage.getItem('access_token');

            // Default time range is approximately within the last 6 months
            const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + access_token },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch top ${type}: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Update state based on type (artists or tracks)
            if (type === 'artists') {
                setTopArtists(data.items);
            } else if (type === 'tracks') {
                setTopTracks(data.items);
            }
        } catch (err) {
            console.error(err);
            // Display error status, otherwise error message if network error
            const errorMessage = err.response
                ? `Error: ${err.response.status} ${err.response.statusText} - Failed to fetch top ${type}`
                : `Network Error: ${err.message || 'Unknown error'}`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    // Show loading spinner while fetching data
    const renderLoading = () => (
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
        </div>
    )

    // Render top music (artists or tracks)
    const renderTopItems = (items, type) => {
        if (loading) return renderLoading(); // Show spinner if loading
        if (error) return <div className="error-message">{error}</div>;

        // Show error message if no items are available
        if (items.length === 0) {
            return <div className="error-message">No {type} available.</div>;
        }

        // Render each card for artist or track
        return items.map((item, index) => (
            <Col key={index} xs={12} sm={4} md={4} lg={4} className="mb-4">
                <Card className="top-box">
                    <Card.Body className="text-center">
                        <div className={type === 'artist' ? "artist-square" : "track-square"}>
                            <img
                                src={type === 'artist' ? item.images[0]?.url : item.album.images[0]?.url}
                                alt={type === 'artist' ? item.name : item.name}
                                className={type === 'artists' ? "img-fluid artist-image" : "img-fluid track-image"}                            />
                        </div>
                        <p className={type === 'artist' ? "top-artist-name" : "top-track-name"}>{item.name}</p>
                    </Card.Body>
                </Card>
            </Col>
        ));
    }


    return (
        <div className="container mt-5">
            <h3 className="box-title">Top 3 Artists</h3>
            <Row className="mt-3">
                {/* Top Artist Cards */}
                {renderTopItems(topArtists, 'artist')}
            </Row>
            <h3 className="box-title mt-5">Top 3 Tracks</h3>
            <Row className="mt-3">
                {/* Top Track Cards */}
                {renderTopItems(topTracks, 'track')}
            </Row>
            <h3 className="box-title mt-5">Song Recommendations</h3>
            {topTracks && <RecommendMusic topTracks={topTracks} />}
        </div>
    )
}

export default TopMusic;