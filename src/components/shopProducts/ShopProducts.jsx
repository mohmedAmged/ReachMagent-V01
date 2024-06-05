import React from 'react';
import './shopProducts.css';


import ProductCard from '../productCard/ProductCard';

export default function ShopProducts({products}) {

  return (
    <div className='container'>
      <div className="readyToBuy__products">
        <div className="row">
          {
            products.map((el, index) => {
              return (
                <div key={index} className="col-lg-4 col-md-6 col-sm-12 my-2">
                  <ProductCard productImage={el.img} productName={el.title} productPrice={el.price} productRate={el.rate} productRateNum={el.rateCount}/>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
