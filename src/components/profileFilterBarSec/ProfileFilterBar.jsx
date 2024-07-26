import React from 'react'
import './profilefilterBar.css'
export default function ProfileFilterBar({items}) {
    return (
        <div className='profileFilterbar__handler'>
            <div className="container">
                <ul className='productDetailsFilterationBar-list d-flex  justify-content-start align-items-center flex-wrap'>
                    {items.map((item, index) => (
                        <li key={index} className={item.active ? 'active' : ''}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
