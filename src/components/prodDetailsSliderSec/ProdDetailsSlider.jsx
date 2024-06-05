import React, { useState } from 'react';
import imgDetails1 from '../../assets/productImages/c891684ea471c925ce468f16b1fa7765.png'
import imgDetails2 from '../../assets/productImages/5a38de872b5a9de89fce778c8020427c.jpeg'
import imgDetails3 from '../../assets/productImages/96543b544c123b92c0c24a73c4e460b4.jpeg'
import imgDetails4 from '../../assets/productImages/abd795b95507f5c05d0d3c1db701cbd5.jpeg'
import imgDetails5 from '../../assets/productImages/bf683bb83dd212553d6ec955a1e3572d.jpeg'

import './prodDetailsSlider.css';

import { Col, Container, Row } from 'react-bootstrap';

export default function ProdDetailsSlider() {
  const [currImg,setCurrImg] = useState(imgDetails1);
  const imgs = [
    {
      id: 1,
      src: imgDetails1
    },
    {
      id: 2,
      src: imgDetails2
    },
    {
      id: 3,
      src: imgDetails3
    },
    {
      id: 4,
      src: imgDetails4
    },
    {
      id: 5,
      src: imgDetails5
    },
  ]
  return (
    <Container>
      <Row>
        <Col sm={2}>
          <div className="d-flex flex-column justify-content-between sideImagesContainer">
            {
              imgs.map(img=>{
                return(
                  <div key={img?.id} className="imgContainer">
                    <img onClick={()=>{
                      setCurrImg(img.src);
                    }}
                    src={img.src} 
                    alt='product detials' 
                    />
                  </div>
                )
              })
            }
          </div>
        </Col>
        <Col sm={10} className='activeImage'>
          <div className="imgContainer">
            <img src={currImg} alt="product Details" />
          </div>
        </Col>
      </Row>
    </Container>
  )
}
