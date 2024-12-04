import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { logOutClick } from './AuthUtil.jsx';
import NavigationBar from './NavigationBar.jsx';
import ErrorModal from './ErrorModal.jsx';
import TopMusic from './TopMusic.jsx';
import Stats from './Stats.jsx';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Fetch user data when the access token is available or refreshed
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
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    }

    // Close the error modal and log out
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
                        <Stats />{/* Has Row and Col inside return  */}
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