import React from 'react';
import './ShopSliderSec.css';
import ShopMainCard from '../shopMainCard/ShopMainCard';
import { Container} from 'react-bootstrap';
import img1 from '../../assets/furnitureImages/0628742713786f4ad2af80b4b11e6013.png'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";

export default function ShopSliderSec() {
  return (
    <Container className='my-5 py-4'>
              <Swiper
          className='mySwiper'
          modules={[Autoplay]}
          spaceBetween={10}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
          }}
          // loop
          breakpoints={{
            320: {
              slidesPerView: 6,
              spaceBetween: 20
            },
            480: {
              slidesPerView: 6,
              spaceBetween: 20
            },
            600: {
              slidesPerView: 6,
              spaceBetween: 30
            },
            640: {
              slidesPerView: 6,
              spaceBetween: 30
            },
          }}
        >
        <ShopMainCard 
          // imgSrc,cardHead,cardText,rate,buttonText
          imgSrc={img1}
          cardHead='Blue Classic Chair'
          cardText='65'
          rate='4.6'
          buttonText='Buy Now'
        />
        </Swiper>
      
    </Container>
  );
};
