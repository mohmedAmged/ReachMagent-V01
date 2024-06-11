import React from 'react'
import './categoryOcatgonShape.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop';

export default function CategoryOctagonShape({ octagonIcon, iconName, iconLink }) {
    const navigate = useNavigate();

    return (
        <div className='CategoryOctagonShape__handler'>
            <div className="octagonItem__handler">
                <div className="octagon__shape" onClick={()=>navigate(`${iconLink}`)}>
                    <img src={octagonIcon} alt="icon" />
                </div>
                <NavLink to={iconLink} onClick={()=> scrollToTop()} className='nav-link'>
                    <span>{iconName}</span>
                </NavLink>
            </div>

        </div>
    )
}
