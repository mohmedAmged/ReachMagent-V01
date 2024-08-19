import React from 'react';
import './shop.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
import ShopCategorySlider from '../../components/shopCategorySliderSec/ShopCategorySlider';
import FilterationBar from '../../components/filterationBarSec/FilterationBar';
import ShopProducts from '../../components/shopProductsSec/ShopProducts';

export default function Shop({token}) {
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
      {/* <ShopCategorySlider /> */}
      {/* <FilterationBar /> */}
      <ShopProducts token={token} />
    </>
  );
};
