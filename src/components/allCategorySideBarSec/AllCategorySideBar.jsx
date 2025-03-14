import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import styles from './allCategorySideBar.module.css';

export default function AllCategorySideBar({ industries, show, handleClose, subIndustry, fetchAllContentDatafromSub, fetchAllContentData }) {
    const { subIndustryID } = useParams();
    console.log(subIndustryID);
    console.log(subIndustry);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const handleIndustryClick = (industryId) => {
        setSelectedIndustry((prev) => (prev === industryId ? null : industryId));
        fetchAllContentData()
    };
    return (
        <div className=' position-relative'>
            <Offcanvas show={show} onHide={handleClose} responsive="md" className={styles.sidebarOffcanvas}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>All Industries</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <nav>
                        {industries?.map((el) =>
                        {
                            const relatedSubIndustries = subIndustry?.filter(sub => sub.industryId === el.id);
                             return(
                            <div key={el?.id}>
                                {/* Industry Link */}
                                <Link
                                    to={`/all-Industries/${el?.slug}`}
                                    className={`${styles.sidebar__menu} nav-link 
                                    ${subIndustryID === el?.slug?.toString() ? styles.sidebar__menu_active : ''}`}
                                    onClick={() => handleIndustryClick(el?.id)}
                                >
                                    <div className={styles.sidebar__menu__info}>
                                        <img src={el?.icon} alt="menu-img" />
                                        <h5>{el?.name}</h5>
                                            <i
                                            className={`bi ${selectedIndustry === el?.id ? 'bi-chevron-down' : 'bi-chevron-right'}`}
                                            ></i>
                                    </div>
                                   
                                        
                                </Link>

                                {/* Sub-Industries */}
                                {selectedIndustry === el?.id && subIndustry?.length > 0 && (
                                    <div className={`ps-4 mb-3 ${styles.subIndustryContainer} link-underline`}>
                                        {subIndustry.map((sub) => (
                                            <p
                                                key={sub?.id}
                                                // to={`/all-Industries/${el?.slug}/${sub?.slug}`}
                                                onClick={()=>{fetchAllContentDatafromSub(sub?.slug)}}
                                                className={`mb-2 ${styles.subIndustryItem}`}
                                                style={{cursor:'pointer'}}
                                            >
                                                {sub?.name}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )})}
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
