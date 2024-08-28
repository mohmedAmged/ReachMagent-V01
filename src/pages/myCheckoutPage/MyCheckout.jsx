import React, { useEffect, useState } from 'react'
import './myCheckout.css'
import testImg from '../../assets/productImages/S0-unsplash-1_650d426ce6d6f.jpg'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
export default function MyCheckout({ token }) {
    const { companyId } = useParams();

    const loginType = localStorage.getItem('loginType');
    const [checkoutData, setCheckoutData] = useState([]);
    const fetchCheckoutData = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/get-checkout/${companyId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCheckoutData(response?.data?.data);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
        };
    };
    useEffect(() => {
        fetchCheckoutData();
    }, [loginType, token]);

    console.log(checkoutData);

    const checkoutItemsData = checkoutData?.cart_items

    const [user, setUser] = useState({})
    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData')
        if (cookiesData) {
            const newShape = JSON.parse(cookiesData)
            setUser(newShape)
        }
    }, [Cookies.get('currentLoginedData')])

    // console.log(user?.country);

    return (
        <div className='myCheckout__handler'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row my-3">
                            <div className="col-lg-8 col-md-8">
                                <div className="checkout__mainContent">
                                    <h2>
                                        Your Shipping Information
                                    </h2>
                                    <div className="checkoutForm_info checkout_card">
                                        <h5 className='checkout_subTit'>
                                            Checkout Destination
                                        </h5>
                                        <div className="checkoutForm_items">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    select country
                                                </label>
                                                <select
                                                    className='form-select'
                                                    id=""
                                                    value={''}

                                                >
                                                    <option value={''} disabled>Select Type</option>

                                                </select>
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    select city
                                                </label>
                                                <select
                                                    className='form-select'
                                                    id=""
                                                    value={''}

                                                >
                                                    <option value={''} disabled>Select Type</option>

                                                </select>
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    select area
                                                </label>
                                                <select
                                                    className='form-select'
                                                    id=""
                                                    value={''}

                                                >
                                                    <option value={''} disabled>Select Type</option>
                                                </select>
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Address
                                                </label>
                                                <input
                                                    id=""
                                                    name=""
                                                    className='form-control'
                                                    type="text"
                                                    placeholder='Enter Your Address'
                                                    value={''}
                                                    onChange={''}
                                                />
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Name
                                                </label>
                                                <input
                                                    id=""
                                                    name=""
                                                    className='form-control'
                                                    type="text"
                                                    placeholder='Enter Your Name'
                                                    value={''}
                                                    onChange={''}
                                                />
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    phone
                                                </label>
                                                <input
                                                    id=""
                                                    name=""
                                                    className='form-control'
                                                    type="text"
                                                    placeholder='Enter your Phone'
                                                    value={''}
                                                    onChange={''}
                                                />
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Order Notes
                                                </label>
                                                <textarea
                                                    id=""
                                                    name=""
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder='Enter Your Notes'
                                                    value={''}
                                                    onChange={''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h2>
                                        Your Order
                                    </h2>
                                    {
                                        checkoutItemsData &&
                                        Object.entries(checkoutItemsData)?.map(([companyName, companyDetails], idx) => (
                <div className="checkout_items checkout_card">
                    <h5 className='checkout_subTit'>
                        Shipment <span>({checkoutData?.total_quantity} items)</span>
                    </h5>
                    <div className="checkout_products">
                        {
                            companyDetails?.items?.map((item, index) => (
                                <div key={index} className="checkout_product_item mb-3">
                                    <div className="product_item_img">
                                        <img src={item?.media[0]?.media} alt='checkout-img' />
                                    </div>
                                    <div className="product_item_info">
                                        <h5>
                                            {item?.item_name}
                                        </h5>
                                        {
                                            item?.item_attribute_name !== 'N/A' && 
                                            <div className="item__attributes">
                                                <div className="attribute__tit">
                                                {item?.item_attribute_name}
                                                </div>
                                                <span>
                                                    {item?.item_attribute}
                                                </span>
                                            </div>
                                        }
                                        <p>
                                            Qty: {item?.quantity}
                                        </p>
                                        <h5>
                                            price per item: {item?.item_price}
                                        </h5>
                                        <h5 className='item_price'>
                                           Total Price: {item?.total_price}
                                        </h5>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
                                        ))
                                    }

                                    <h2>
                                        payment
                                    </h2>
                                    <div className="checkout_paymentMethod checkout_card">
                                        <h5 className='checkout_subTit'>
                                            <p className='paymentHint'>cash</p>
                                            Cash on delivery
                                            <p className='paymentNote'>Extra Charges may be applied</p>
                                        </h5>
                                        <div className="checkout_payment_details">
                                            <div className="payment_mainDetails">
                                                <h5>
                                                    Cash On Delivery
                                                </h5>
                                                <p>
                                                    Extra Charge: EGP 9.00
                                                </p>
                                            </div>
                                            <div className="paymentHint">
                                                Cash
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <h2>
                                    Order summary
                                </h2>
                                <div className="orderSummary__content">
                                    <h5>
                                        order details
                                    </h5>

                                    <div className="orderSummary__info">
                                        <div className="summaryInfo__item">
                                            <span>
                                                Subtotal (1 items)
                                            </span>
                                            <h5>
                                                $200
                                            </h5>
                                        </div>
                                        <div className="summaryInfo__item">
                                            <span>
                                                Shipping Fee
                                            </span>
                                            <h5>
                                                $50
                                            </h5>
                                        </div>

                                    </div>
                                    <div className="orderTotalPrice">
                                        <div className="summaryInfo__item">
                                            <div className='totPrice'>
                                                Total <span>( inclusive of VAT )</span>
                                            </div>
                                            <h5>
                                                $250
                                            </h5>
                                        </div>
                                    </div>

                                </div>
                                <div className="orderCheckout__btn mt-4">
                                    <button>
                                        place order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
