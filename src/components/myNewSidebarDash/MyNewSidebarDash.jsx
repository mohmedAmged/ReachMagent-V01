import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import icon1 from '../../assets/sidebar-icons/key-square.svg';
import icon2 from '../../assets/sidebar-icons/3d-square 1.svg';
import icon3 from '../../assets/sidebar-icons/user-square 1.svg';
import icon4 from '../../assets/sidebar-icons/wallet-money 2.svg';
import icon5 from '../../assets/sidebar-icons/status-up.svg';
import icon6 from '../../assets/sidebar-icons/messages-3.svg';
import icon7 from '../../assets/sidebar-icons/notification.svg';
import icon8 from '../../assets/sidebar-icons/call-add.svg';
import icon9 from '../../assets/sidebar-icons/discount-shape 1.svg';
import icon10 from '../../assets/sidebar-icons/message-question 1.svg';

export default function MyNewSidebarDash() {
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const activePath = location.pathname;
    const navigate = useNavigate();

    const handleNavigationToSingleProfilePage = (pageName) => {
        navigate(`${pageName}`)
    }

    const handleGettingLastRouteInPathName = () => {
        const arrOfPathNames = location.pathname.split('/');
        return `/${arrOfPathNames[arrOfPathNames.length - 1]}`
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sidebarItems = [
        { title: "Profile", link: "/user-profile", icon: icon1 },
        { title: "Catalog", link: "/user-profile/catalog", icon: icon2 },
        { title: "Quotations", link: "/user-profile/quotations", icon: icon3 },
        { title: "Products", link: "/user-profile/products", icon: icon4 },
        { title: "Orders", link: "/user-profile/orders", icon: icon4 },
        { title: "Insights", link: "/user-profile/insights", icon: icon5 },
        { title: "Messages", link: "/your-messages", icon: icon6 },
        { title: "Notifications", link: "/user-profile/notifications", icon: icon7 },
        { title: "Requests", link: "/user-profile/requests", icon: icon8 }
    ];

    const sidebarItemsTwo = [
        { title: "Promote", link: "/user-profile/promote", icon: icon9 },
        { title: "Help", link: "/user-profile/help", icon: icon10 }
    ];

    const renderSidebarContent = () => (
        <>
            <ul>
                {sidebarItems.map((el, index) => (
                    <li
                        key={index}
                        className={`d-flex justify-content-between align-items-center 
                    ${el.link.endsWith(handleGettingLastRouteInPathName()) ? 'active' : ''} 
                    ${activePath === el.link ? 'active' : ''}`}
                        onClick={() => handleNavigationToSingleProfilePage(el.link)}
                    >
                        <Link onClick={isMobile ? handleClose : undefined}>
                            <img src={el.icon} alt={el.title} />
                            <span>{el.title}</span>
                        </Link>
                        <i className="bi bi-chevron-right"></i>
                    </li>
                ))}
            </ul>
            <ul className='listItems__two'>
                {sidebarItemsTwo.map((el, index) => (
                    <li
                        key={index}
                        className={`d-flex justify-content-between align-items-center 
                    ${activePath === el.link ? 'active' : ''}`}>
                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                            <img src={el.icon} alt={el.title} />
                            <span>{el.title}</span>
                        </Link>
                        <i className="bi bi-chevron-right"></i>
                    </li>
                ))}
            </ul>
            <div className="pro__banner__handler text-center">
                <div className="pro__banner__content">
                    <h3>Upgrade to PRO to get access to all Features!</h3>
                    <NavLink className='nav-link'>
                        Get Pro Now!
                    </NavLink>
                </div>
            </div>
        </>
    );
    return (
        <>
            {isMobile ? (
                <>
                    <div className='mySidebar__handler'>
                        <div className='container'>
                            <ul>
                                <li onClick={handleShow} className="sidebar-toggle text-center">
                                    ☰
                                </li>
                                {sidebarItems.map((el, index) => (
                                    <li key={index} className={`d-flex justify-content-center align-items-center ${activePath === el.link ? 'active' : ''}`}>
                                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                                            <img src={el.icon} alt={el.title} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className='listItems__two'>
                                {sidebarItemsTwo.map((el, index) => (
                                    <li key={index} className={`d-flex justify-content-center align-items-center ${activePath === el.link ? 'active' : ''}`}>
                                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                                            <img src={el.icon} alt={el.title} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <Offcanvas show={show} onHide={handleClose} className="mySidebar__handler">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                <h1 className="logo__text">
                                    ReachMag<span className='letter__color'>n</span>et
                                </h1>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {renderSidebarContent()}
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            ) : (
                <div className="mySidebar__handler">
                    <div className="container">
                        <h1 className="logo__text">
                        ReachMag<span className='letter__color'>n</span>et
                        </h1>
                        {renderSidebarContent()}
                    </div>
                </div>
            )}
        </>
    )
}
