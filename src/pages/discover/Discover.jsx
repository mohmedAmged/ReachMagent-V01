import React from 'react';
import './Discover.css';
import MyMainHeroSec from '../../components/myMainHeroSec/MyMainHeroSec';
import FranchiseSec from '../../components/franchiseSec/FranchiseSec';
import ShopCategorySlider from '../../components/shopCategorySlider/ShopCategorySlider';
import ShopSliderSec from '../../components/shopSliderSec/ShopSliderSec';
import HeaderOfSec from '../../components/headerOfSec/HeaderOfSec';

export default function Discover() {
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
      <HeaderOfSec
        secHead='Trending Products'
        secText='There are many variations of passages of Lorem Ipsum available but the majority have suffered'
      />
      <ShopSliderSec />

      <FranchiseSec
        pageName='discover'
        headText='New Arrivals'
        paraText='Check Our New Collection'
      />
      <ShopSliderSec 
      />
    </>
  );
};
