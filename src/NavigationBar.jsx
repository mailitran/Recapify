import { Container, Navbar, Dropdown } from 'react-bootstrap';
import { logOutClick } from './AuthUtil.jsx';

function NavigationBar({ userData }) {
    return (
        <Navbar className="fixed-top w-100" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand
                    style={{
                        // fontFamily: "'Tahoma', sans-serif",
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>Recapify</Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" className="bg-transparent border-0 text-white align-items-center">
                                <img
                                    src={userData?.images?.length > 0 ? userData.images[0].url : '/profile-pic.jpg'}
                                    alt="Profile"
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px' }}>
                                </img>
                                {userData.display_name}
                            </Dropdown.Toggle>

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