import { useEffect, useState } from 'react';
import { clientId, tokenEndpoint, saveTokens, logOutClick } from './AuthUtil.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import NavigationBar from './NavigationBar.jsx';
import ErrorModal from './ErrorModal.jsx';
import ListeningTime from './ListeningTime.jsx';
import TopMusic from './TopMusic.jsx';
import TopGenre from './TopGenre.jsx';
import TotalPlaylists from './TotalPlaylists.jsx';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Fetch user data when the access token is available or refreshed
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
            setShowErrorModal(true);
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

    // Close the error modal
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
        logOutClick();
    };

    return (
        <>
            <Container fluid>
                {!error && !loading && (
                    <>
                        <NavigationBar userData={userData} />
                        <Row className="mt-5">
                            <Col lg={12}>
                                <TopMusic />
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col lg={12}>
                                <TopGenre />
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col lg={12}>
                                <ListeningTime />
                            </Col>
                            <TotalPlaylists />

                        </Row>
                        {/* Add more rows/columns for other components */}
                    </>
                )}
            </Container>

            <ErrorModal
                show={showErrorModal}
                error={error}
                onHide={handleCloseErrorModal}
            />
        </>
    )
}

export default Dashboard;