import React from 'react';
import './productCard.css';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function ProductCard({ getCurrentProducts, product, itemType, token, productImage, productName, productPrice, companyName, prodSlug, productCurrancy }) {
    const navigate = useNavigate();
    const loginType = localStorage.getItem('loginType');

    const handleAddProductToCart = (id) => {
        if (token) {
            if (loginType === 'employee') {
                toast.error(`Employees Can't Add to Cart!
                You Must be A user.
                `);
            } else {
                const product = { item_type: itemType, item_id: `${id}` };
                const toastId = toast.loading('Loading...');
                axios.post(`${baseURL}/user/add-to-cart?t=${new Date().getTime()}`, product, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    }
                })
                    .then(response => {
                        getCurrentProducts();
                        toast.success(response?.data?.message || 'Added Successfully!', {
                            id: toastId,
                            duration: 1000,
                        })
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
                            id: toastId,
                            duration: 1000,
                        });
                    });
            };
        } else {
            toast.error('You Should Login First');
        };
    };

    const handleAddProductToWishList = (id) => {
        if (token) {
            if (loginType === 'employee') {
                toast.error(`Employees Can't Add to Cart!
                You Must be A user.
                `);
            } else {
                const product = { product_id: `${id}` };
                const toastId = toast.loading('Loading...');
                axios.post(`${baseURL}/user/control-wishlist?t=${new Date().getTime()}`, product, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    }
                })
                    .then(response => {
                        getCurrentProducts();
                        toast.success(response?.data?.message || 'Added Successfully!', {
                            id: toastId,
                            duration: 1000,
                        })
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
                            id: toastId,
                            duration: 1000,
                        });
                    });
            };
        } else {
            toast.error('You Should Login First');
        };
    };

    return (
        <div className='productCard__item'>
            <div className="product__image">

                <img src={productImage ? productImage : ''} alt="product-imag" onClick={() => {
                    scrollToTop();
                    navigate(`/shop/${prodSlug}`);
                }} />
                <div className="card__wishlist" onClick={() => handleAddProductToWishList(product?.id)}>
                    <i className={`bi bi-heart-fill ${(product?.inWishList) && 'text-danger'}`}></i>
                </div>
            </div>
            <div className="product__info">
                <div className="main__info">
                    <h3 onClick={() => {
                        scrollToTop();
                        navigate(`/shop/${prodSlug}`);
                    }}>
                        {productName ? productName : ''}
                    </h3>
                    <h5>
                        {productCurrancy ? productCurrancy : '$'}{productPrice ? productPrice : ''}
                    </h5>
                </div>
                <div className="sub__info">

                    <p>
                        <span className='prodcut_rate'>
                            {companyName ? companyName : ''}
                        </span>
                    </p>
                    {
                        product?.inCart ?
                            <button className='pageMainBtnStyle'
                                onClick={() => 
                                    navigate('/my-cart')
                                    
                                

                                }>
                                Show Cart
                            </button>
                            :
                            <button className='pageMainBtnStyle' onClick={() => handleAddProductToCart(product?.id)}>
                                Add To Cart
                            </button>
                    }

                </div>
            </div>
        </div>
    );
};