import React from 'react';
import './ShopMainCard.css';

export default function ShopMainCard({imgSrc,cardHead,cardText,rate,buttonText}) {
  return (
    <div className='shopMain___card'>
      <div className='shopMain__card-image'>
        <img src={imgSrc ? imgSrc : ''} alt="" />
      </div>
      <div className='shopMain__card-body'>
        <h4>
          {
            cardHead ? cardHead : ''
          }
        </h4>
        <p>
          {
            cardText ? cardText : ''
          }
          $
        </p>
        <div className='shopMain__card-body_bottom'>
          <div className='shopMain__card-body_rate-holder'>
            <i className="bi bi-star-fill"></i>
            {
              rate ? rate : ''
            }

          </div>
          <div className='shopMain__card-body_button-holder'>
            <button className='pageMainBtnStyle'>
              {
                buttonText ? buttonText : ''
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
