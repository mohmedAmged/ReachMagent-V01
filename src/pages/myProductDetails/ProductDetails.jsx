import React from 'react';
import './productDetails.css';
import product4 from '../../assets/productImages/5a38de872b5a9de89fce778c8020427c.jpeg'
import product5 from '../../assets/productImages/8a93dc0202ae8257bb4156a4bf0933c1.jpeg'
import product6 from '../../assets/productImages/96543b544c123b92c0c24a73c4e460b4.jpeg'
import product7 from '../../assets/productImages/abd795b95507f5c05d0d3c1db701cbd5.jpeg'
import product8 from '../../assets/productImages/c891684ea471c925ce468f16b1fa7765.png'
import product9 from '../../assets/productImages/bf683bb83dd212553d6ec955a1e3572d.jpeg'
import ProductDetailsFilterationBar from '../../components/productDetailsFilterationBarSec/ProductDetailsFilterationBar';
import ProductDetailsDescriptionContent from '../../components/productDetailsDescriptionContentSec/ProductDetailsDescriptionContent';
import ProductDetailsOwnerOfCurrProduct from '../../components/productDetailsOwnerOfCurrProductSec/ProductDetailsOwnerOfCurrProduct';
import ShopProducts from '../../components/shopProductsSec/ShopProducts';
import ProductDetailsSec from '../../components/productDetailsSecc/ProductDetailsSec';

export default function ProductDetails() {
  const relatedProducts = [
    {
        img: product4,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product5,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product6,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product7,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product8,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product9,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
  ]
  const items = [
    { name: 'Details', active: true },
    { name: 'Specification', active: false },
    { name: 'Reviews', active: false },
    { name: 'Seller Details', active: false },
    // Add more items as needed
  ];
  return (
    <div className='productDetailsPage'>
      <ProductDetailsSec />
      <ProductDetailsFilterationBar items={items}/>
      <ProductDetailsDescriptionContent />
      <ProductDetailsOwnerOfCurrProduct />
      <ShopProducts products={relatedProducts} />
    </div>
  );
};
