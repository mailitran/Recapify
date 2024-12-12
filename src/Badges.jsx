import './Badges.css';
import { useMetrics } from './TotalListeningMetricsContext'; // Import the context
import { Card, Col } from 'react-bootstrap';

//component containing badge classifications based on metrics context
function Badges() {
    const { totalListeningTime, totalGenres } = useMetrics(); // Access totalListeningTime and totalGenresfrom context

    //genres
    const genreClassification = [
        { name: 'Explorer', emoji: '🌍', min: 30, color: 'gold' },
        { name: 'Adventurer', emoji: '🎵', min: 15, max: 30, color: 'silver' },
        { name: 'Beginner', emoji: '🎧', min: 1, max: 15, color: 'bronze' },
        { name: 'No Badge', emoji: '', min: 0, max: 1, color: 'default' },
      ];

      //listening time in hours
      const listeningTimeClassification = [
        { name: 'Gold', emoji: '🏅', min: 16, color: 'gold' },
        { name: 'Silver', emoji: '🥈', min: 6, max: 16, color: 'silver' },
        { name: 'Bronze', emoji: '🥉', min: 1, max: 6, color: 'bronze' },
        { name: 'No Badge', emoji: '', min: 0, max: 1, color: 'default' },
      ];

    return (
        <>
            <BadgeDisplay
                title="Weekly Listening Hours Badge"
                metric={totalListeningTime}
                classification={listeningTimeClassification}
            />
            <BadgeDisplay
                title="Weekly Genres Badge"
                metric={totalGenres}
                classification={genreClassification}
            />
        </>
    );
};

//display custom badges
function BadgeDisplay({title, metric, classification}){
    const getBadge = () => {
        for(const badge of classification){
            if(metric >= badge.min && (badge.max === undefined || metric < badge.max)){
                return badge;
            }
        }
        return classification[classification.length - 1];
    };
    const badge = getBadge();
    return(
        <Card className="top-box">
            <Card.Body>
                <h5>{title}</h5>

                <div className="badge">
                    <div>
                        <span className={`badge-${badge.color}`}>{badge.emoji} {badge.name}</span>
                        <p>
                            {(badge.max && badge.min != 0 )
                                ? `${badge.min}-${badge.max} Total`
                                : `${badge.min}+ Total`}
                            {badge.min == 0 && "None yet, keep on listening!"}
                        </p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
    
};

export default Badges;