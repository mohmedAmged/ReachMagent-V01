import React, { useEffect, useState } from 'react';
import './myNavBar.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Cookies from 'js-cookie';
import { NavLink, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import defaultImage from '../../assets/images.png';
import NotificationIcon from '../notficationIconSec/NotificationIcon';
import messageIcon from '../../assets/companyImages/messages-3.svg'
import { GetAllChatsStore } from '../../store/AllChats';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllIndustriesStore } from '../../store/AllIndustries';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';
import { GetAllMainActivitiesStore } from '../../store/AllMainActivities';
import { GetAllCompaniesStore } from '../../store/AllCompanies';
import { GetAllRegionsStore } from '../../store/AllResions';
import { GetAllCitizenshipsStore } from '../../store/AllCitizenships';
import { useActivePackageStore } from '../../store/ActivePackageStore';
import webLogo from '../../assets/logos/weblogo4.png'
import LanguageSelector from '../languageSelectorSec/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyNavBar({ scrollToggle, token, loginType, totalCartItemsInCart, totalWishlistItems, fireMessage, setFireNotification, fireNotification }) {
      const { t } = useTranslation();
    const navigate = useNavigate()
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const profileData = Cookies.get('currentLoginedData');
    const getAllChats = GetAllChatsStore((state) => state.getAllChats);
    const allRead = GetAllChatsStore((state) => state.allRead);
    const getAllCountries = GetAllCountriesStore((state) => state.getAllCountries);
    const getAllIndustries = GetAllIndustriesStore((state) => state.getAllIndustries);
    const getAllMainCategories = GetAllMainCategoriesStore((state) => state.getAllMainCategories);
    const getAllMainActivities = GetAllMainActivitiesStore((state) => state.getAllMainActivities);
    const getAllCompanies = GetAllCompaniesStore((state) => state.getAllCompanies);
    const getAllRegions = GetAllRegionsStore((state) => state.getAllRegions);
    const getAllCitizenships = GetAllCitizenshipsStore((state) => state.getAllCitizenships);

    useEffect(() => {
        getAllCountries();
        getAllMainCategories();
        getAllIndustries();
        getAllMainActivities();
        getAllCompanies();
        getAllRegions();
        getAllCitizenships();
    }, [getAllCountries, getAllIndustries,  getAllCitizenships, getAllMainCategories, getAllMainActivities, getAllCompanies, getAllRegions]);

    useEffect(() => {
        if (token && loginType) {
            getAllChats();
        }
    }, [getAllChats, loginType, token, fireMessage]);
    useEffect(() => {
        getAllCountries();
    }, [getAllCountries]);

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
                Cookies.remove('allMessagesViewd');
                // Cookies.remove('verified');
                if (loginType === 'user') {
                    Cookies.remove('verified');
                }
    
                localStorage.removeItem('updatingData');
                localStorage.removeItem('updatingCompany');
                localStorage.removeItem('updatingProfile');
                localStorage.removeItem('updatingCompanyActivities');
            } catch (error) {
                Cookies.remove('authToken');
                if (loginType === 'user') {
                    Cookies.remove('verified');
                }
                toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                window.location.reload();
            };
        };
        closeOffcanvas();
        fetchData();
    };
    const {
            loading,
            features,
            message,
            fetchActivePackage,
            unAuth,
        } = useActivePackageStore();
       
        useEffect(() => {
            if (loginType === 'employee') {
                fetchActivePackage( loginType);
            }
        }, [loginType, fetchActivePackage]);
        console.log(features?.messaging);
        
    return (
        <>
            <Navbar expand="lg" className={`nav__Bg ${scrollToggle ? "nav__fixed navTransformationDown" : "nav__relative pb-3"} align-items-center`}>
                <Container>
                    <Navbar.Brand className='d-flex align-items-center'>
                        <NavLink className='logo__text' to={`/`}>
                            <>
                                {/* ReachMag<span className='letter__color'>n</span>et */}
                                <img style={{width:'160px'}} src={webLogo} alt="" />
                            </>
                        </NavLink>
                    </Navbar.Brand>
                    {
                        token &&
                        <div className="ms-auto d-flex gap-2 align-items-center me-2">
                            <NavLink
                                title='Notifications'
                                className='nav-link nav__link__style logoutBtn showNumHandler addResponsive'
                                aria-label="Close"
                            >
                                <NotificationIcon setFireNotification={setFireNotification} fireNotification={fireNotification} token={token} />
                            </NavLink>
                            { loginType === 'employee' && features?.messaging === 'yes' &&
                                <NavLink
                                onClick={(e) => {
                                    const isVerified = Cookies.get('verified') === 'true';
                                    if ( !isVerified && loginType === 'user') {
                                        // Prevent navigation and prompt verification
                                        e.preventDefault();
                                        toast.error('You need to verify your account first!');
                                        setTimeout(() => {
                                            navigate('/user-verification');
                                            scrollToTop();
                                        }, 1000);
                                    } else {
                                        // Proceed with default navigation
                                        scrollToTop();
                                    }
                                }}
                                to={'/your-messages'}
                                title='your messages'
                                className='nav-link nav__link__style logoutBtn showNumHandler addResponsive position-relative'
                                aria-label="Close"
                            >
                                <button className={`btn__companyActions messageMainBtn online__btn`}>
                                    <img src={messageIcon} alt="message-icon" />
                                    {allRead === false && <span className="red__dot"></span>}
                                </button>
                                </NavLink>
                            }
                            { loginType === 'user' &&
                                <NavLink
                                onClick={(e) => {
                                    const isVerified = Cookies.get('verified') === 'true';
                                    if ( !isVerified && loginType === 'user') {
                                        // Prevent navigation and prompt verification
                                        e.preventDefault();
                                        toast.error('You need to verify your account first!');
                                        setTimeout(() => {
                                            navigate('/user-verification');
                                            scrollToTop();
                                        }, 1000);
                                    } else {
                                        // Proceed with default navigation
                                        scrollToTop();
                                    }
                                }}
                                to={'/your-messages'}
                                title='your messages'
                                className='nav-link nav__link__style logoutBtn showNumHandler addResponsive position-relative'
                                aria-label="Close"
                            >
                                <button className={`btn__companyActions messageMainBtn online__btn`}>
                                    <img src={messageIcon} alt="message-icon" />
                                    {allRead === false && <span className="red__dot"></span>}
                                </button>
                                </NavLink>
                            }
                        </div>
                    }
                    <Navbar.Toggle onClick={handleOffcanvasToggle} aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="navbar-nav" className='Navbar__Collapse__none__on__med'>
                        <Nav className="mx-auto" >
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/`}>
                                {t('navLinks.home')}
                            </NavLink>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/About-ReachMagnet`}
                            >
                                 {t('navLinks.aboutUs')}
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
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/all-companies`}
                            >
                                 {t('navLinks.companies')}
                            </NavLink>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                aria-label="Close"
                                className={`nav-link nav__link__style`}
                                to={`/contact-us`}
                            >
                                 {t('navLinks.contactUs')}
                            </NavLink>
                        </Nav>
                        <Nav>
                            <NavLink className='nav-link nav__link__style'>
                                <LanguageSelector />
                            </NavLink>
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
                                            title='Notfications'
                                            className='nav-link nav__link__style logoutBtn showNumHandler'
                                            aria-label="Close"
                                        >
                                            <NotificationIcon fireNotification={fireNotification} setFireNotification={setFireNotification} token={token} />

                                        </NavLink>
                                        { loginType === 'employee' && features?.messaging === 'yes' &&      
                                            <NavLink
    onClick={(e) => {
        const isVerified = Cookies.get('verified') === 'true';

        if (!isVerified && loginType === 'user') {
            // Prevent navigation and prompt verification
            e.preventDefault();
            toast.error('You need to verify your account first!');
            setTimeout(() => {
                navigate('/user-verification');
            }, 1000);
        }
    }}
    to={'/your-messages'}
    title='Your Messages'
    className={`nav-link nav__link__style logoutBtn showNumHandler position-relative`}
    aria-label="Close"
>
    <button
        style={{
            width: '50px',
            height: '50px',
            background: 'rgba(221, 221, 221, 0.719)',
            borderRadius: '50%',
        }}
        className={`btn__companyActions online__btn`}
    >
        <img src={messageIcon} alt="message-icon" />
        {allRead === false && <span className="red__dot"></span>}
    </button>
                                            </NavLink>
                                        }
                                        { loginType === 'user' &&      
                                            <NavLink
    onClick={(e) => {
        const isVerified = Cookies.get('verified') === 'true';

        if (!isVerified && loginType === 'user') {
            // Prevent navigation and prompt verification
            e.preventDefault();
            toast.error('You need to verify your account first!');
            setTimeout(() => {
                navigate('/user-verification');
            }, 1000);
        }
    }}
    to={'/your-messages'}
    title='Your Messages'
    className={`nav-link nav__link__style logoutBtn showNumHandler position-relative`}
    aria-label="Close"
>
    <button
        style={{
            width: '50px',
            height: '50px',
            background: 'rgba(221, 221, 221, 0.719)',
            borderRadius: '50%',
        }}
        className={`btn__companyActions online__btn`}
    >
        <img src={messageIcon} alt="message-icon" />
        {allRead === false && <span className="red__dot"></span>}
    </button>
                                            </NavLink>
                                        }
<NavLink
    onClick={(e) => {
        const isVerified = Cookies.get('verified') === 'true';

        if (loginType === 'user' && !isVerified) {
            // Prevent navigation and prompt verification
            e.preventDefault();
            toast.error('You need to verify your account first!');
            setTimeout(() => {
                navigate('/user-verification');
                scrollToTop();
            }, 1000);
        } else {
            // Proceed with navigation
            scrollToTop();
        }
    }}
    aria-label="Close"
    className='nav-link nav__link__style nav__profileData'
    to='/profile/profile-settings'
    title='Profile'
>
    <img
        src={profileData ? JSON.parse(profileData)?.companyLogo ? JSON.parse(profileData)?.companyLogo : JSON.parse(profileData)?.image: defaultImage}
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
                                            {t('navLinks.signUp')}
                                        </NavLink>
                                        <NavLink
                                            onClick={() => {
                                                scrollToTop();
                                            }}
                                            aria-label="Close"
                                            className={`nav-link nav__link__style sign__in__btn`}
                                            to={`/Login`}
                                        >
                                            {t('navLinks.signIn')}
                                        </NavLink>
                                    </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Offcanvas
                        id="offcanvasNavbar" className='Navbar__offCanvas__none__on__lg' aria-labelledby="offcanvasNavbarLabel"
                        show={showOffcanvas}
                        onHide={handleOffcanvasToggle}
                        placement={Lang === 'ar' ? "end" : "start"}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title className='offCanvas__head' id="offcanvasNavbarLabel">
                                <NavLink className='logo__text' to={`/`}>
                                    {/* <>
                                        ReachMag<span className='letter__color'>n</span>et
                                    </> */}
                                     <img style={{width:'160px'}} src={webLogo} alt="" />
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
                                        <NavLink
    onClick={(e) => {
        const isVerified = Cookies.get('verified') === 'true'; // Check verified status

        if (loginType === 'user' && !isVerified) {
            // Prevent navigation for unverified users
            e.preventDefault();
            toast.error('You need to verify your account first!');
            setTimeout(() => {
                navigate('/user-verification');
                scrollToTop();
                closeOffcanvas();
            }, 1000);
        } else {
            // Allow navigation for verified users or other login types
            scrollToTop();
            closeOffcanvas();
        }
    }}
    className='nav-link nav__link__style nav__profileData'
    to='/profile/profile-settings'
    title='Profile'
>
    <img
        src={profileData ? JSON.parse(profileData)?.companyLogo ? JSON.parse(profileData)?.companyLogo : JSON.parse(profileData)?.image: defaultImage}
        alt='img-check'
    />
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
                                   {t('navLinks.home')}
                                </NavLink>

                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/About-ReachMagnet`}>
                                    {t('navLinks.aboutUs')}
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
                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/all-companies`}
                                >
                                    {t('navLinks.companies')}
                                </NavLink>
                                <NavLink
                                    onClick={() => {
                                        scrollToTop();
                                        closeOffcanvas();
                                    }}
                                    aria-label="Close"
                                    className={`nav-link nav__link__style`}
                                    to={`/contact-us`}>
                                    {t('navLinks.contactUs')}
                                </NavLink>
                                <NavLink className='nav-link nav__link__style'>
                                <LanguageSelector />
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
                                                {t('navLinks.signUp')}
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
                                                {t('navLinks.signIn')}
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
