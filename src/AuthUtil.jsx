export const clientId = '44f5089986764d43bca04d7a08358c0d';
export const redirectUrl = 'http://localhost:5173/callback';
export const tokenEndpoint = "https://accounts.spotify.com/api/token";

// Save tokens to local storage
export const saveTokens = (data) => {
    const { access_token, refresh_token, expires_in } = data;
    const now = new Date();
    const expiry_date = new Date(now.getTime() + expires_in * 1000);

    // Update local storage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);
    localStorage.setItem('expiry_date', expiry_date);
}

export const logOutClick = () => {
    localStorage.clear();
    window.location.href = 'http://localhost:5173';
}