import React from 'react'
import './profilefilterBar.css'
import { Lang } from '../../functions/Token';
export default function ProfileFilterBar({ items, onItemClick }) {
    const handleSelectChange = (event) => {
        onItemClick(event.target.value);
    };
    return (
        <div className='profileFilterbar__handler'>
            <div className="container">
                <ul className='productDetailsFilterationBar-list'>
                    <div className="catalog__new__input">
                        <select
                            name="filterItems"
                            className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                            value={items.find(item => item.active)?.name || ''}
                            onChange={handleSelectChange}
                        >
                            {items.map((item, index) => (
                                <option
                                    key={index}
                                    className={item.active ? 'active' : ''}
                                    value={item.name}
                                >
                                    {item.rendeName}
                                </option>
                            ))}

                        </select>
                    </div>
                                {/* // <li 
                                // onClick={() => onItemClick(item.name)}
                                // >
                                //     {item.name}
                                // </li> */}
                </ul>
            </div>
        </div>
    )
}
