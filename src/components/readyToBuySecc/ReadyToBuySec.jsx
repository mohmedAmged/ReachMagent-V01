import React from 'react'
import './readyToBuySec.css'
import BorderedNavigationBar from '../borderedNavigationBarSec/BorderedNavigationBar'
import product1 from '../../assets/productImages/Rectangle 4705 (1).png'
import product2 from '../../assets/productImages/Rectangle 4705 (2).png'
import product3 from '../../assets/productImages/Rectangle 4705 (3).png'
import ProductCard from '../productCardSec/ProductCard'
import HeaderSec from '../myHeaderSec/HeaderSec'
export default function ReadyToBuySec() {
    const listedNavigationItem = [
        {
            item: 'Food product',
            itemStyle: 'active'
        },
        {
            item: 'most Sales'
        },
        {
            item: 'Plastic products'
        },
        {
            item: 'Metal products'
        },

    ]
    const productItems = [
        {
            img: product1,
            title: 'Table Lamp',
            price: '$37',
            rate: '4.8',
            rateCount: '(850)'
        },
        {
            img: product2,
            title: 'Ceiling Lamp ',
            price: '$37',
            rate: '4.8',
            rateCount: '(850)'
        },
        {
            img: product3,
            title: 'Blue Wood Chair',
            price: '$37',
            rate: '4.8',
            rateCount: '(850)'
        },
    ]
    return (
        <div className='readyToBuySec__handler'>
            <div className="container">
                <div className="allCategory__header text-center mb-4">
                    <HeaderSec title={'Ready-to-buy Products'}
                    />
                </div>
                <div className="readyToBuy__navigationBar none__on__small__screen">
                    <ul className="listedNavigate">
                        {
                            listedNavigationItem.map((el, index) => {
                                return (
                                    <BorderedNavigationBar itemStyle={el.itemStyle} key={index} listTitle={el.item} />
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="readyToBuy__selectBar display__on__small__screen">
                    <>
                        <select name="" id="">
                            {
                                listedNavigationItem.map((el, index)=>{
                                    return(
                                        <option key={index}>{el.item}</option>
                                    )
                                })
                            }
                            
                        </select>
                    </>
                </div>
                <div className="readyToBuy__products">
                    <div className="row">
                        {
                            productItems.map((el, index) => {
                                return (
                                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                                        <ProductCard productImage={el.img} productName={el.title} productPrice={el.price} productRate={el.rate} productRateNum={el.rateCount} />
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
