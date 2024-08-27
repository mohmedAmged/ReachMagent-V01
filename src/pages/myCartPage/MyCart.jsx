import React, { useEffect, useState } from 'react'
import './myCart.css'
import { baseURL } from '../../functions/baseUrl'
import axios from 'axios'
import { scrollToTop } from '../../functions/scrollToTop'
import toast from 'react-hot-toast'
export default function MyCart({ token }) {
    const loginType = localStorage.getItem('loginType')
    const [cartData, setCartData] = useState([])
    const [toggleState, setToggleState] = useState({});
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/my-cart?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCartData(response?.data?.data?.cart);
        } catch (error) {
            setCartData(error?.response?.data.message);
        }
    };
    const removeFromCart = async (cartItemId) => {
        try {
            const response = await axios.post(`${baseURL}/user/remove-from-cart`,
                { cart_item_id: String(cartItemId) }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {

                scrollToTop()
                toast.success('product item deleted successfully');
                // Reset form if needed
            } else {
                toast.error('Failed to delete product item');
            }

            fetchCartItems();
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Error deleting product item.');
        }
    };

    const toggleCompanyProducts = (companyId) => {
        setToggleState((prevState) => ({
            ...prevState,
            [companyId]: !prevState[companyId]
        }));
    };

    useEffect(() => {
        fetchCartItems();
    }, [loginType, token]);

    const cartItemsData = cartData?.cart_items

    return (
        <div className='myCart__handler'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row my-5 ">
                            <div className="col-lg-8">
                                {cartItemsData &&
                                    Object.entries(cartItemsData)?.map(([companyName, companyDetails]) => (
                                        <div key={companyDetails?.company_id} className="cartItems__content mb-5">
                                            <h2
                                                onClick={() => toggleCompanyProducts(companyDetails?.company_id)}
                                                style={{ cursor: 'pointer' }}>
                                                {companyName} products
                                                <i className={`bi ${toggleState[companyDetails?.company_id] ? 'bi-chevron-down' : 'bi-chevron-right'}`}
                                                    style={{ marginLeft: '10px' }}></i>
                                            </h2>
                                            {
                                                toggleState[companyDetails?.company_id] && companyDetails?.items?.map(item => (
                                                    <div className="productCartItem__card mb-3">
                                                        <div className="cartItem__img">
                                                            <img src={item?.media[0]?.media} alt="item-img" />
                                                        </div>
                                                        <div className="cartItem__info">
                                                            <div className="cartItem__info__left">
                                                                <h5>
                                                                    {item?.item_name}
                                                                </h5>
                                                                {
                                                                    item?.item_attribute !== 'N/A' ?
                                                                        <div className="item__attributes">
                                                                            <div className="attribute__tit">
                                                                                Attribute:
                                                                            </div>
                                                                            <span>
                                                                                {item?.item_attribute}
                                                                            </span>
                                                                        </div>
                                                                        :
                                                                        ''
                                                                }

                                                                <div className="item__qty">
                                                                    <span>Qty</span>
                                                                    <select className='' name="" id="">
                                                                        <option value="">1</option>
                                                                    </select>
                                                                </div>
                                                                <div className="remove__btn displayNoneOnSm"
                                                                    onClick={() => removeFromCart(item?.id)}>
                                                                    <i className="bi bi-trash3"></i>
                                                                    <span>Remove</span>
                                                                </div>
                                                            </div>
                                                            <div className="cartItem__info__right">
                                                                <div className="cartItem__price">
                                                                    <h3>
                                                                        ${item?.total_price}
                                                                    </h3>
                                                                </div>
                                                                <div className="remove__btn dislayNoneOnLg">
                                                                    <i className="bi bi-trash3"></i>
                                                                    <span>Remove</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))
                                            }

                                        </div>
                                    )
                                    )
                                }

                            </div>
                            <div className="col-lg-4">
                                <div className="orderSummary__content">
                                    <h5>
                                        order summary
                                    </h5>
                                    <div className="couponCodeInput">
                                        <input type="text" className="form-control" placeholder='Coupon Code' />
                                        <button>
                                            apply
                                        </button>
                                    </div>
                                    <div className="orderSummary__info">
                                        <div className="summaryInfo__item">
                                            <span>
                                                Subtotal ({cartData?.total_quantity} items)
                                            </span>
                                            <h5>
                                                ${cartData.total_price}
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
                                                ${(cartData.total_price + 50)}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="orderCheckout__btn">
                                        <button>
                                            Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12"></div>
                </div>
            </div>
        </div>
    )
}
