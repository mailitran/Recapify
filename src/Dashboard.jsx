import { useEffect, useState } from 'react';
import { clientId, tokenEndpoint, logOutClick } from './AuthUtil.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import NavigationBar from './NavigationBar.jsx';
import ErrorModal from './ErrorModal.jsx';
import TopMusic from './TopMusic.jsx';

function Dashboard() {
    const [accessToken, setAccessToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Fetch user data when the access token is available or refreshed
    useEffect(() => {
        getUserData();
    }, [accessToken]);

    // Fetch user data
    const getUserData = async () => {
        try {
            const access_token = await checkToken();
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + access_token },
            });

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            setError('Unable to fetch user data. App is in development mode. Only authorized users can be authenticated.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    }

    // Check if token is expired and refresh if necessary
    const checkToken = async () => {
        const accessToken = localStorage.getItem('access_token');
        const expiryDate = new Date(localStorage.getItem('expiry_date'));
        const now = new Date();

        if (!accessToken || expiryDate <= now) {
            const data = await refreshToken();
            saveTokens(data);
            return data.access_token;
        }

        return accessToken;
    }

    // Refresh the access token if expired
    const refreshToken = async () => {
        const refresh_token = localStorage.getItem('refresh_token');

        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
        });

        if (!response.ok || !data.access_token) {
            throw new Error('Failed to refresh access token');
        }

        setAccessToken(localStorage.getItem('access_token'));
        return await response.json();
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