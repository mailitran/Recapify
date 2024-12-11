import './Badges.css';
import { useTotalListeningTime } from './TotalListeningTimeContext'; // Import the context
import { Card, Col } from 'react-bootstrap';

function Badges() {
    const { totalListeningTime } = useTotalListeningTime(); // Access totalListeningTime from context

    // Determine the badge based on total listening time
    const getBadge = () => {
        if (totalListeningTime >= 16) {
            return 'Gold';
        } else if (totalListeningTime >= 6) {
            return 'Silver';
        } else if (totalListeningTime >= 1) {
            return 'Bronze';
        } else {
            return 'No Badge'; // If no listening time
        }
    };

    // Get the badge based on total listening time
    const badge = getBadge(totalListeningTime);

    return (
        <Card className="top-box">
            <Card.Body>
                <h5>Weekly Listening Time Badge</h5>
                <div className="badge">
                    {badge === 'Gold' && (
                        <div>
                            <span className="badge-gold">🏅 Gold</span>
                            <p>16+ Total Hours</p>
                        </div>
                    )}
                    {badge === 'Silver' && (
                        <div>
                            <span className="badge-silver">🥈 Silver</span>
                            <p>6-15 Total Hours</p>
                        </div>
                    )}
                    {badge === 'Bronze' && (
                        <div>
                            <span className="badge-bronze">🥉 Bronze</span>
                            <p>1-5 Total Hours</p>
                        </div>
                    )}
                    {badge === 'No Badge' && (
                        <div>
                            <span>No Badge</span>
                            <p>0 Total Hours</p>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default Badges;