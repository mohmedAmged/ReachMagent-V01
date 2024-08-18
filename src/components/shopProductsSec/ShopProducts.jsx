import React, { useEffect, useState } from 'react';
import './shopProducts.css';
import ProductCard from '../productCardSec/ProductCard';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function ShopProducts({token}) {
  const loginType = localStorage.getItem('loginType');
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(20000);
  
  const [products,setProducts] = useState([]);

  const handleSliderChange = (e) => {
    setSelectedMaxPrice(Number(e.target.value));
  };

  const handleMaxPriceInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice && value <= maxPrice) {
      setSelectedMaxPrice(value);
    };
  };

  // const getCurrentProducts = async () => {
  //   const toastId = toast.loading('Loading Products...');
  //   await axios.get(`${baseURL}/user/products?t=${new Date().getTime()}`,{
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   .then(response => {
  //     setProducts(response?.data?.data?.products);
  //     toast?.success(response?.data?.message || 'Products Loaded Successfully!',{
  //       id: toastId,
  //       duration: 1000
  //     });
  //   })
  //   .catch(error=>{
  //     toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
  //       id: toastId,
  //       duration: 1000
  //     });
  //   });
  // };

  // const getCurrentAllowedCountries = async () => {
  //   await axios.get(`${baseURL}/user/allowed-companies?t=${new Date().getTime()}`,{
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   .then(response => {
  //     console.log(response?.data?.data?.allowed_companies);
  //   })
  //   .catch(error =>{
  //     toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
  //       duration: 1000,
  //     });
  //   });
  // };

  // useEffect(()=>{
  //   getCurrentProducts();
  //   getCurrentAllowedCountries();
  // },[loginType,token]);

  return (
    <div className='container'>
      <div className="readyToBuy__products">
        <div className="row">
          <div className="col-lg-3 col-md-4 ">
            <div className="sidebarForItemsFilter__handler">
              <div className="sidebarItemFilter">
                <div className="catalog__new__input">
                  <label htmlFor="type" className='d-flex justify-content-between align-items-center mb-3'>
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
              <div className="sidebarItemFilter">
                <button className='clearFilterBtn'>
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-8">
            <div className="row">
              {
                products?.map((el) => {
                  return (
                    <div key={el?.id} className="col-lg-3 col-md-6 col-sm-12 my-2 d-flex justify-content-center">
                      <ProductCard productImage={el?.productImages[0]?.image} productName={el?.title} productPrice={el?.price} companyName={el?.company_name} productRateNum={el.rateCount} />
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
