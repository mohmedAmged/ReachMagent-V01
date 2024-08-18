import React from 'react'
import './productCard.css'
export default function ProductCard({ productImage, productName, productPrice, companyName }) {
    return (
        <div className='productCard__item'>
            <div className="product__image">
                <img src={productImage} alt="product-imag" />
            </div>
            <div className="product__info">
                <div className="main__info">
                    <h3>
                        {productName}
                    </h3>
                    <h5>
                        ${productPrice}
                    </h5>
                </div>
                <div className="sub__info">
                    
                    <p>
                        {/* <i className="bi bi-star-fill"></i> */}
                        <span className='prodcut_rate'>
                            {companyName ? companyName : ''}
                        </span>
                    </p>
                    <button className='pageMainBtnStyle'>
                        buy now
                    </button>
                </div>
            </div>
        </div>
    )
}
