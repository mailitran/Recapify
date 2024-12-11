import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { logOutClick } from './AuthUtil.jsx';

// Navigation bar at the top of each page
function NavigationBar({ userData }) {
    return (
        <Navbar className="fixed-top w-100" data-bs-theme="dark" expand="lg" style={{ backgroundColor: '#181818' }}>
            <Container>
                <Navbar.Brand
                    style={{
                        // fontFamily: "'Tahoma', sans-serif",
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>Recapify</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/dashboard" className="text-white">
                        Dashboard
                    </Nav.Link>
                    <Nav.Link href="/explore" className="text-white">
                        Explore
                    </Nav.Link>
                </Nav>
                <Navbar.Toggle aria-controls="navbar-nav" />

                {/* Profile dropdown */}
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" className="bg-transparent border-0 text-white align-items-center">
                                {/* Spotify profile picture, otherwise default profile pic */}
                                <img
                                    src={userData?.images?.length > 0 ? userData.images[0].url : '/profile-pic.jpg'}
                                    alt="Profile"
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px' }}>
                                </img>
                                {userData?.display_name || 'Guest'}
                            </Dropdown.Toggle>

                            {/* Log out dropdown */}
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={logOutClick}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;