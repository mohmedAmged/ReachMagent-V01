import React from 'react';
import './productCard.css';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';

export default function ProductCard({ token, productImage, productName, productPrice, companyName, prodSlug, productCurrancy }) {
    const navigate = useNavigate();
    const loginType = localStorage.getItem('loginType')
    const handleAddProductToCart = () => {
        if (token) {
            if (loginType === 'employee') {
                toast.error(`Employees Can't Add to Cart!
                You Must be A user.
                `);
            } else {
            };
        } else {
            toast.error('You Should Login First');
        };
    };

    return (
        <div className='productCard__item'>
            <div className="product__image" onClick={() => {
                scrollToTop();
                navigate(`/shop/${prodSlug}`);
            }}>
                
                <img src={productImage ? productImage : ''} alt="product-imag" />
                <div className="card__wishlist">
                    <i className="bi bi-heart-fill"></i>

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
                    <button className='pageMainBtnStyle' onClick={handleAddProductToCart}>
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    )
}
