import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientId, redirectUrl, tokenEndpoint, saveTokens } from './AuthUtil.jsx';

function Callback() {
    // Navigate to different routes
    const navigate = useNavigate();

    // Parse the URL to retrieve the code parameter
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    useEffect(() => {
        if (code) {
            const fetchToken = async () => {
                try {
                    const data = await getToken(code);
                    if (data && data.access_token) {
                        // Save tokens to local storage
                        saveTokens(data);

                        // Remove code parameter from URL
                        const url = new URL(window.location.href);
                        url.searchParams.delete("code");
                        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
                        window.history.replaceState({}, document.title, updatedUrl);

                        // Navigate to dashboard (user is authenticated)
                        navigate('/dashboard');
                    } else {
                        console.error('Failed to fetch tokens');
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            // Fetch token if code is available
            fetchToken();
        }
    }, [code]);

    // Exchange the authorization code for an access token
    const getToken = async code => {
        // Retrieve code_verifier for PKCE extension
        const code_verifier = localStorage.getItem('code_verifier');

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // URL encoded body
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUrl,
                code_verifier: code_verifier, // Security check with PKCE
            }),
        };

        // Send POST request to exchange code for token
        const response = await fetch(tokenEndpoint, payload);

        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.statusText}`);
        }

        return await response.json();
    }

    return (
        <></> // Redirects to dashboard, no UI needed
    )
}

export default Callback;