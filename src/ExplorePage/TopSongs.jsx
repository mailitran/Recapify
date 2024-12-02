import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Image, ListGroup, Nav } from 'react-bootstrap';
import NavigationBar from '../NavigationBar.jsx';
import ErrorModal from '../ErrorModal.jsx';
//import '../TopMusic.css'

function TopSongs({chart}) {
    const [topSongs, setTopSongs] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect( () => {
      
       getChartData(chart);
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
            console.log(topSongs);
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
    const otherSongs = topSongs.slice(1, 5); // Songs ranked 2-5

  return (
    <Row className="align-items-center">
      {/* Left column: Number 1 song */}
      <Col md={6}>
        <div className="text-center">
          {topSongs.length > 0 && (
            <>
              <Image src={topSongs[0].image} 
              rounded 
              fluid 
              style={{ maxWidth: '100%', maxHeight: '300px' }} />
              <h3 className="mt-3">#1 {topSongs[0].name}</h3>
              <p>{topSongs[0].artist}</p>
            </>
          )}
          
        </div>
      </Col>

      {/* Right column: Songs 2-5 */}
      <Col md={6}>
        <ListGroup className="list-group-dark" variant="flush">
          {otherSongs.map((song, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center bg-dark text-light border-secondary">
              <span className="fw-bold">#{index + 2}</span> {/* Rank */}
              <div className="d-flex flex-column ms-2 align-items-end">
                <div>{song.name}</div> {/* Song name */}
                <div className="text-secondary">{song.artist}</div> {/* Artist */}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
  );
}




export default TopSongs;