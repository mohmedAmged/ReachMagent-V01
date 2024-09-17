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
import MyLoader from '../myLoaderSec/MyLoader';

export default function ShopProducts({ token, fetchCartItems, wishlistItems }) {
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const sortingTypes = [{
    id: 1,
    name: 'Latest First',
    value: 'desc'
  }, {
    id: 2,
    name: 'Earliest First',
    value: 'asc',
  }];
  const [companiesAllowed, setCompaniesAllowed] = useState([]);
  const [categoriesAllowed, setCategoriesAllowed] = useState([]);
  const [subCategoriesAllowed, setSubCategoriesAllowed] = useState([]);
  const [filterationObj, setFilterationObj] = useState({
    company: '',
    title: '',
    sorting: '',
    category: '',
    sub_category: '',
    price_from: '',
    price_to: '',
  });
  const [slugURLObj, setSlugURLObj] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (search) {
      const newFilterGettedFromURL = reverseSlugToObj(search.slice(1));
      setFilterationObj({ ...filterationObj, ...newFilterGettedFromURL });
    };
  }, []);

  const getCurrentAllowedCountriesAndCategories = async () => {
    setLoading(true);
    await axios.get(`${baseURL}/user/allowed-companies?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCompaniesAllowed(response?.data?.data?.allowed_companies);
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
          duration: 1000,
        });
      });

    await axios.get(`${baseURL}/user/allowed-categories?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCategoriesAllowed(response?.data?.data?.allowed_categories);
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
          duration: 1000,
        });
      });
    setLoading(false);
  };

  const changeFilterToSlug = (obj) => {
    let slugifiedObj = ``;
    for (const [key, value] of Object.entries(obj)) {
      const slugifiedKey = slugifyFilteration(key);
      const slugifiedValue = slugifyFilteration(value);
      if (slugifiedValue) {
        slugifiedObj += `${slugifiedKey}=${slugifiedValue}&`;
      };
    };
    setSlugURLObj(slugifiedObj.slice(0, -1));
  };

  useEffect(() => {
    changeFilterToSlug(filterationObj);
    if (slugURLObj) {
      const filterParams = new URLSearchParams(filterationObj);
      const slugWithoutEmptyVlaues = clearEmptyQueryValues(filterParams.toString());
      navigate(`/shop?${slugWithoutEmptyVlaues}`);
    };
  }, [filterationObj, slugURLObj]);

  const getCurrentProducts = async () => {
    setLoadingProducts(true);
    await axios.get(`${baseURL}/user/products`, {
      params: {
        t: new Date().getTime(),
        page: currentPage,
        limit: 12,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!search) {
          setProducts(response?.data?.data?.products?.products);
          setTotalPages(response?.data?.data?.total_pages || 1);
        }
        setMaxPrice(+response?.data?.data?.max_price);
        setMinPrice(+response?.data?.data?.min_price);
        setSelectedMaxPrice(+response?.data?.data?.max_price);
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
          duration: 1000,
        });
      });
    setLoadingProducts(false);
  };

  useEffect(() => {
    getCurrentProducts();
    getCurrentAllowedCountriesAndCategories();
  }, []);

  const filterProducts = async () => {
    setLoadingProducts(true);
    if (slugURLObj) {
      await axios.get(`${baseURL}/user/filter-products`, {
        params: {
          t: new Date().getTime(),
          company: filterationObj?.company,
          category: filterationObj?.category,
          sub_category: filterationObj?.sub_category,
          price_from: filterationObj?.price_from,
          price_to: filterationObj?.price_to,
          title: filterationObj?.title,
          sorting: filterationObj?.sorting,
          page: currentPage,
          limit: 12,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const currProducts = response?.data?.data?.products;
          setProducts(currProducts);
          setTotalPages(response?.data?.data?.total_pages || 1);
        })
        .catch(error => {
          toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
            duration: 1000,
          });
        });
    }
    setLoadingProducts(false);
  };

  useEffect(() => {
    filterProducts();
  }, [slugURLObj, filterationObj]);

  const handleChangeFilterInputs = (e) => {
    if (e.target.name === 'category') {
      setFilterationObj({ ...filterationObj, [e?.target?.name]: e.target.value, sub_category: '' });
      setLoadingProducts(true);
      (async () => {
        await axios.get(`${baseURL}/user/show-allowed-category/${e?.target?.value}?t=${new Date().getTime()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            setSubCategoriesAllowed(response?.data?.data?.allowed_category?.subCategories);
          })
          .catch(error => {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
              duration: 1000,
            });
          });
      })();
    } else if (!(e.target.name === 'price_to')) {
      setFilterationObj({ ...filterationObj, [e?.target?.name]: e.target.value });
      if (e.target.name === 'title' && e.target.value === '') {
        setFilterationObj({
          company: '',
          title: '',
          sorting: '',
          category: '',
          sub_category: '',
          price_from: '',
          price_to: ''
        });
        navigate('/shop');
        window.location.reload();
      };
    } else {
      const value = Number(e.target.value);
      if (value >= minPrice && value <= maxPrice + 10) {
        setSelectedMaxPrice(value);
      };
    };
    setSlugURLObj('');
    setLoadingProducts(false);
  };

  const handleMouseUpOnRange = (e) => {
    setFilterationObj({ ...filterationObj, [e.target.name]: `${e.target.value}`, price_from: `${minPrice}` });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToTop(500);
    };
  };

  return (
    <>
      {
        loading ?
          <MyLoader />
          :
          <>
            <MyMainHeroSec
              heroSecContainerType='shopHeroSec__container'
              headText='Ready To Buy Products'
              paraPartOne='Dive into thousands of products ready to buy today'
              paraPartTwo='in your region, from a needle to whatever you need'
              categoryArr={companiesAllowed}
              currentCompanyChosen={filterationObj?.company}
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
                              sortingTypes?.map(sort => (
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
                            defaultValue={filterationObj?.company}
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
                              categoriesAllowed?.map(cat => (
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
                              subCategoriesAllowed?.map(sub => (
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
                        <button className='clearFilterBtn' onClick={() => {
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
                    {loadingProducts ?
                      <div className="permissionsLoader"></div>
                      :
                      <div className="row">
                        {
                          products?.map((el) => {
                            return (
                              <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 my-2 d-flex justify-content-center">
                                <ProductCard fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} discountPrice={el?.discountPrice} getCurrentProducts={search ? filterProducts : getCurrentProducts} product={el} itemType={'product'} token={token} prodSlug={el?.slug} productCurrancy={el?.currency_symbol} productImage={el?.productImages[0]?.image} productName={el?.title} productPrice={el?.price} companyName={el?.company_name} />
                              </div>
                            )
                          })
                        }
                      </div>
                    }
                    {
                      totalPages > 1 &&
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                          type="button"
                          className="paginationBtn me-2"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <i className="bi bi-caret-left-fill"></i>
                        </button>
                        <span className='currentPagePagination'>{currentPage}</span>
                        <button
                          type="button"
                          className="paginationBtn ms-2"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <i className="bi bi-caret-right-fill"></i>
                        </button>
                      </div>
                    }
                  </div>

                </div>
              </div>
            </div>
          </>
      }
    </>
  );
};
