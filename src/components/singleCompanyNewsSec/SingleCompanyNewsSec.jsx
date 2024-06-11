import React from 'react';
import newImg from '../../assets/companyCards/profile.png';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Col, Container, Row } from 'react-bootstrap';
import "./singleCompanyNewsSec.css";

export default function SingleCompanyNewsSec() {
  const newsArr = [
    {
      id: 1,
      src: newImg,
      starsNum: 5,
      maxStarsNum: 5,
      newsHead: 'Homzmart',
      newsQuote: 'E-Commerce Website',
      newsDescreption: 'Lorem ipsum dolor sit amet consectetur. Fermentum tortor tortor nisi laoreet cursus ultrices amet. Odio arcu ornare turpis et condimentum sagittis justo. Varius ipsum ornare mattis dictumst tristique faucibus sit. Aliquam pretium cursus id fringilla id nunc ante.'
    },
    {
      id: 2,
      src: newImg,
      starsNum: 5,
      maxStarsNum: 5,
      newsHead: 'Homzmart',
      newsQuote: 'E-Commerce Website',
      newsDescreption: 'Lorem ipsum dolor sit amet consectetur. Fermentum tortor tortor nisi laoreet cursus ultrices amet. Odio arcu ornare turpis et condimentum sagittis justo. Varius ipsum ornare mattis dictumst tristique faucibus sit. Aliquam pretium cursus id fringilla id nunc ante.'
    },
    {
      id: 3,
      src: newImg,
      starsNum: 4,
      maxStarsNum: 5,
      newsHead: 'Homzmart',
      newsQuote: 'E-Commerce Website',
      newsDescreption: 'Lorem ipsum dolor sit amet consectetur. Fermentum tortor tortor nisi laoreet cursus ultrices amet. Odio arcu ornare turpis et condimentum sagittis justo. Varius ipsum ornare mattis dictumst tristique faucibus sit. Aliquam pretium cursus id fringilla id nunc ante.'
    },
  ]

  return (
    <Container className='my-5'>
      <Row className='justify-content-around'>
      <Col lg={6}>
        <Swiper
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {
            newsArr.map(el =>{
              return (
                <SwiperSlide key={el.id} className='news__card p-3'>
                  <div className="headOfNews__card d-flex justify-content-between align-items-start">
                    <div className="headOfNews__card-leftPart">
                      <div className="image">
                        <img src={el.src} alt="newImg" />
                      </div>
                      <h4>{el.newsHead}</h4>
                      <p>{el.newsQuote}</p>
                    </div>
                    <div className="headOfNews__card-rightPart pt-4">
                    {[...Array(el.starsNum)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill"></i>
                      ))}
                    {[...Array(el.maxStarsNum - el.starsNum)].map((_, index) => (
                        <i key={index} className="bi bi-star"></i>
                      ))}
                    </div>
                  </div>
                  <div className="news__card-body">
                    <p>
                      {
                        el.newsDescreption
                      }
                    </p>
                  </div>
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      </Col>
      <Col lg={6}>
        <Swiper
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {
            newsArr.map(el =>{
              return (
                <SwiperSlide key={el.id} className='news__card p-3'>
                  <div className="headOfNews__card d-flex justify-content-between align-items-start">
                    <div className="headOfNews__card-leftPart">
                      <div className="image">
                        <img src={el.src} alt="newImg" />
                      </div>
                      <h4>{el.newsHead}</h4>
                      <p>{el.newsQuote}</p>
                    </div>
                    <div className="headOfNews__card-rightPart pt-4">
                    {[...Array(el.starsNum)].map((_, index) => (
                        <i key={index} className="bi bi-star-fill"></i>
                      ))}
                    {[...Array(el.maxStarsNum - el.starsNum)].map((_, index) => (
                        <i key={index} className="bi bi-star"></i>
                      ))}
                    </div>
                  </div>
                  <div className="news__card-body">
                    <p>
                      {
                        el.newsDescreption
                      }
                    </p>
                  </div>
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
