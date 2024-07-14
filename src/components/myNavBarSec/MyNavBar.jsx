import React, { useState } from 'react';
import './myNavBar.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import defaultImage from '../../assets/images.png';

export default function MyNavBar({ scrollToggle ,token ,loginType}) {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const profileData = Cookies.get('currentLoginedData');

    function handleOffcanvasToggle() {
        setShowOffcanvas((prevShowOffcanvas) => !prevShowOffcanvas);
    };

    const closeOffcanvas = () => {
        setShowOffcanvas(false);
    };

    const handleLogout = ()=>{
        const toastId = toast.loading('Please Wait...');
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseURL}/${loginType}/logout`,{}, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                toast.success(`${response?.data?.message}.`,{
                    id: toastId,
                    duration: 1000
                });
                window.location.reload();
                Cookies.remove('currentLoginedData');
                Cookies.remove('authToken');
            } catch (error) {
                toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
            }
        };
        fetchData();
    };

    return (
        <>
            <Navbar expand="lg" className={`nav__Bg ${scrollToggle ? "nav__fixed py-3 navTransformationDown" : "nav__relative pb-3"} align-items-center`}>
                <Container>
                    <Navbar.Brand className='d-flex align-items-center'>
                        <NavLink className='logo__text' to={`/`}>
                            <>
                                ReachMag<span className='letter__color'>n</span>et
                            </>
                        </NavLink>
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={handleOffcanvasToggle} aria-controls="basic-navbar-nav" />
                    {/* start navbar min-width 992px */}
                    <Navbar.Collapse id="navbar-nav" className='Navbar__Collapse__none__on__med'>
                        <Nav className="mx-auto" >

                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/`}>
                                home
                            </NavLink>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/about-us`}
                            >
                                About us
                            </NavLink>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/shop`}
                            >
                                Shop
                            </NavLink>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/Discover`}
                            >
                                Discover
                            </NavLink>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/contact-us`}
                            >
                                contact us
                            </NavLink>
                        </Nav>
                        <Nav>
                            {
                                token ?
                                <>
                                    <NavLink onClick={handleLogout} to='/' title='Logout' className='nav-link nav__link__style logoutBtn'>
                                        <i className="bi bi-box-arrow-left"></i>
                                    </NavLink>
                                    <NavLink onClick={()=>{
                                            scrollToTop();
                                        }}
                                        className='nav-link nav__link__style nav__profileData'
                                        to='/business-profile'
                                        title='Profile'
                                    >
                                        <img src={JSON.parse(profileData)?.image || defaultImage} alt={`${JSON.parse(profileData)?.name}`} />
                                    </NavLink>
                                </>
                                :
                                <>
                                    <NavLink
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        aria-label="Close"
                                        className={`nav-link nav__link__style sign__up__btn`}
                                        to={`/personalSignUp`}
                                    >
                                        sign up
                                    </NavLink>
                                    <NavLink
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        aria-label="Close"
                                        className={`nav-link nav__link__style sign__in__btn`}
                                        to={`/Login`}
                                    >
                                        sign in
                                    </NavLink>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                    {/* end navbar min-width 992px */}
                    {/* start navbar min-width 320px */}
                    <Navbar.Offcanvas
                        id="offcanvasNavbar" className='Navbar__offCanvas__none__on__lg' aria-labelledby="offcanvasNavbarLabel"
                        show={showOffcanvas}
                        onHide={handleOffcanvasToggle}
                        placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title className='offCanvas__head' id="offcanvasNavbarLabel">
                                <NavLink className='logo__text' to={`/`}>
                                    <>
                                        ReachMag<span className='letter__color'>n</span>et
                                    </>
                                </NavLink>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="mx-auto" >

                                {
                                    token && 
                                    <>
                                        <NavLink onClick={handleLogout} to='/' title='Logout' className='nav-link nav__link__style logoutBtn'>
                                            <i className="bi bi-box-arrow-left"></i>
                                        </NavLink>
                                        <NavLink onClick={()=>{
                                                scrollToTop();
                                            }}
                                            className='nav-link nav__link__style nav__profileData'
                                            to='/business-profile'
                                            title='Profile'
                                        >
                                            <img src={JSON.parse(profileData)?.image || defaultImage} alt={`${JSON.parse(profileData)?.name}`} />
                                        </NavLink>
                                    </>
                                }
                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/`}>
                                    home
                                </NavLink>

                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/about-us`}>
                                    About us
                                </NavLink>
                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/shop`}>
                                    Shop
                                </NavLink>

                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/discover`}>
                                    discover
                                </NavLink>

                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/contact-us`}>
                                    contact us
                                </NavLink>
                                {
                                token ?
                                ''
                                :
                                <>
                                    <NavLink
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        aria-label="Close"
                                        className={`nav-link nav__link__style sign__up__btn`}
                                        to={`/personalSignUp`}
                                    >
                                        sign up
                                    </NavLink>
                                    <NavLink
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        aria-label="Close"
                                        className={`nav-link nav__link__style sign__in__btn`}
                                        to={`/Login`}
                                    >
                                        sign in
                                    </NavLink>
                                </>
                            }
                            </Nav>

                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                    {/* end navbar min-width 320px */}
                </Container>
            </Navbar>
        </>
    )
}
