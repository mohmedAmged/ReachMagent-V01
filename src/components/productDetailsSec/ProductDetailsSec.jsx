import React from 'react';
import './ProductDetailsSec.css';
import { Col, Container, Row } from 'react-bootstrap';
import ProdDetailsSlider from '../prodDetailsSlider/ProdDetailsSlider';


export default function ProductDetailsSec() {
  return (
    <Container className='productDetails__sec mb-5 mt-3 pb-5'>
      <Row>
        <Col lg={9}>
          <ProdDetailsSlider />
        </Col>
        <Col lg={3}>
        </Col>
      </Row>
    </Container>
  )
}
