import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ListeningTime from './ListeningTime';
import TotalPlaylists from './TotalPlaylists';
import TopGenre from './TopGenre.jsx';

const StatsRow = () => {
    return (
        <div className="container mt-5">
            <h3 className="box-title">Stats</h3>
            <Row>
                <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                    <ListeningTime />
                </Col>
                <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                    <TotalPlaylists />
                </Col>
                <TopGenre />
                <Row>
                    <div className="container mt-5">
                        <br></br>
                    </div>
                </Row>
            </Row>
        </div>
    );
};

export default StatsRow;
