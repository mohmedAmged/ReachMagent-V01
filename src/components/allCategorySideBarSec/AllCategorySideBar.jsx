import React, { useState } from 'react'
import styles from './allCategorySideBar.module.css'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useParams } from 'react-router-dom';

export default function AllCategorySideBar({ industries }) {
    const { subIndustryID } = useParams();
    const [isCollapsed, setIsCollapsed] = useState(false);
console.log(subIndustryID);

    const toggleCollapsed = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`${styles.sidebar__handler}`}>
            <Sidebar 
            className={`${styles.sidebar__main}`} 
            collapsed={isCollapsed}
            >
               <i className={`bi bi-list ${styles.iconStyle}`} onClick={toggleCollapsed}></i>
                <Menu>
                    <MenuItem className='my-4'  icon={<i className={`bi bi-house ${styles.bi_house}`}></i>} >  
                            {
                             <div className={`${styles.sidebar__menu__info}`}>
                                    <h5>
                                        All Industry
                                    </h5>
                            </div> 
                            }
                    </MenuItem>
                    {
                        industries?.map((el) => (
                            <MenuItem 
                            className={`${styles.sidebar__menu} 
                            ${subIndustryID === el?.id.toString() ? styles.sidebar__menu_active: ''}`} 
                            key={el?.id} 
                            component={<Link to={`/all-Industries/${el?.id}`}
                            active={subIndustryID === el?.id.toString() ? true: false }
                            />}>
                                <div className={`${styles.sidebar__menu__info}`}>
                                    <img src={el?.icon} alt="menu-img" />
                                    {!isCollapsed && <h5>{el?.name}</h5>}
                                </div>
                            </MenuItem>
                        ))
                    }

                </Menu>
            </Sidebar>
        </div>
    )
}
