import React from 'react';
import './shop.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
import ShopCategorySlider from '../../components/shopCategorySliderSec/ShopCategorySlider';
import FilterationBar from '../../components/filterationBarSec/FilterationBar';
import ShopProducts from '../../components/shopProductsSec/ShopProducts';
import product1 from '../../assets/productImages/Rectangle 4705 (1).png'
import product2 from '../../assets/productImages/Rectangle 4705 (2).png'
import product3 from '../../assets/productImages/Rectangle 4705 (3).png'
import product4 from '../../assets/productImages/5a38de872b5a9de89fce778c8020427c.jpeg'
import product5 from '../../assets/productImages/8a93dc0202ae8257bb4156a4bf0933c1.jpeg'
import product6 from '../../assets/productImages/96543b544c123b92c0c24a73c4e460b4.jpeg'
import product7 from '../../assets/productImages/abd795b95507f5c05d0d3c1db701cbd5.jpeg'
import product8 from '../../assets/productImages/c891684ea471c925ce468f16b1fa7765.png'
import product9 from '../../assets/productImages/bf683bb83dd212553d6ec955a1e3572d.jpeg'
export default function Shop() {
  const arrOfCateg = [
    {
      name: 'Categories',
      id: 1
    },
    {
      name: 'One',
      id: 2
    },
    {
      name: 'Two',
      id: 3
    },
    {
      name: "Three",
      id: 4
    }
  ]
  const productItems = [
    {
        img: product1,
        title: 'Table Lamp',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product2,
        title: 'Ceiling Lamp ',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
    {
        img: product3,
        title: 'Blue Wood Chair',
        price: '$37',
        rate: '4.8',
        rateCount: '(850)'
    },
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

  return (
    <>
      <MyMainHeroSec 
      heroSecContainerType='shopHeroSec__container' 
      headText='Ready To Buy Products' 
      paraPartOne='Dive into thousands of products ready to buy today'
      paraPartTwo='in your region, from a needle to whatever you need'
      categoryArr={arrOfCateg}
      />
      <ShopCategorySlider />
      <FilterationBar />
      <ShopProducts products={productItems} />
    </>
  );
};
