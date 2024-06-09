import React from 'react';
import './productDetailsSec.css';
import { Col, Container, Row } from 'react-bootstrap';
import ProdDetailsSlider from '../prodDetailsSliderSec/ProdDetailsSlider';

import img1 from './../../assets/productDetailsImgs/17e9aaa6c0d56bd5d83aa9c3524baa7b.png'

export default function ProductDetailsSec() {
  return (
    <Container className='productDetails__sec mb-5 mt-3 pb-5'>
      <Row>
        <Col lg={8}>
          <ProdDetailsSlider/>
        </Col>
        <Col lg={4}>
          <div className='productDetails__description mt-md-4'>
            <h2 className='productDetails__head'>
              L-Shape Sofa
            </h2>
            <p className='productDetails__rate d-flex gap-1'>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star"></i>
            </p>
            <p className='productDetails__price'>
              299 EGP
            </p>
            <p className='productDetails__delPrice d-flex gap-3 align-items-center'>
              <span className='productDetails__deletedPrice'>
                400 EGP
              </span>
              <span className='productDetails__priceOffer'>
                -30%
              </span>
            </p>
              <div className="productDetails__sizePart d-flex flex-column gap-2 align-items-start my-4">
                <h4 className='productDetails__sizeHead'>
                  Size
                </h4>
                <p className='productDetails__size1'>
                  200x50 cm
                </p>
                <p className='productDetails__size2'>
                  250x50 cm
                </p>
              </div>
            <p className='productDetails__soldBy d-flex gap-2 align-items-center mb-3'>
              <span>
                Sold by 
                <strong>Tasaheel</strong>
              </span>
              <img src={img1} alt='country of Seller Man' className="productDetails__countryOfSeller" />
            </p>
            <p className='productDetails__deleveringDate'>
              Delivery between  
              <strong>
                Mon, 29 May - Tue, 30 May
              </strong>
            </p>
            <p className='productDetails__deleveringCondition d-flex gap-1 mt-2'>
              <i className="bi bi-geo-alt"></i>
              Delivering all over Jordan only
            </p>
            <div className='productDetails__addToCartPart d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3'>
              <div className="productDetails__quantitiy d-flex align-items-center">
                <p className="productDetails__decrease">
                  <i className="bi bi-dash"></i>
                </p>
                <p className="productDetails__counter">
                  1
                </p>
                <p className="productDetails__increase">
                  <i className="bi bi-plus"></i>
                </p>
              </div>
              <div className="productDetails__addToCartBtn">
                <button className="addToCartBtn">
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
