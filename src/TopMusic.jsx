import { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import './TopMusic.css';
import './RecommendMusic';
import RecommendMusic from './RecommendMusic';
const limit = 5;

function TopItems() {
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getTopMusic('artists');
        getTopMusic('tracks')
    }, []);

    // Retrieve the top tracks/artists
    const getTopMusic = async (type) => {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + access_token },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch top ${type}: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (type === 'artists') {
                setTopArtists(data.items);
            } else if (type === 'tracks') {
                setTopTracks(data.items);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response
                ? `Error: ${err.response.status} ${err.response.statusText} - Failed to fetch top ${type}`
                : `Network Error: ${err.message || 'Unknown error'}`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    // Loading spinner
    const renderLoading = () => (
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
        </div>
    )

    // Render top music (artists or tracks)
    const renderTopItems = (items, type) => {
        if (loading) return renderLoading();
        if (error) return <div className="error-message">{error}</div>;

        if (items.length === 0) {
            return <div className="error-message">No {type} available.</div>;
        }

        return items.map((item, index) => (
            <div key={index} className="top-item">
                <span className="item-number">{index + 1}</span>
                <div className={type === 'artist' ? "artist-info" : "track-info"}>
                    <div className={type === 'artist' ? "artist-circle" : "track-circle"}>
                        <img
                            src={type === 'artist' ? item.images[0]?.url : item.album.images[0]?.url}
                            alt={type === 'artist' ? item.name : item.name}
                            className={type === 'artist' ? "artist-image" : "track-image"}
                        />
                    </div>
                    <p className={type === 'artist' ? "artist-name" : "track-name"}>{item.name}</p>
                </div>
            </div>
        ))
    }


    return (
        <div className="container mt-5">
            <h3 className="box-title">Top Music</h3>
            <Row className="mt-3">
                {/* Top Artists Box */}
                <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                    <Card className="top-box">
                        <Card.Body>
                            <h5>Top Artists</h5>
                            {renderTopItems(topArtists, 'artist')}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Tracks Box */}
                <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                    <Card className="top-box">
                        <Card.Body>
                            <h5>Top Tracks</h5>
                            {renderTopItems(topTracks, 'track')}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {topTracks && <RecommendMusic topTracks={topTracks} />}
        </div>
    )
}

export default TopItems;