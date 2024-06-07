import React from 'react';
import './productDetailsFilterationBar.css';

export default function ProductDetailsFilterationBar() {
  return (
    <div className='productDetailsFilterationBar'>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className='productDetailsFilterationBar-list d-flex flex-wrap justify-content-start align-items-center'>
              <li className='active'>
                Details
              </li>
              <li>
                Specification
              </li>
              <li>
                Reviews
              </li>
              <li>
                Seller Details
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
