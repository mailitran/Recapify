import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { clientId, tokenEndpoint, saveTokens } from '../AuthUtil.jsx';

import NavigationBar from '../NavigationBar.jsx';
import TopSongs from './TopSongs.jsx';

function Explore(){
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const albums = "billboard-200";
    const songs = "billboard-hot-100";
    
    useEffect(() => {
        getUserData();
    }, []);
    // Automatically refresh the token before it expires
    useEffect(() => {
        const intervalId = setInterval(async () => {
            let expiry_date = new Date(localStorage.getItem('expiry_date'));
            const now = new Date();

            const deadband = 5 * 60 * 1000;  // Set a 5 minute deadband (5 minutes in milliseconds)
            expiry_date = new Date(expiry_date.getTime() - deadband);

            if (expiry_date <= now) {
                // Token has expired, refresh it
                const data = await refreshToken();
                saveTokens(data);
            }
        }, 60000); // 1 minute in milliseconds

        return () => clearInterval(intervalId);
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

    // Refresh the access token if expired
    const refreshToken = async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');

            const payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refresh_token,
                    client_id: clientId
                }),
            }

            const response = await fetch(tokenEndpoint, payload);
            const data = await response.json();

            if (!data.access_token) {
                throw new Error('Failed to refresh access token');
            }

            return data;
        } catch (err) {
            console.error(err);
            setError("Unable to refresh token. Please try logging in again");
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
                                <TopSongs chart={songs}/>
                            </Card.Body>
                        </Card>
                        
                        <Card bg="dark" text="white" className="p-4 rounded shadow">
                            <Card.Body>
                                <h5>THIS WEEK: TOP ALBUMS</h5>
                                <TopSongs chart={albums}/>
                            </Card.Body>
                        </Card>                        
                        </Col>
                    </Row>
            </> 
            )}
            
        </Container>
    )
}

export default Explore;