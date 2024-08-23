import React, { useEffect, useState } from 'react';
import './shopProducts.css';
import ProductCard from '../productCardSec/ProductCard';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { reverseSlugToObj, slugifyFilteration } from '../../functions/slugifyToURL';
import { scrollToTop } from '../../functions/scrollToTop';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearEmptyQueryValues } from '../../functions/slugTransformation';
import MyMainHeroSec from '../myMainHeroSecc/MyMainHeroSec';

export default function ShopProducts({token}) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [products,setProducts] = useState([]);
  const sortingTypes = [{
    id: 1,
    name: 'Latest First',
    value: 'desc'
  },{
    id: 2,
    name: 'Earliest First',
    value: 'asc',
  }];
  const [companiesAllowed,setCompaniesAllowed] = useState([]);
  const [categoriesAllowed,setCategoriesAllowed] = useState([]);
  const [subCategoriesAllowed,setSubCategoriesAllowed] = useState([]);
  const [filterationObj , setFilterationObj] = useState({
    company: '',
    title: '',
    sorting: '',
    category: '',
    sub_category: '',
    price_from: '',
    price_to: '',
  });
  const [slugURLObj,setSlugURLObj] = useState('');

  useEffect(()=>{
    if(search){
      const newFilterGettedFromURL = reverseSlugToObj(search.slice(1));
      setFilterationObj({...filterationObj , ...newFilterGettedFromURL});
    };
  },[]);

  const getCurrentAllowedCountriesAndCategories = async () => {
    await axios.get(`${baseURL}/user/allowed-companies?t=${new Date().getTime()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setCompaniesAllowed(response?.data?.data?.allowed_companies);
    })
    .catch(error =>{
      toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
        duration: 1000,
      });
    });

    await axios.get(`${baseURL}/user/allowed-categories?t=${new Date().getTime()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setCategoriesAllowed(response?.data?.data?.allowed_categories);
    })
    .catch(error =>{
      toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
        duration: 1000,
      });
    });
  };

  const changeFilterToSlug = (obj) => {
    let slugifiedObj = ``;
    for (const [key, value] of Object.entries(obj)) {
      const slugifiedKey = slugifyFilteration(key);
      const slugifiedValue = slugifyFilteration(value);
      if(slugifiedValue){
        slugifiedObj += `${slugifiedKey}=${slugifiedValue}&`;
      };
    };
    setSlugURLObj(slugifiedObj.slice(0,-1));
  };

  useEffect(()=>{
    changeFilterToSlug(filterationObj);
    if(slugURLObj){
      const filterParams = new URLSearchParams(filterationObj);
      const slugWithoutEmptyVlaues = clearEmptyQueryValues(filterParams.toString());
      navigate(`/shop?${slugWithoutEmptyVlaues}`);
    };
  },[filterationObj,slugURLObj]);

  const getCurrentProducts = async () => {
    await axios.get(`${baseURL}/user/products?t=${new Date().getTime()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(!search){
        setProducts(response?.data?.data?.products?.products);
      };
      setMaxPrice(+response?.data?.data?.max_price);
      setMinPrice(+response?.data?.data?.min_price);
      setSelectedMaxPrice(+response?.data?.data?.max_price);
    });
  };

  useEffect(()=>{
    getCurrentProducts();
    getCurrentAllowedCountriesAndCategories();
  },[]);

  const filterProducts = async () => {
    (async()=>{
      if(slugURLObj){
        await axios.get(`${baseURL}/user/filter-products?${slugURLObj}&t=${new Date().getTime()}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          const currProducts = response?.data?.data?.products;
          setProducts(currProducts);
        })
        .catch(error => {
          toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
            duration: 1000,
          });
        })
      };
    })();
  };

  useEffect(()=>{
    filterProducts();
  },[slugURLObj,filterationObj]);

  const handleChangeFilterInputs = (e) => {
    if(e.target.name === 'category'){
      setFilterationObj({...filterationObj , [e?.target?.name]: e.target.value , sub_category: ''});
      (async () =>{ 
        await axios.get(`${baseURL}/user/show-allowed-category/${e?.target?.value}?t=${new Date().getTime()}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setSubCategoriesAllowed(response?.data?.data?.allowed_category?.subCategories);
        })
        .catch(error =>{
          toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
            duration: 1000,
          });
        });
      })();
    } else if(!(e.target.name === 'price_to')){
      setFilterationObj({...filterationObj , [e?.target?.name]: e.target.value});
    } else {
      const value = Number(e.target.value);
      if (value >= minPrice && value <= maxPrice +10) {
        setSelectedMaxPrice(value);
      };
    };
    setSlugURLObj();
  };

  const handleMouseUpOnRange = (e) => {
    setFilterationObj({...filterationObj, [e.target.name]: `${e.target.value}`,price_from: `${minPrice}`});
  };

  return (
    <>
      <MyMainHeroSec 
        heroSecContainerType='shopHeroSec__container' 
        headText='Ready To Buy Products' 
        paraPartOne='Dive into thousands of products ready to buy today'
        paraPartTwo='in your region, from a needle to whatever you need'
        categoryArr={companiesAllowed}
        currentPage={'shop'}
        handleChangeFilterInputs={handleChangeFilterInputs}
      />
      <div className='container'>
        <div className="readyToBuy__products">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="sidebarForItemsFilter__handler">
                <div className="sidebarItemFilter">
                  <div className="catalog__new__input">
                    <label htmlFor="shopFilterationSorting" className='d-flex justify-content-between align-items-center mb-3'>
                      <span>
                        Sorting Type
                      </span>
                      <i className="bi bi-arrow-down-up"></i>
                    </label>
                    <select
                      id='shopFilterationSorting'
                      name="sorting"
                      className="form-control custom-select"
                      defaultValue={''}
                      onChange={handleChangeFilterInputs}
                    >
                      <option value="" disabled>Select Sorting Type</option>
                      {
                        sortingTypes?.map(sort=>(
                          <option key={sort?.id} value={sort?.value}>{sort?.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="sidebarItemFilter">
                  <div className="catalog__new__input">
                    <label htmlFor="shopFilterationtitle">Filter by Name</label>
                    <input
                      type="text"
                      name="title"
                      id="shopFilterationtitle"
                      className="form-control"
                      placeholder={`Enter your text`}
                      onChange={handleChangeFilterInputs}
                    />
                  </div>
                </div>
                <div className="sidebarItemFilter">
                  <div className="catalog__new__input">
                    <label htmlFor="shopFilterationcompany">
                      Filter by Company
                    </label>
                    <select
                      name="company"
                      id="shopFilterationcompany"
                      className="form-control custom-select"
                      defaultValue={''}
                      onChange={handleChangeFilterInputs}
                    >
                      <option value="" disabled>Select a company</option>
                      {
                        companiesAllowed?.map(company => (
                          <option key={company?.id} value={company?.id}>{company?.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="sidebarItemFilter">
                  <div className="catalog__new__input">
                    <label htmlFor="shopFilterationcategory">
                      Filter by Category
                    </label>
                    <select
                      name="category"
                      id="shopFilterationcategory"
                      className="form-control custom-select"
                      defaultValue={''}
                      onChange={handleChangeFilterInputs}
                    >
                      <option value="" disabled>Select Category</option>
                      {
                        categoriesAllowed?.map(cat=>(
                          <option key={cat?.id} value={cat?.id}>{cat?.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="sidebarItemFilter">
                  <div className="catalog__new__input">
                    <label htmlFor="shopFilterationsub-category">
                      Filter by Sub-Category
                    </label>
                    <select
                      name="sub_category"
                      id="shopFilterationsub-category"
                      className="form-control custom-select"
                      value={filterationObj?.sub_category}
                      onChange={handleChangeFilterInputs}
                    >
                      <option value="" disabled>Select Sub-Category</option>
                      {
                        subCategoriesAllowed?.map(sub=>(
                          <option key={sub?.id} value={sub?.id}>{sub?.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="sidebarItemFilter">
                  <div className="catalog__new__input">
                    <label>
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
                      />
                      <input
                        type="number"
                        name="price_to"
                        className="form-control"
                        placeholder="Max"
                        readOnly
                        value={selectedMaxPrice}
                        onChange={handleChangeFilterInputs}
                      />
                    </div>
                    <input
                      type="range"
                      name='price_to'
                      className={`price-slider`}
                      min={minPrice}
                      max={maxPrice + 1}
                      value={selectedMaxPrice}
                      onChange={handleChangeFilterInputs}
                      onMouseUp={handleMouseUpOnRange}
                    />
                  </div>
                </div>
                <div className="sidebarItemFilter">
                  <button className='clearFilterBtn' onClick={()=>{
                      setFilterationObj({
                        company: '',
                        title: '',
                        sorting: '',
                        category: '',
                        sub_category: '',
                        price_from: '',
                        price_to: ''
                      });
                      scrollToTop(500);
                      navigate('/shop');
                      window.location.reload();
                    }}>
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
                      <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 my-2 d-flex justify-content-center">
                        <ProductCard getCurrentProducts={search ? filterProducts : getCurrentProducts} product={el} itemType={'product'} token={token} prodSlug={el?.slug} productCurrancy={el?.currency_symbol} productImage={el?.productImages[0]?.image} productName={el?.title} productPrice={el?.price} companyName={el?.company_name} />
                      </div>
                    )
                  })
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
