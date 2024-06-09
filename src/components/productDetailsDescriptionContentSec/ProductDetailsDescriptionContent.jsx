import React from 'react';
import './productDetailsDescriptionContent.css';
import { Col, Container, Row } from 'react-bootstrap';

import img1 from '../../assets/productDetailsImgs/b8f44adf9c2b95c8b1f57774ba7a2304.jpeg'
import img2 from '../../assets/productDetailsImgs/c400e64324a8a1118957bb80444a42c9.jpeg'

export default function ProductDetailsDescriptionContent() {
  return (
    <Container>
      <Row>
        <Col lg={6}>
          <div className='productDetails__content my-4'>
            <h4 className='productDetails__contentHead'>
              Description
            </h4>
            <p className='productDetails__contentDescription'>
              Pro- Wireless Bluetooth Stereo Earphones Microphone Noise Cancelling In-Ear Design In-Ear Bluetooth Earbuds - PRO_White
            </p>
            <div className="product__description row">
              <div className="col-lg-4 col-md-6 my-2">
                <h5>
                  Brand
                </h5>
                <p>
                  Generic
                </p>
              </div>
              <div className="col-lg-4 col-md-6 my-2">
                <h5>
                  Model Name
                </h5>
                <p>
                  Pro White
                </p>
              </div>
              <div className="col-lg-4 col-md-6 my-2">
                <h5>
                  Color
                </h5>
                <p>
                  Pure White
                </p>
              </div>
              <div className="col-lg-4 col-md-6 my-2">
                <h5>
                  From Factor
                </h5>
                <p>
                  In Ear
                </p>
              </div>
              <div className="col-lg-4 col-md-6 my-2">
                <h5>
                  Material
                </h5>
                <p>
                  Plastic
                </p>
              </div>
              <div className="col-lg-4 col-md-6 my-2">
                <h5>
                  Noise Control
                </h5>
                <p>
                  Active Noise Cancellation
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={12}>
          <div className="frequentlyTogether">
              <h4>
                Frequently Bought Together
              </h4>
              <div className="frequentlyTogether-offer mt-4 d-flex justify-content-between align-items-center flex-wrap">
                <div className="frequentlyTogether-image position-relative">
                  <img src={img1} alt="" />
                  <i className="bi bi-check-square-fill"></i>
                  <h5>
                    White wood chair
                  </h5>
                </div>
                <i className="bi bi-plus"></i>
                <div className="frequentlyTogether-image position-relative">
                  <img src={img2} alt="" />
                  <i className="bi bi-check-square-fill"></i>
                  <h5>
                    Wood side table
                  </h5>
                </div>
                <div>
                  <button className='buyTogether-btn'>
                    Buy 2 Together for 250 AED
                  </button>
                </div>
              </div>
            </div>
        </Col>
      </Row>
    </Container>
  );
};
