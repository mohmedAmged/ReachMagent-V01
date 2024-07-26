import React from 'react'
import './profilefilterBar.css'
export default function ProfileFilterBar({items, onItemClick}) {
    return (
        <div className='profileFilterbar__handler'>
            <div className="container">
                <ul className='productDetailsFilterationBar-list d-flex  justify-content-start align-items-center flex-wrap'>
                    {items.map((item, index) => (
                        <li key={index} className={item.active ? 'active' : ''}
                        onClick={() => onItemClick(item.name)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
