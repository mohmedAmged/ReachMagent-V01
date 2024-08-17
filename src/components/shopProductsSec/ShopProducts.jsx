import React, { useEffect, useState } from 'react';
import './shopProducts.css';

import searchIcon from '../../assets/icons/search.svg'
import ProductCard from '../productCardSec/ProductCard';

export default function ShopProducts({ products }) {

  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(20000);

  const handleSliderChange = (e) => {
    setSelectedMaxPrice(Number(e.target.value));
  };

  const handleMaxPriceInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice && value <= maxPrice) {
      setSelectedMaxPrice(value);
    }
  };

  return (
    <div className='container'>
      <div className="readyToBuy__products">
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebarForItemsFilter__handler">
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="type" className='d-flex justify-content-between align-items-center'>
                    <span>
                      Sorting Type
                    </span>
                    <i className="bi bi-arrow-down-up"></i>
                  </label>
                  <select
                    name="type"
                    className="form-control custom-select"
                    value={''}
                    onChange={''}
                  >
                    <option value="">Sorted by Default</option>
                    <option value="news">Latest</option>
                    <option value="discount">Earliest</option>
                  </select>
                </div>
              </div>
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="title_ar">Filter by Name</label>
                  <input
                    type="text"
                    name="title_ar"
                    className="form-control"
                    placeholder={`Enter your text`}
                    value={''}
                    onChange={''}
                  />
                </div>
              </div>
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="category">
                    Filter by Category
                  </label>
                  <select
                    name="category"
                    className="form-control custom-select"
                    value={''}
                    onChange={''}
                  >
                    <option value="">Sorted by Default</option>
                    <option value="news">Latest</option>
                    <option value="discount">Earliest</option>
                  </select>
                </div>
              </div>
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="sub-category">
                    Filter by Sub-Category
                  </label>
                  <select
                    name="sub-category"
                    className="form-control custom-select"
                    value={''}
                    onChange={''}
                  >
                    <option value="">Sorted by Default</option>
                    <option value="news">Latest</option>
                    <option value="discount">Earliest</option>
                  </select>
                </div>
              </div>
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="company">
                    Filter by Company
                  </label>
                  <select
                    name="company"
                    className="form-control custom-select"
                    value={''}
                    onChange={''}
                  >
                    <option value="">Sorted by Default</option>
                    <option value="news">Latest</option>
                    <option value="discount">Earliest</option>
                  </select>
                </div>
              </div>
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="price-range">
                    Filter by Price
                  </label>
                  <div className="price-filter d-flex justify-content-between align-items-center">
                    <input
                      type="number"
                      name="min-price"
                      className="form-control"
                      placeholder="Min"
                      value={minPrice}
                      readOnly
                      // onChange={handleMinPriceChange}
                    />
                    <input
                      type="number"
                      name="max-price"
                      className="form-control"
                      placeholder="Max"
                      value={selectedMaxPrice}
                      onChange={handleMaxPriceInputChange}
                    />
                  </div>
                  <input
                    type="range"
                    className="price-slider"
                    min={minPrice}
                    max={maxPrice}
                    value={selectedMaxPrice}
                    onChange={handleSliderChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="row">
              {
                products.map((el, index) => {
                  return (
                    <div key={index} className="col-lg-6 col-md-6 col-sm-12 my-2 d-flex justify-content-center">
                      <ProductCard productImage={el.img} productName={el.title} productPrice={el.price} productRate={el.rate} productRateNum={el.rateCount} />
                    </div>
                  )
                })
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
