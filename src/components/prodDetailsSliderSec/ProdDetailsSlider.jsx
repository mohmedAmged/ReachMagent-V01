import React, { useState } from 'react';
import imgDetails1 from '../../assets/productImages/c891684ea471c925ce468f16b1fa7765.png'
import imgDetails2 from '../../assets/productImages/5a38de872b5a9de89fce778c8020427c.jpeg'
import imgDetails3 from '../../assets/productImages/96543b544c123b92c0c24a73c4e460b4.jpeg'
import imgDetails4 from '../../assets/productImages/abd795b95507f5c05d0d3c1db701cbd5.jpeg'
import imgDetails5 from '../../assets/productImages/bf683bb83dd212553d6ec955a1e3572d.jpeg'
import './prodDetailsSlider.css';
import { Col, Container, Row } from 'react-bootstrap';


import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';


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

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Container>
      <Row>
        <Col md={2}>
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
        <Col md={10} className='activeImage'>
          <div className="imgContainer">
            <img src={currImg} alt="product Details" />
          </div>
        </Col>
        <Col lg={12} className='sliderOfProductDetails'>
        <Swiper
        style={{
          '--swiper-navigation-color': '#969696',
          '--swiper-pagination-color': '#969696',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {
          imgs.map(img=>{
            return(
              <SwiperSlide key={img.id}>
                <img className='activeImgInSlider' src={img.src} alt='product details'/>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={5}
        slidesPerView={1}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mb-4"
        breakpoints={{
        200: {
          slidesPerView: 2,
        },
        400:{
            slidesPerView: 3,
          },
          500: {
            slidesPerView: 5,
          },
        }}
      >
        {
          imgs.map(img=>{
            return(
              <SwiperSlide key={img.id}>
                <img className='swiperSlideSecondaryImg' src={img.src} alt='product details'/>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
        </Col>
      </Row>
    </Container>
  )
}
