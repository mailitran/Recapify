import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ListeningTime from './ListeningTime';
import TotalPlaylists from './TotalPlaylists';
import TopGenre from './TopGenre.jsx';
import Badges from './Badges';
import { MetricsProvider } from './TotalListeningMetricsContext.jsx'; // Import the TotalListeningTime provider

const StatsRow = () => {
    return (
        <MetricsProvider>
            <div className="container mt-5">
                <h3 className="box-title">Stats</h3>
                <Row>
                    <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                        <ListeningTime />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
                        <TotalPlaylists />
                        <div className="mt-3"> {/* Add margin-bottom here */}
                            <Badges />
                        </div>
                    </Col>
                    <TopGenre />
                    <Row>
                        <div className="container mt-5">
                            <br></br>
                        </div>
                    </Row>
                </Row>
            </div>
        </MetricsProvider>
    );
};

export default StatsRow;
