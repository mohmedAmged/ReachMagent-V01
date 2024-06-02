import React from 'react';
import './ProductCategoryCard.css';
import { useNavigate } from 'react-router-dom';
import categImg1 from '../../assets/productCategoryImages/6d1dc54671310022627aa35cd7ae6ca2.png';
export default function ProductCategoryCard({categImgSrc,categImgAlt,categName}) {
  const navigate = useNavigate();

  const handleNavigateToSingleCategoryPage = (name) => {
    navigate(`/shop/${name}`);
  };

  return (
      <div className='productCategory__card'> 
      <div>
        <img 
          src={categImg1}
          alt='categImg1'
          // src={categImgSrc ? categImgSrc : ''} 
          // alt={categImgAlt ? categImgAlt : ''} 
          />
      </div>
        <p>
          Sport
          {/* {categName ? categName : ''} */}
        </p>
      </div>
    )
  }
