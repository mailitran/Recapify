import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const port = 5678;

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

/**
 * MySQL database configuration.
 * @typedef {Object} DbConfig
 * @property {string} host - Database host.
 * @property {string} user - Database user.
 * @property {string} password - Database password.
 * @property {string} database - Database name.
 */
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  
  /**
   * Executes a SQL query.
   * @param {string} query - SQL query.
   * @param {Array<string>} params - Parameters to pass to the query.
   * @returns {Promise<Object>} - Query results.
   */
  async function executeQuery(query, params = []) {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(query, params);
    await connection.end();
    return results;
  }


  
  app.post('/auth/token', async (req, res) => {
    const { spotifyId, accessToken, refreshToken, tokenExpiry } = req.body;

    try {
        // Check if the user exists
        const existingUser = await executeQuery(
            'SELECT id FROM users WHERE spotify_id = ?',
            [spotifyId]
        );

        if (existingUser.length > 0) {
            // Update tokens and token expiry for the existing user
            await executeQuery(
                `UPDATE users 
                 SET access_token = ?, refresh_token = ?, expiry_date = ? 
                 WHERE spotify_id = ?`,
                [accessToken, refreshToken, tokenExpiry, spotifyId]
            );
        } else {
            // Insert a new user 
            await executeQuery(
                `INSERT INTO users (spotify_id, access_token, refresh_token, expiry_date) 
                 VALUES (?, ?, ?, ?)`,
                [spotifyId, accessToken, refreshToken, tokenExpiry]
            );
        }

        res.status(200).send('User saved successfully');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Error saving user');
    }
});

app.post('/sync-recently-played', async(req, res) => {
    try{
        const {userId, access_token, after} = req.body;
        if(!userId){
            return res.status(400).json({error: 'invalid input, must include userID'});
        }
        await syncRecentlyPlayed(userId, access_token, after);
        res.status(200).json({message: 'tracks synced successfully'});
    }catch(err){
        console.error('error syncing recently played tracks:', err);
        res.status(500).json({ error: 'An error occurred while syncing tracks.' });
    }
});

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});

async function fetchRecentlyPlayed(accessToken, after) {
    const url = new URL("https://api.spotify.com/v1/me/player/recently-played");
    url.searchParams.append("limit", 50);
    if (after) url.searchParams.append("after", after);

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to fetch recently played tracks: ${response.status} - ${response.statusText} ${errorDetails.error || 'no further details'}`);
    }

    return response.json();
}

export async function syncRecentlyPlayed(userId, accessToken, afterTimestamp = null) {
    let after = afterTimestamp;
    let allTracks = [];

    while (true) {
        const data = await fetchRecentlyPlayed(accessToken, after);

        if (!data.items.length) break;
        allTracks = allTracks.concat(data.items);

        // Save tracks to database
        await saveTracksToDatabase(userId, data.items);

        // Set `after` for the next request (pagination)
        after = new Date(data.items[data.items.length - 1].played_at).getTime();
    }

    return allTracks;
}

// Save tracks to the database
async function saveTracksToDatabase(userId, tracks) {
    
    const values = tracks.map((track) => [
        userId,
        track.track.id,
        track.track.name,
        track.track.artists.map((artist) => artist.name).join(", "),
        track.played_at,
        track.track.album.name,
        track.track.album.images[0]?.url || null,
    ]);
    const query = `
        INSERT IGNORE INTO recently_played (user_id, track_id, track_name, artist_name, played_at, album_name, image_url)
        VALUES ${values.map(() => '(?,?,?,?,?,?,?)').join(', ')}
    `;
    const flattened = values.flat();

    return executeQuery(query, flattened);
}

