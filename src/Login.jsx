import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import './Login.css';
import { clientId, redirectUrl } from './AuthUtil.jsx';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email user-top-read';

function Login() {
    const redirectToSpotifyAuthorize = async () => {
        // Generate a code verifier (high-entropy cryptographic random string with a length of 64 characters)
        const codeVerifier = generateRandomString(64);
        window.localStorage.setItem('code_verifier', codeVerifier);

        // Transform (hash) code verifier using SHA256 algorithm
        const hashed = await sha256(codeVerifier);

        // Hash code verifier (code challenge)
        const codeChallenge = base64encode(hashed);

        const authUrl = new URL(authorizationEndpoint);
        const params = {
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUrl,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
    }

    // Generate a random string (can contain letters, digits, underscores, periods, hyphens, or tildes)
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomValues = crypto.getRandomValues(new Uint8Array(length));
        return randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    // Use SHA256 algorithm to transform (hash) the value
    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    // Return base64 representation of the input
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="justify-content-center">
                <Col xs="auto" className="d-flex justify-content-center">
                    <Card className="text-center login-card">
                        <Card.Body className="card-body-center">
                            <Card.Title>Recapify</Card.Title>
                            <Button
                                onClick={redirectToSpotifyAuthorize}
                                variant="primary"
                                size="lg"
                                className="mt-4 login-button">
                                Log in with Spotify
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;