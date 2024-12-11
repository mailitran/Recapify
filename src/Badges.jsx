

function Badges(){
    useEffect(() => {
        syncRecentlyPlayedData(localStorage.getItem("userID"), localStorage.getItem("access_token", null));
    }, []);
    

    const syncRecentlyPlayedData = async (userId, access_token) => {
        try {
          const response = await fetch('http://localhost:5678/sync-recently-played', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              access_token,
              after: null 
            }),
          });
      
          // Parse the response from the server
          const result = await response.json();
      
          if (response.ok) {
            console.log('Tracks synced successfully:', result.message);
          } else {
            console.error('Error syncing tracks:', result.error);
          }
        } catch (error) {
          console.error('Network error occurred while syncing:', error);
        }
      };
}