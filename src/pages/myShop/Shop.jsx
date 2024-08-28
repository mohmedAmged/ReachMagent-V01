import React from 'react';
import './shop.css';
import ShopProducts from '../../components/shopProductsSec/ShopProducts';

export default function Shop({token}) {

  return (
    <>
      <ShopProducts token={token} />
    </>
  );
};
