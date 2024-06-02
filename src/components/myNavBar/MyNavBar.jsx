import React from 'react';
import './MyNavBar.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function MyNavBar() {
    return (
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Reach Magnet</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to='/profile' className="nav-link">Profile</NavLink>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}
