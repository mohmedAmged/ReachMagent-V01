import React from 'react'
import './lastMinuteCard.css'
import timeImg from '../../assets/lastMinuteCardImgs/mdi_timer-sand.png'
export default function LastMinuteCard({productImage, productName, dealTimeDay, dealtimeHours, dealQuantity}) {
  return (
    <>
      <div className='lastMinuteCard__handler'>
            <div className="product__image">
                <img src={productImage} alt="product-imag" />
            </div>
            <div className="product__info">
                <div className="main__info">
                    <h3>
                        {productName}
                    </h3>
                    <div className="deal__time">
                        <img src={timeImg} alt="time" />
                        <div className="deal__time__day">
                            <p>
                                {dealTimeDay}
                            </p>
                            <p>
                                Day
                            </p>
                        </div>
                        {/* <p>:</p> */}
                        <div className="deal__time__hour">
                            <p>
                                {dealtimeHours}
                            </p>
                            <p>
                                hours
                            </p>
                        </div>
                    </div>
                </div>
                <div className="sub__info">
                    <p>
                       {dealQuantity}
                    </p>
                    <button className='pageMainBtnStyle'>
                        buy more
                    </button>
                </div>
            </div>
        </div>
    </>
  )
}
