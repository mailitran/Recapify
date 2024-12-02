import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './RecommendMusic.css';


function RecommendMusic({ topTracks }) {
    console.log("This is test file!")
     const[musicRec, setMusicRec] = useState([]);
     
    useEffect(() => {
        //Get info from each track
        if (topTracks) {
            getRecommedation(topTracks);
        }
    }, [topTracks]);

    //Get different tracks from the artist of the top tracks.
    const getRecommedation =async(topTracks)=>{
        try{
            const access_token = localStorage.getItem('access_token');
            //get the id of artists
            const artistID =[...new Set(
                topTracks.map(track=>track.artists[0]?.id)
            )];
            const trackID = new Set(topTracks.map(track=>track.id));
            const getSongs = [];
            
            for( const aID of artistID){
                const response = await fetch(
                    `https://api.spotify.com/v1/artists/${aID}/top-tracks?market=US`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${access_token}` },
                    }
                );
                    const data = await response.json();
                    if(data.tracks){
                        //find and get rid of songs that match top songs
                        const newSong = data.tracks.filter(track => !trackID.has(track.id));
                        console.log(newSong);
                        getSongs.push(...newSong);
                    }
                
            }
            //include up to 5 songs
            setMusicRec(getSongs.slice(0,5))

        }
        catch(err){}
    }
    return (        
    <div>
        <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
        <Card className="rec-box">
                <Card.Body className="rec-box">
                <h5>Recommended Songs By Artists You Listen To:</h5>
            {musicRec.length > 0 ? (
                musicRec.map((track, index) => (
                    <div key={index} className = "rec-item">
                        <span className="item-number">{index + 1}</span>
                        <div className="track-info">
                        <div className="track-circle">
                            <img
                                src={track.album.images[0]?.url}
                                alt={track.name}
                                className="track-image"
                            />                       
                        </div>
                        <p>
                            <strong>{track.name}</strong> by {track.artists.map(artist => artist.name).join(', ')}
                        </p>
                        </div>
                     </div>
            ))
        ) : (
            <p>No recommendations available yet..</p>
        )}
                    </Card.Body>
            </Card>
        </Col>
    </div>
);
}

export default RecommendMusic;
