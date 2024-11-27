import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './TopMusic.css';

const limit = 5;

function TopItems() {
    const [topArtists, setTopArtists] = useState(null);
    const [topTracks, setTopTracks] = useState(null);

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

            const data = await response.json();
            console.log(data);

            if (type === 'artists') {
                setTopArtists(data.items);
            } else if (type === 'tracks') {
                setTopTracks(data.items);
            }            
        } catch (err) {

        }
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
                            {topArtists && topArtists.map((artist, index) => (
                                <div key={index} className="top-item">
                                    <span className="item-number">{index + 1}</span>
                                    <div className="artist-info">
                                        <div className="artist-circle">
                                            <img
                                                src={artist.images[0]?.url}
                                                alt={artist.name}
                                                className="artist-image"
                                            />
                                        </div>
                                        <p className="artist-name">{artist.name}</p>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Tracks Box */}
                <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                    <Card className="top-box">
                        <Card.Body>
                            <h5>Top Tracks</h5>
                            {topTracks && topTracks.map((track, index) => (
                                <div key={index} className="top-item">
                                    <span className="item-number">{index + 1}</span>
                                    <div className="track-info">
                                        <div className="track-circle">
                                            <img
                                                src={track.album.images[0]?.url}
                                                alt={track.name}
                                                className="track-image"
                                            />
                                        </div>
                                        <p className="track-name">{track.name}</p>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default TopItems;