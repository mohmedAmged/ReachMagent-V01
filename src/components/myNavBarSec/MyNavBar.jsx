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

export default function MyNavBar({ scrollToggle, token, loginType, totalCartItemsInCart, totalWishlistItems }) {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const profileData = Cookies.get('currentLoginedData');

    function handleOffcanvasToggle() {
        setShowOffcanvas((prevShowOffcanvas) => !prevShowOffcanvas);
    };

    const closeOffcanvas = () => {
        setShowOffcanvas(false);
    };

    const handleLogout = () => {
        const toastId = toast.loading('Please Wait...');
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseURL}/${loginType}/logout?t=${new Date().getTime()}`, {}, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                toast.success(`${response?.data?.message}.`, {
                    id: toastId,
                    duration: 1000
                });
                window.location.reload();
                Cookies.remove('currentLoginedData');
                Cookies.remove('authToken');
                Cookies.remove('CurrentFollowedCompanies');
                Cookies.remove('currentUpdatedCompanyData');
                Cookies.remove('currentUpdatingActivities');
                localStorage.removeItem('updatingData');
                localStorage.removeItem('updatingCompany');
                localStorage.removeItem('updatingProfile');
                localStorage.removeItem('updatingCompanyActivities');
            } catch (error) {
                Cookies.remove('authToken');
                toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                window.location.reload();
            };
        };
        closeOffcanvas();
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
                                to={`/About-ReachMagnet`}
                            >
                                About us
                            </NavLink>
                            {/* <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/shop`}
                            >
                                Shop
                            </NavLink> */}
                            {/* <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/Discover`}
                            >
                                Discover
                            </NavLink> */}
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/all-companies`}
                            >
                                Companies
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
                                        <NavLink 
                                        aria-label="Close"
                                        onClick={handleLogout} 
                                        to='/' title='Logout' 
                                        className='nav-link nav__link__style logoutBtn'>
                                            <i className="bi bi-box-arrow-left"></i>
                                        </NavLink>
                                        <NavLink 
                                            onClick={() => {
                                                scrollToTop();
                                            }}
                                            aria-label="Close"
                                            className='nav-link nav__link__style nav__profileData'
                                            to='/profile/profile-settings'
                                            title='Profile'
                                        >
                                            <img src={profileData ? JSON.parse(profileData)?.image : defaultImage}
                                                alt='img-check'
                                            />
                                        </NavLink>
                                        {/* {
                                            loginType === 'user' &&
                                            <NavLink onClick={() => {
                                                    scrollToTop();
                                                }} 
                                                to='/my-wishlist' 
                                                title='wishlist' 
                                                className='nav-link nav__link__style logoutBtn showNumHandler'
                                                aria-label="Close"
                                            >
                                                <i className="bi bi-heart"></i>
                                                {
                                                    totalWishlistItems > 0 &&
                                                    <span className='wishlistItemNum'>{totalWishlistItems}</span>
                                                }
                                            </NavLink>
                                        }
                                        {
                                            <NavLink onClick={() => {
                                                    scrollToTop();
                                                }} 
                                                aria-label="Close"
                                                to='/my-cart' 
                                                title='cart' 
                                                className='nav-link nav__link__style logoutBtn showNumHandler'
                                            >
                                                
                                                <i className="bi bi-cart4"></i>
                                                {
                                                    totalCartItemsInCart > 0 &&
                                                    <span>{totalCartItemsInCart}</span>
                                                }
                                            </NavLink>
                                        } */}
                                        
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
                        <Offcanvas.Body className="OffcanvasBody__Scrollable">
                            <Nav className="mx-auto" >
                                {
                                    token &&
                                    <>
                                        <NavLink onClick={handleLogout} to='/' title='Logout' className='nav-link nav__link__style logoutBtn'>
                                            <i className="bi bi-box-arrow-left"></i>
                                        </NavLink>
                                        <NavLink onClick={() => {
                                            scrollToTop();
                                            closeOffcanvas();
                                        }}
                                            className='nav-link nav__link__style nav__profileData'
                                            to='/profile/profile-settings'
                                            title='Profile'
                                        >
                                            <img src={profileData ? JSON.parse(profileData)?.image : defaultImage}
                                                alt='img-check'
                                            />
                                        </NavLink>
                                        {/* {
                                            loginType === 'user' &&
                                            <NavLink onClick={() => {
                                                scrollToTop();
                                                closeOffcanvas();
                                            }} to='/my-wishlist' title='wishlist' className='nav-link nav__link__style logoutBtn showNumHandler'>
                                                <i className="bi bi-heart"></i>
                                                {
                                                    totalWishlistItems !== 0 &&
                                                    <span className='wishlistItemNum'>{totalWishlistItems}</span>
                                                }
                                            </NavLink>
                                        }
                                        {
                                            <NavLink onClick={() => {
                                                scrollToTop();
                                                closeOffcanvas();
                                            }} to='/my-cart' title='cart' className='nav-link nav__link__style logoutBtn showNumHandler'>
                                                <i className="bi bi-cart4"></i>
                                                {
                                                    totalCartItemsInCart !== 0 &&
                                                    <span>{totalCartItemsInCart}</span>
                                                }
                                            </NavLink>
                                        } */}
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
                                    to={`/About-ReachMagnet`}>
                                    About us
                                </NavLink>
                                {/* <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/shop`}>
                                    Shop
                                </NavLink> */}

                                {/* <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/discover`}>
                                    discover
                                </NavLink> */}
                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/all-companies`}
                                >
                                    Companies
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
                                                    closeOffcanvas();
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
                                                    closeOffcanvas();
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
