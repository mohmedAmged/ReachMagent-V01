import React, { useEffect, useState } from 'react'
import './allCategorySideBar.css'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';

export default function AllCategorySideBar() {
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
        { title: "All Category", link: "/all-category", },
        { title: "Fashion & Apparel", link: "/all-category/Fashion&Apparel", },
        { title: "Beauty & Personal Care", link: "/all-category/Beauty&PersonalCare", },
        { title: "Health & Wellness", link: "/all-category/Health&Wellness", },
        { title: "Automotive", link: "/all-category/Automotive", },
        { title: "Packaging", link: "/all-category/Packaging", },
        { title: "Retail", link: "/all-category/Retail", },
        { title: "Medical", link: "/all-category/Medical", },
        { title: "Technology", link: "/all-category/Technology", },
        { title: "Education", link: "/all-category/Education", }
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
                            {/* <img src={el.icon} alt={el.title} /> */}
                            <span>{el.title}</span>
                        </Link>
                        {/* <i className="bi bi-chevron-right"></i> */}
                    </li>
                ))}
            </ul>
        </>
    );
    return (
        <>
            {isMobile ? (
                <>
                    <div className='mySidebar__handler myAllCategorySidebar__handler'>
                        <div className='container'>
                            <ul>
                                <li onClick={handleShow} className="sidebar-toggle text-center">
                                    ☰
                                </li>
                                {sidebarItems.map((el, index) => (
                                    <li key={index} className={`d-flex justify-content-center align-items-center ${activePath === el.link ? 'active' : ''}`}>
                                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                                            {/* <img src={el.icon} alt={el.title} /> */}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <Offcanvas show={show} onHide={handleClose} className="mySidebar__handler myAllCategorySidebar__handler">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                <h1 className="logo__text">
                                    Filter by Category
                                </h1>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {renderSidebarContent()}
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            ) : (
                <div className="mySidebar__handler myAllCategorySidebar__handler">
                    <div className="container">
                        <h1 className="logo__text">
                            Filter by Category
                        </h1>
                        {renderSidebarContent()}
                    </div>
                </div>
            )}
        </>
    )
}
