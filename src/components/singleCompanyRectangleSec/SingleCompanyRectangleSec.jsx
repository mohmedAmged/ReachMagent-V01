import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import './singleCompanyRectangle.css';

export default function SingleCompanyRectangleSec({showCompaniesQuery}) {
  const questionsArr = [
    {
      id: 1,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 2,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 3,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 4,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 5,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 6,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 7,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 8,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
    {
      id: 9,
      question: 'Question lorem ipsum ?',
      answer: 'We’ve been focused on making the from v4 to v5 more approachable but we’ve also not been afraid'
    },
  ];
console.log(showCompaniesQuery?.companyFaqs);

  return (
    <div className='singleCompany__rectangleSec'>
      <div className="rectangleBg"></div>
      <div className="container">
        <div className="singleCompany__rectangleSec-head text-center">
          <h3>
            Popular <span>Questions</span>
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur. Lectus fermentum amet id luctus at libero.
          </p>
        </div>
        <div className="singleCompany__rectangleSec-slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            breakpoints={{
              470: {
                slidesPerView: 2,
                spaceBetween: 10
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10
              }
            }}
            className="mySwiper"
          >
            {
              showCompaniesQuery?.companyFaqs?.map(question=>{
                return(
                  <SwiperSlide key={question.id} className='singleCompany__rectangleSec-slide'>
                    <h4>{question?.question}</h4>
                    <p>{question?.answer}</p>
                  </SwiperSlide>
                )
              })
            }
          </Swiper>
        </div>
      </div>
    </div>
  );
};
