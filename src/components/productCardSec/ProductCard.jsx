import React from 'react'
import './productCard.css'
import { useNavigate } from 'react-router-dom';
export default function ProductCard({ productImage, productName, productPrice, companyName , prodSlug }) {
    const navigate = useNavigate();
    const handleAddProductToCart = ()=>{};

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
                        <span className='prodcut_rate' onClick={()=> navigate(`/shop/${prodSlug}`)}>
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
