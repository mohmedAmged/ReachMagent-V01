import React from 'react'
import './lastMinuteDeals.css'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
import product1 from '../../assets/productImages/Rectangle 4705 (1).png'
import product2 from '../../assets/productImages/Rectangle 4705 (2).png'
import product3 from '../../assets/productImages/Rectangle 4705 (3).png'
import LastMinuteCard from '../lastMinuteCardSec/LastMinuteCard'
import lastMinuteLogo from '../../assets/logos/Group (2).png'
export default function LastMinuteDeals() {
    const productItems = [
        {
            img: product1,
            title: 'Table Lamp',
            dealDay: '01',
            dealHours: '07',
            dealQuantity: '5,000 pieces'
        },
        {
            img: product2,
            title: 'Ceiling Lamp ',
            dealDay: '01',
            dealHours: '07',
            dealQuantity: '5,000 pieces'
        },
        {
            img: product3,
            title: 'Blue Wood Chair',
            dealDay: '01',
            dealHours: '07',
            dealQuantity: '5,000 pieces'
        },
    ]
    return (
        <div className='lastMinuteDeals__handler'>
            <div className="container">
                <HeaderOfSec secHead='Last Minute Deals'
                    secText='Lorem ipsum dolor sit amet consectetur. Lectus fermentum amet id luctus at libero.' />
                <div className="lastMinuteDeal__logo__img">
                    <img src={lastMinuteLogo} alt="lastMinute__logo" />
                </div>
                <div className="lastMinuteDeals__cards mb-4">
                    <div className="row">
                        {
                            productItems.map((el, index) => {
                                return (
                                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center mb-4">
                                        <LastMinuteCard productImage={el.img}
                                            productName={el.title} dealTimeDay={el.dealDay} dealtimeHours={el.dealHours} dealQuantity={el.dealQuantity} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
