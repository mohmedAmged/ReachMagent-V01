import React, { useEffect, useState } from 'react'
import './lastMinuteDeals.css'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
import product1 from '../../assets/productImages/Rectangle 4705 (1).png'
import product2 from '../../assets/productImages/Rectangle 4705 (2).png'
import product3 from '../../assets/productImages/Rectangle 4705 (3).png'
import LastMinuteCard from '../lastMinuteCardSec/LastMinuteCard'
import lastMinuteLogo from '../../assets/logos/Group (2).png'
import { baseURL } from '../../functions/baseUrl'
import axios from 'axios'
export default function LastMinuteDeals() {

    const [newData, setNewdata] = useState([])
    const fetchLastMinuteDeals = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/last-minute-deals?t=${new Date().getTime()}`);
        setNewdata(response?.data?.data?.last_minute_deals);
      } catch (error) {
        setNewdata(error?.response?.data.message);
      }
    };
    useEffect(() => {
        fetchLastMinuteDeals();
    }, []);

console.log(newData);

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
                    secText='Secure limited-time deals on large lots or specific quantities before they are gone' />
                <div className="lastMinuteDeal__logo__img">
                    <img src={lastMinuteLogo} alt="lastMinute__logo" />
                </div>
                <div className="lastMinuteDeals__cards mb-4">
                    <div className="row">
                        {
                            newData.map((el, index) => {
                                return (
                                    <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center mb-4">
                                        {/* <LastMinuteCard productImage={el.img}
                                            productName={el.title} dealTimeDay={el.dealDay} dealtimeHours={el.dealHours} dealQuantity={el.dealQuantity} /> */}
                                        <LastMinuteCard
                                            productImage={el?.medias[0].media}
                                            productName={el?.title}
                                            dealTimeDay={el?.limited_date}
                                            // dealtimeHours={el.dealHours}
                                            dealQuantity={`${el?.quantity} picees`}
                                            // dealTotPrice={`${el?.total_price} ${el?.currency}`}
                                            showCustomContent={false}
                                            buttonLabel="Know more"
                                            onKnowMoreClick={() => alert('Know more button clicked')}
                                        />
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
