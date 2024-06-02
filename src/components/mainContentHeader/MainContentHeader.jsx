import React from 'react'
import './mainContentHeader.css'
import MySearchSec from '../mySearchSec/MySearchSec'
import { NavLink } from 'react-router-dom'
export default function MainContentHeader({ isSidebarExpanded }) {
    return (
        <div className={`mainContentHeader__handler  ${isSidebarExpanded ? 'expanded' : ''}`}>
            <div className="content__header d-flex justify-content-between  align-items-center">
                <h1>
                    Hello Saeed 👋🏼,
                </h1>

                <div className='d-flex align-items-center'>
                    <MySearchSec />
                    <NavLink className='btn btn-outline-success py-1 ms-2' to='/'>
                        <i className="bi bi-box-arrow-left "></i>
                    </NavLink>
                </div>

            </div>
        </div>
    )
}
