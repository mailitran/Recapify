import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Image, ListGroup } from 'react-bootstrap';
import NavigationBar from '../NavigationBar.jsx';
import ErrorModal from '../ErrorModal.jsx';
//import '../TopMusic.css'

function TopSongs() {
    const [topSongs, setTopSongs] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
       getChartData("billboard-200");
    },[]);

    const getChartData = async (chart) => {
        const url = `https://raw.githubusercontent.com/KoreanThinker/billboard-json/main/${chart}/recent.json`;

         try {
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Error fetching song chart");
            }
            const result = await response.json();
            setTopSongs(
                result.data.slice(0,5).map((data) => ({
                    name: data.name,
                    artist: data.artist,
                    image: data.image,
                }))
            );
            
        } catch (err) {
            setError(err.message);
        }
    }
    
    if (error) {
        return (
            <Alert variant="danger" className="text-center">
                {error}
            </Alert>
        );
    }
    const topSong = topSongs[0]; // Number 1 song
    const otherSongs = topSongs.slice(1, 5); // Songs ranked 2-5

  return (
    <Row className="align-items-center">
      {/* Left column: Number 1 song */}
      <Col md={6}>
        <div className="text-center">
          {topSongs[0] !== undefined && <Image src={topSongs[0].image} rounded fluid style={{ maxWidth: '100%', maxHeight: '300px' }} />}
          <h3 className="mt-3">#1 {topSongs[0].name}</h3>
          <p>{topSongs[0].artist}</p>
        </div>
      </Col>

      {/* Right column: Songs 2-5 */}
      <Col md={6}>
        <ListGroup variant="flush">
          {otherSongs.map((song, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">#{index + 2}</span> {/* Rank */}
              <div>
                <div>{song.name}</div> {/* Song name */}
                <div className="text-muted">{song.artist}</div> {/* Artist */}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
  );

    // return (
            
    //         <Row>
    //         {topSongs.map((track, index) => (
    //             <Col key={index} md={6} lg={4} className="mb-4">
    //                 <Card bg="dark" text="white" className="h-100">
    //                     <Card.Img variant="top" src={track.image} />
    //                     <Card.Body>
    //                         <Card.Title>{track.title}</Card.Title>
    //                         <Card.Text>{track.artist}</Card.Text>
    //                     </Card.Body>
    //                 </Card>
    //             </Col>
    //         ))}
    //     </Row>
        
    // );
}




export default TopSongs;