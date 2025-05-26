import React from 'react';
import './productDetailsFilterationBar.css';

export default function ProductDetailsFilterationBar({items, onItemClick, secondFilter= false}) {

  return (
    <div className='productDetailsFilterationBar'>
    <div className={`${!secondFilter ? 'container' : ''}`}>
      <div className="row">
        <div className={`${secondFilter ? 'col-12' : 'col-12'} justify-content-start `}>
          <ul className={`productDetailsFilterationBar-list  d-flex flex-wrap justify-content-start align-items-center ${secondFilter ? 'bg-transparent shadow-none border border-3 mb-4' : '' }`}>
            {items.map((item, index) => (
              <li key={index}  onClick={() => onItemClick(item.name)} className={item.active ? 'active' : ''}>
                {item?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
  )
}
