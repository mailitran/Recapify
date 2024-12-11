// Client ID used for OAuth authentication
export const clientId = '44f5089986764d43bca04d7a08358c0d';
// Redirect URL after authentication (OAuth flow)
export const redirectUrl = 'http://localhost:5173/callback';
// Endpoint for refreshing the access token from Spotify API
export const tokenEndpoint = "https://accounts.spotify.com/api/token";

// Save tokens to local storage
export const saveTokens = (data) => {
    const { access_token, refresh_token, expires_in } = data;

    // Convert expires_in (seconds) to a Date object
    const now = new Date();
    const expiry_date = new Date(now.getTime() + expires_in * 1000);

    // Update local storage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);
    localStorage.setItem('expiry_date', expiry_date);

    saveUserToDb(null, access_token, refresh_token, expiry_date)
        .then(() => {
            console.log("user saved");
        })
        .catch((error) => {
            console.error("error saving user:", error);
        });
}

// Redirect to log in page
export const logOutClick = () => {
    // Clear all stored authentication data
    localStorage.clear();
    window.location.href = 'http://localhost:5173';
}

export const fetchSpotifyUserId = async () => {
    const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage

    if (!accessToken) {
        console.error('Access token is missing. Please log in.');
        return null;
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`, // Add the access token to the request
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile. Please check your token.');
        }

        const data = await response.json();
        return data.id; // Spotify user ID is returned
    } catch (error) {
        console.error('Error fetching Spotify user profile:', error);
        return null;
    }
};

const saveUserToDb = async (userId, accessToken, refreshToken, tokenExpiry) => {
    try {
        if(!userId){
            userId = await fetchSpotifyUserId();
        }
        localStorage.setItem("userID", userId);
        const response = await fetch('http://localhost:5678/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spotifyId: userId,
                accessToken: accessToken,
                refreshToken: refreshToken,
                tokenExpiry: tokenExpiry,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save user to backend');
        }

        console.log('User saved successfully');
    } catch (error) {
        console.error('Error saving user to backend:', error);
    }
};