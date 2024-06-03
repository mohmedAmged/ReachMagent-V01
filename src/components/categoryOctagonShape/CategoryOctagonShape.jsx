import React from 'react'
import './categoryOcatgonShape.css'
import { NavLink } from 'react-router-dom'
export default function CategoryOctagonShape({ octagonIcon, iconName, iconLink }) {
    return (
        <div className='CategoryOctagonShape__handler'>
            <div className="octagonItem__handler">
                <div className="octagon__shape">
                    <img src={octagonIcon} alt="icon" />
                </div>
                <NavLink to={iconLink} className='nav-link'>
                    <span>{iconName}</span>
                </NavLink>
            </div>

        </div>
    )
}
