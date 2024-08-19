import React from 'react';
import './productDetailsSec.css';
import { Col, Container, Row } from 'react-bootstrap';
import ProdDetailsSlider from '../prodDetailsSliderSec/ProdDetailsSlider';
import toast from 'react-hot-toast';

export default function ProductDetailsSec({product,token}) {
  const loginType = localStorage.getItem('loginType');
  const handleAddProductToCart = ()=>{
    if(token){
      if(loginType === 'employee'){
        toast.error(`Employees Can't Add to Cart!
          You Must be A user.
          `);
      }else {

      };
    }else {
      toast.error('You Should Login First');
    };
  };

  return (
    <Container className='productDetails__sec mb-5 mt-3'>
      <Row>
        <Col lg={8}>
          <ProdDetailsSlider productImgs={product?.productImages} />
        </Col>
        <Col lg={4}>
          <div className='productDetails__description mt-md-4'>
            <h2 className='productDetails__head text-capitalize'>
              {product?.title ? product?.title : ''}
            </h2>
            <p className='mt-3 mb-4 fs-5 text-capitalize'>
              {product?.description}
            </p>
            <p className='productDetails__price mb-3'>
              {product?.price ? product?.price + product?.currency_symbol : ''}
            </p>
            <p className='productDetails__delPrice d-flex gap-3 align-items-center mb-4'>
              <span className='productDetails__deletedPrice'>
                {product?.discountPrice ? product?.price + product?.discountPrice : ''}{product?.currency_symbol}
              </span>
            </p>
            <p className='productDetails__soldBy d-flex gap-2 align-items-center mb-3 mb-4'>
              <span>
                Sold by 
                <strong>{product?.company_name}</strong>
              </span>
            </p>
            <div className='productDetails__addToCartPart d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3'>
              <div className="productDetails__addToCartBtn">
                <button className="addToCartBtn" onClick={handleAddProductToCart}>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
