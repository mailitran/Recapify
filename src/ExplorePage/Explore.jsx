import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';

import NavigationBar from '../NavigationBar.jsx';
import TopSongs from './TopSongs.jsx';

function Explore() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const albums = "billboard-200";
    const songs = "billboard-hot-100";

    useEffect(() => {
        getUserData();
    }, []);

    // Fetch user data
    const getUserData = async () => {
        try {
            const access_token = localStorage.getItem('access_token');

            const response = await fetch("https://api.spotify.com/v1/me", {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + access_token },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            setError('Unable to fetch user data. App is in development mode. Only authorized users can be authenticated.');
            //setShowErrorModal(true);
        } finally {
           setLoading(false);
         }
    }

    if (error) {
        return (
            <Alert variant="danger" className="text-center">
                {error}
            </Alert>
        );
    }

    return (
        <Container fluid>
            {!error && !loading && (
                <>
                    <NavigationBar userData={userData} />
                    
                    <Row className="mt-5">
                        <Col lg={12}>
                            <Card bg="dark" text="white" className="p-4 rounded shadow">
                                <Card.Body>
                                    <h5>THIS WEEK: TOP SONGS</h5>
                                    <TopSongs chart={songs} />
                                </Card.Body>
                            </Card>

                            <Card bg="dark" text="white" className="p-4 rounded shadow">
                                <Card.Body>
                                    <h5>THIS WEEK: TOP ALBUMS</h5>
                                    <TopSongs chart={albums} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            
        </Container>
    );
}

export default Explore;