import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import icon2 from '../../assets/sidebar-icons/3d-square 1.svg';
import icon9 from '../../assets/sidebar-icons/discount-shape 1.svg';
import icon6 from '../../assets/sidebar-icons/messages-3.svg';
import icon7 from '../../assets/sidebar-icons/notification.svg';
import icon11 from '../../assets/sidebar-icons/people.svg';
import icon5 from '../../assets/sidebar-icons/status-up.svg';
import icon3 from '../../assets/sidebar-icons/user-square 1.svg';
import icon4 from '../../assets/sidebar-icons/wallet-money 2.svg';
import SideBar from '../sideBar/SideBar';
import { useActivePackageStore } from '../../store/ActivePackageStore';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { useSidebarStatus } from '../../store/SidebarStatusStore';
import webLogo from '../../assets/logos/weblogo4.png'
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyNewSidebarDash({ token }) {
    const { t } = useTranslation();
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [collapsed, setCollapsed] = useState(false);
    const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
    const activePath = location.pathname;
    const navigate = useNavigate();
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

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
    const toggleSettingsSubmenu = () => {
        setShowSettingsSubmenu(!showSettingsSubmenu);

    }
    const loginType = localStorage.getItem('loginType')
    const {
        loading,
        features,
        message,
        fetchActivePackage,
        unAuth,
    } = useActivePackageStore();
    const {
        ShowStatus,
        fetchSidebarStatus,
    } = useSidebarStatus();
    useEffect(() => {
        fetchActivePackage( loginType);
        fetchSidebarStatus(loginType);
    }, [loginType, fetchActivePackage, fetchSidebarStatus]);
    console.log(features);
    
    let sidebarItems = [
        // { title: "Profile", link: "/profile", icon: icon1 },
        ShowStatus === 'all' && 
        { title: "Followers", link: "/profile/followers", icon: icon11, renderName:`${t('DashboardSidebar.followersItem')}` },
        ShowStatus === 'all' && 
        { title: "Product Catalog", link: "/profile/catalog", icon: icon2, renderName:`${t('DashboardSidebar.productCatalogItem')}` },
        ShowStatus === 'all' && 
        { title: "Services", link: "/profile/service", icon: icon2, renderName:`${t('DashboardSidebar.serviceItem')}` },
        ShowStatus === 'all' && 
        features?.portfolios === 'yes' && 
        { title: "Media", link: "/profile/media", icon: icon2, renderName:`${t('DashboardSidebar.mediaItem')}` },
        // ShowStatus === 'all' && 
        // { title: "E-commerce Products", link: "/profile/products", icon: icon4 },
        ShowStatus === 'all' && 
        features?.networks === 'yes' && 
        { title: "Network", link: "/profile/network", icon: icon4, renderName:`${t('DashboardSidebar.networkItem')}` },
        ShowStatus === 'all' && 
        features?.pervious_work === 'yes' && 
        { title: "Previous Work", link: "/profile/previous-work", icon: icon4, renderName:`${t('DashboardSidebar.previousWorkItem')}` },
        // ShowStatus === 'all' && 
        // { title: "E-commerce Orders", link: "/profile/product-order", icon: icon4 },
        // ShowStatus === 'all' && 
        // { title: "Collections", link: "/profile/product-order", icon: icon4 },
        ShowStatus === 'all' && 
        { title: "FAQS", link: "/profile/faqs", icon: icon5, renderName:`${t('DashboardSidebar.FAQSItem')}` },
        ShowStatus === 'all' && 
        features?.insights === 'yes' && 
        { title: "Posts", link: "/profile/posts", icon: icon5, renderName:`${t('DashboardSidebar.postsItem')}` },
        // { title: "Shipping Costs", link: "/profile/shipping-costs", icon: currencyIcon },
        ShowStatus === 'all' && 
        features?.quotations === 'yes' && 
        { title: "Quotations", link: "/profile/quotations", icon: icon3, renderName:`${t('DashboardSidebar.quotationsItem')}` },
        ShowStatus === 'all' && 
        features?.one_click_quotations === 'yes' && 
        { title: "One-Click Quotations", link: "/profile/oneclick-quotations", icon: icon3, renderName:`${t('DashboardSidebar.oneClickQuotationsItem')}` },
        ShowStatus === 'all' && 
        (features?.one_click_quotations === 'yes' ||  features?.quotations) &&
        { title: "Quotation Orders", link: "/profile/quotation-orders", icon: icon4, renderName:`${t('DashboardSidebar.quotationOrdersItem')}` },
        ShowStatus === 'all' && 
        features?.appointments === 'yes' && 
        { title: "Appointments", link: "/profile/appointments", icon: icon3, renderName:`${t('DashboardSidebar.appointmentsItem')}` },
        ShowStatus === 'all' && 
        { title: "Booked Appointments", link: "/profile/booked-Appointments", icon: icon3, renderName:`${t('DashboardSidebar.bookedAppointmentsItem')}` },
        ShowStatus === 'all' && 
        { title: "Contact Form", link: "/profile/contact-form", icon: icon3, renderName:`${t('DashboardSidebar.contactFormItem')}` },
        ShowStatus === 'all' && 
        features?.messaging === 'yes' && 
        { title: "Messages", link: "/your-messages", icon: icon6, renderName:`${t('DashboardSidebar.messagesItem')}` },
        ShowStatus === 'all' && 
        { title: "Notifications", link: "/profile/notifications", icon: icon7, renderName:`${t('DashboardSidebar.notificationsItem')}` },
        (ShowStatus === 'all' || ShowStatus === 'package_settings_and_transactions') &&
        { title: "Package Settings", link: "/profile/packages-settings", icon: icon6, renderName:`${t('DashboardSidebar.packageSettingsItem')}` },
        {
            title: "Settings",
            link: "/profile/profile-settings",
            icon: icon9,
            renderName:`${t('DashboardSidebar.settingsItem')}`
            // submenu: [
            //     { title: "Profile Settings", link: "/profile/profile-settings" },
            //     { title: "Business Settings", link: "/profile/business-settings" },
            //     { title: "Employees Management", link: "/profile/users-management" }
            // ]
        }
    ].filter(Boolean);
    if (loginType === 'user') {
        sidebarItems = [
            // { title: "Profile", link: "/profile", icon: icon1 },
            { title: "following", link: "/profile/followers", icon: icon11, renderName:`${t('DashboardSidebar.followingItem')}` },
            // { title: "Catalog", link: "/profile/catalog", icon: icon2 },
            // { title: "Services", link: "/profile/service", icon: icon2 },
            { title: "Quotations", link: "/profile/quotations", icon: icon3,  renderName:`${t('DashboardSidebar.quotationsItem')}`},
            { title: "One-Click Quotations", link: "/profile/oneclick-quotations", icon: icon3, renderName:`${t('DashboardSidebar.oneClickQuotationsItem')}` },
            // { title: "Products", link: "/profile/products", icon: icon4 },
            { title: "Quotation Orders", link: "/profile/quotation-orders", icon: icon4, renderName:`${t('DashboardSidebar.quotationOrdersItem')}` },
            // { title: "E-commerce Orders", link: "/profile/product-order", icon: icon4 },
            { title: "Booked Appointments", link: "/profile/booked-Appointments", icon: icon3, renderName:`${t('DashboardSidebar.bookedAppointmentsItem')}` },
            // { title: "Insights", link: "/profile/insights", icon: icon5 },
            { title: "Messages", link: "/your-messages", icon: icon6, renderName:`${t('DashboardSidebar.messagesItem')}` },
            { title: "Notifications", link: "/profile/notifications", icon: icon7, renderName:`${t('DashboardSidebar.notificationsItem')}` },
            // { title: "Requests", link: "/profile/requests", icon: icon8 },
            {
                title: "Settings",
                link: "/profile/profile-settings",
                icon: icon9,
                renderName:`${t('DashboardSidebar.settingsItem')}`,
                subminue: (localStorage.getItem('loginType') === 'user') ? [
                    { title: "Profile Settings", link: "/profile/profile-settings",  }
                ] : [
                    { title: "Profile Settings", link: "/profile/profile-settings", renderName:`${t('DashboardSidebar.profileSettingsSubItem')}` },
                    { title: "Business Settings", link: "/profile/business-settings", renderName:`${t('DashboardSidebar.businessSettingsSubItem')}` },
                    { title: "Employees Management", link: "/profile/users-management", renderName:`${t('DashboardSidebar.employeesManagementSubItem')}` }
                ]
            }
        ];
    }
    // const sidebarItemsTwo = [
    //     { title: "Promote", link: "/business-profile/promote", icon: icon9 },
    //     { title: "Help", link: "/business-profile/help", icon: icon10 }
    // ];
    const userSubmenu = (localStorage.getItem('loginType') === 'user') ? [
        { title: "Profile Settings", link: "/profile/profile-settings", renderName:`${t('DashboardSidebar.profileSettingsSubItem')}` }
    ] : [
        { title: "Profile Settings", link: "/profile/profile-settings", renderName:`${t('DashboardSidebar.profileSettingsSubItem')}` },
        { title: "Business Settings", link: "/profile/business-settings", renderName:`${t('DashboardSidebar.businessSettingsSubItem')}` },
        features?.employees === 'yes' && { title: "Employees Management", link: "/profile/users-management",  renderName:`${t('DashboardSidebar.employeesManagementSubItem')}`}
    ];
    const settingsIndex = sidebarItems.findIndex(item => item?.title === "Settings");
    if (settingsIndex !== -1) {
        sidebarItems[settingsIndex].submenu = userSubmenu;
    };

    const renderSidebarContent = () => (
        <>
            <ul>
                {sidebarItems.map((el, index) => (
                    <li
                        key={index}
                        className={`d-flex justify-content-between align-items-center 
                            ${el.link.endsWith(handleGettingLastRouteInPathName()) ? 'active' : ''} 
                            ${activePath?.includes(el.link) && !showSettingsSubmenu ? 'active' : ''}
                            ${el.submenu && showSettingsSubmenu ? 'active' : ''}`}
                        onClick={() => {
                            if (el.submenu) {
                                toggleSettingsSubmenu();
                                // if (!show && isMobile) {
                                //     handleShow();
                                // }
                            } else {
                                handleNavigationToSingleProfilePage(el.link);
                            }
                        }}
                    >
                        <Link onClick={isMobile ? handleClose : undefined}>
                            <img className={`me-2`} src={el.icon} alt={el.title} />
                            <span>{el.renderName}</span>
                        </Link>
                        {el.submenu ? <i className={`bi ${showSettingsSubmenu ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i> : <i className="bi bi-chevron-right"></i>}
                    </li>
                ))}
                {showSettingsSubmenu && sidebarItems.find(el => el.title === "Settings").submenu.map((subEl, subIndex) => (
                    <li
                        key={subIndex}
                        className={`d-flex justify-content-between align-items-center submenu 
                            ${activePath === subEl.link ? 'active' : ''}`}
                        onClick={() => handleNavigationToSingleProfilePage(subEl.link)}
                        style={{ paddingLeft: '15px' }}
                    >
                        <Link to={subEl.link} onClick={isMobile ? handleClose : undefined}>
                            <span>{subEl.renderName}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            {/* <ul className='listItems__two'>
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
            </ul> */}
            {/* <div className="pro__banner__handler text-center">
                <div className="pro__banner__content">
                    <h3>Upgrade to PRO to get access to all Features!</h3>
                    <NavLink className='nav-link'>
                        Get Pro Now!
                    </NavLink>
                </div>
            </div> */}
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
                                            <img className={`me-2`} src={el.icon} alt={el.title} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {/* <ul className='listItems__two'>
                                {sidebarItemsTwo.map((el, index) => (
                                    <li key={index} className={`d-flex justify-content-center align-items-center ${activePath === el.link ? 'active' : ''}`}>
                                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                                            <img src={el.icon} alt={el.title} />
                                        </Link>
                                    </li>
                                ))}
                            </ul> */}
                        </div>

                    </div>

                    <Offcanvas show={show} onHide={handleClose} className="mySidebar__handler">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                <h1 className="logo__text cursorPointer">
                                    <NavLink className={'nav-link'} to={'/'}>
                                        ReachMag<span className='letter__color'>n</span>et
                                    </NavLink>
                                </h1>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {renderSidebarContent()}
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            ) : (
                <div className="mySidebar__handler mySideBarNewContainer">
                    <div>
                        {
                            !collapsed &&
                            <h1 className="logo__text mb-3 cursorPointer">
                                <NavLink className={'nav-link'} to={'/'}>
                                    <img className={`me-2`} style={{width:'160px'}} src={webLogo} alt="" />
                                </NavLink>
                            </h1>
                        }
                        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} sidebarItems={sidebarItems} />

                        {/* {renderSidebarContent()} */}
                    </div>
                </div>
            )}
        </>
    )
}
