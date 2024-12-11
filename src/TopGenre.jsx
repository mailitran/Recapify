import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TopGenre() {
    const [topGenre, setTopGenre] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userID");
    useEffect(() => {
        getTopGenre();
        //syncRecentlyPlayedData(userId, localStorage.getItem("access_token", null));
    }, []);
    

    // const syncRecentlyPlayedData = async (userId, access_token) => {
    //     try {
    //       const response = await fetch('http://localhost:5678/sync-recently-played', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           userId,
    //           access_token,
    //           after: null 
    //         }),
    //       });
      
    //       // Parse the response from the server
    //       const result = await response.json();
      
    //       if (response.ok) {
    //         console.log('Tracks synced successfully:', result.message);
    //       } else {
    //         console.error('Error syncing tracks:', result.error);
    //       }
    //     } catch (error) {
    //       console.error('Network error occurred while syncing:', error);
    //     }
    //   };
    const getTopGenre = async () => {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${access_token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch top genres: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Get genres from top artists
            const genreCounts = data.items.reduce((acc, artist) => {
                artist.genres.forEach((genre) => {
                    acc[genre] = acc[genre] ? acc[genre] + 1 : 1;
                });
                return acc;
            }, {});

            // Sort genres by count and take the top 10
            const sortedGenres = Object.entries(genreCounts)
                .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
                .slice(0, 10); // Take the top 10

            const genres = sortedGenres.map(([genre]) => genre);
            const counts = sortedGenres.map(([_, count]) => count);

            setTopGenre({
                labels: genres,
                datasets: [{
                    label: 'Number of Artists per Genre',
                    data: counts,
                    backgroundColor: '#4e73df', // Set bar color
                    borderColor: '#4e73df', // Border color
                    borderWidth: 1,
                }],
            });
        } catch (err) {
            console.error(err);
            setError("Failed to load top genres");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="chart-box">
            <h5>TOP GENRE</h5>
                <Bar data={topGenre} options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: false,
                        },
                        legend: {
                            display: false,
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                    },
                }} />
            </div>
        </div>
    );
}

export default TopGenre;
