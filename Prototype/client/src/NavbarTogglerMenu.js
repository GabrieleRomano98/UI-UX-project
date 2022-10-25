import { Container, Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { IoIosHome } from 'react-icons/io'
import { useEffect, useState } from 'react';
import API from './API';

function NavbarTogglerMenu(props) {

    const [chats, setChats] = useState(0)

    useEffect(() => {
        API.getAnnounces().then(announces => props.setUnread(announces.filter(an => (an.forID === -1) && an.read === 0).length));
        API.getChats().then( c => setChats(c.filter(e => e.unread === 1).length));
    }, []);

    return (
        <Navbar className="first-color" expand="lg">
            <Container fluid>
                <Navbar.Toggle id="nav_toggle" aria-controls="navbar-light-example" className="custom-toggler second-color" />
                <Link to="/"><IoIosHome size={40} className='first-color' /></Link>
                <Navbar.Collapse id="navbar-light-example">
                    <Nav style={{ marginTop: "10px" }}>
                        <Link to="/profile">
                            <NavDropdown.Item onClick={() => document.getElementById('nav_toggle').click()} className="first-color" href="/profile">Profile</NavDropdown.Item>
                        </Link>
                        <Link to="/announce">
                            <NavDropdown.Item onClick={() => { props.setUnread(0); document.getElementById('nav_toggle').click(); }} className="first-color" href="/announce">Announcements {props.unread !== 0 && <Badge variant="warning">{props.unread}</Badge>}</NavDropdown.Item>
                        </Link>
                        <Link to="/support">
                            <NavDropdown.Item onClick={() => document.getElementById('nav_toggle').click()} className="first-color" href="/support">Messages {chats !== 0 && <Badge variant="warning">New</Badge>}</NavDropdown.Item>
                        </Link>
                        <Link to="/about">
                            <NavDropdown.Item onClick={() => document.getElementById('nav_toggle').click()} className="first-color" href="/about">About</NavDropdown.Item>
                        </Link>
                        <NavDropdown.Divider />
                        <NavDropdown.Item className="first-color" href="/logout">Logout</NavDropdown.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavbarTogglerMenu;