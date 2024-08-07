import React, { useEffect, useState } from 'react'
import './singleCompanyQuote.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import LastMinuteCard from '../../components/lastMinuteCardSec/LastMinuteCard';
import CartProduct from '../../components/cartProductSec/CartProduct';
import DestinationForm from '../../components/destinationFormSec/DestinationForm';
import { baseURL } from '../../functions/baseUrl';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';


export default function SingleCompanyQuote({ token, countries }) {
    const { companyName } = useParams();
    const [customizationCondition, setCustomizationCondition] = useState(null);
    const [requestIntries, setRequestIntries] = useState({ type: '', category_id: '', sub_category_id: '', title: '' });
    const [currentSubCategories, setCurrentSubCategories] = useState([]);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [currentProd, setCurrentProd] = useState([]);
    const [cart, setCart] = useState([]);
    const [loadingCart, setloadingCart] = useState(true);
    const [loadingSubmit, setloadingSubmit] = useState(false);
    const [errorCart, setErrorCart] = useState(null);
    const typesOfQuotations = [
        { id: 1, name: 'catalog' }, { id: 2, name: 'service' }
    ];
    const loginType = localStorage.getItem(`loginType`);
    const [customProduct, setCustomProduct] = useState({
        type: '',
        title: '',
        quantity: 0,
        description: '',
        image: ''
    });
    const companyIdWantedToHaveQuoteWith = Cookies.get('currentCompanyRequestedQuote');
    const [distinationData, setDistinationData] = useState({
        include_shipping: false,
        include_insurance: false,
        country_id: '',
        city_id: '',
        area_id: '',
        type: requestIntries?.type ? requestIntries?.type : customProduct?.type,
        address: '',
    });

    // getting Cart Between CurrentUserLoginned and CompanyWantedToSendQuotationFor
    useEffect(() => {
        if (token && loginType && companyIdWantedToHaveQuoteWith) {
            setloadingCart(true);
            (async () => {
                try {
                    const response = await fetch(`${baseURL}/${loginType}/prepare-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    };
                    const result = await response.json();
                    setCart(result?.data?.cart);
                    setCustomizationCondition(result?.data?.company_customization);
                } catch (err) {
                    setErrorCart(err.message);
                }
                setloadingCart(false);
            })();
        };
    }, []);

    // getSubCategories Using MainCategoryId Chosen
    const handleGettingCurrentSubCategories = (event) => {
        const currentCategoryChosed = currentCategories?.find(cat => +cat?.id === +event?.target?.value);
        if (currentCategoryChosed) {
            setRequestIntries({ ...requestIntries, category_id: event?.target?.value });
            setCurrentSubCategories(currentCategoryChosed?.subCategories);
        };
    };

    useEffect(() => {
        if (token && loginType && companyIdWantedToHaveQuoteWith && requestIntries?.type) {
            setDistinationData({ ...distinationData, type: requestIntries?.type })
            if (requestIntries?.title.length === 0 || requestIntries?.title.length >= 3) {
                setloadingCart(true);
                (async () => {
                    const toastId = toast.loading('Loading...');
                    try {
                        const response = await fetch(`${baseURL}/${loginType}/filter-to-make-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${token}`
                                },
                                body: JSON.stringify(requestIntries),
                            },
                        );
                        const result = await response.json();
                        if (result?.status === 200) {
                            setCurrentCategories(result?.data?.categories);
                            setCurrentProd(result?.data?.catalogs || result?.data?.services);
                            toast.success(result?.message || 'Loaded Successfully', {
                                id: toastId,
                                duration: 1000,
                            });
                        } else {
                            throw new Error(result?.errors?.type[0] || result?.message || 'Network response was not ok');
                        }
                    } catch (err) {
                        toast.error(`${err}`, {
                            id: toastId,
                            duration: 1000,
                        });
                    };
                })();
                setloadingCart(false);
            }
        } else if (!requestIntries?.type && currentProd.length > 0) {
            setCurrentProd([]);
        };
    }, [requestIntries]);

    const handleResetCurrentQuotation = () => {
        (async () => {
            setloadingCart(true);
            setRequestIntries({ type: '', category_id: '', sub_category_id: '', title: '' });
            const toastId = toast.loading('Loading...');
            const res = await fetch(`${baseURL}/${loginType}/reset-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`
                , {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
            const response = await res.json();
            if (response.status === 200) {
                setCart(response?.data?.data?.cart);
                toast.success(`${response?.message || 'Receted Successfully!'}`, {
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(`${response?.message || 'Error!'}`, {
                    id: toastId,
                    duration: 1000
                });
            }
            setloadingCart(false);
        })();
    };

    // add product to selected products
    const handleAddProduct = (product) => {
        const addedProduct = {
            type: requestIntries?.type,
            item_id: `${product?.id}`
        };
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/${loginType}/add-to-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                addedProduct
                , {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    setCart(response?.data?.data?.cart);
                    console.log(response?.data?.data);

                    toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(error => {
                    toast.error(`${error?.response?.data?.message || 'Error!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
        })();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        (async () => {
            setloadingSubmit(true);
            const data = {
                ...distinationData
                , include_shipping: distinationData?.include_shipping ? 'yes' : 'no'
                , include_insurance: distinationData?.include_insurance ? 'yes' : 'no',
            };
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/${loginType}/make-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                data, {
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    setDistinationData({
                        include_shipping: false,
                        include_insurance: false,
                        country_id: '',
                        city_id: '',
                        area_id: '',
                        type: requestIntries?.type ? requestIntries?.type : customProduct?.type,
                        address: '',
                    });
                    setCart([]);
                    toast.success(`${response?.data?.message || 'Sent Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(error => {
                    toast.error(`${error?.response?.data?.message || 'Error!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                });
            setloadingSubmit(false);
        })();
    };

    const handleCheckboxChange = (e) => {
        setDistinationData({ ...distinationData, [e.target.name]: e.target.checked });
    };

    const handleCustomProductChange = (e) => {
        const { name, value } = e.target;
        setCustomProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleCustomProductChangeImage = (e) => {
        const files = e.target.files;
        setCustomProduct((prevState) => ({
            ...prevState,
            file: files,
        }));
    };

    const handleAddCustomProduct = () => {
        const formData = new FormData();
        Object.keys(customProduct).forEach((key) => {
            if (key !== 'file') {
                formData.append(key, customProduct[key]);
            } else if (key === 'file' && !Array.isArray(customProduct[key])) {
                formData.append('logo', customProduct.file[0]);
            } else if (Array.isArray(customProduct[key]) && key === 'file') {
                customProduct[key].forEach((file, index) => {
                    formData.append(`file[${index}]`, file[0]);
                });
            }
        });
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/${loginType}/add-cutomized-item-for-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                formData
                , {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    setCart(response?.data?.data?.cart);
                    toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(error => {
                    toast.error(`${error?.response?.data?.message || error?.message || 'Error!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                });
        })();
    };

    return (
        <div className='singleCompanyQuote__handler'>
            <MyMainHeroSec
                heroSecContainerType='singleCompany__quote'
                headText='Request an official Quote'
                paraPartOne='Save  thousands to millions of bucks by using tool great skills, be a cool React Developer'
            />
            <>
                <div className="singleCompanyQuote__contents">
                    <div className="container">
                        <div className="singleCompanyQuote__headText">
                            <h1>
                                Quote from <span>{companyName}</span>
                            </h1>
                            <p>
                                Request a Detailed {companyName} Quote
                            </p>
                        </div>
                        <div className="singleCompanyQuote__mainFrom">
                            <form action="" onSubmit={handleFormSubmit} className='row'>
                                <div className="col-12 d-flex justify-content-end align-items-center mb-5">
                                    <span onClick={handleResetCurrentQuotation} className='deleteRuleBtn mt-3 me-5'>Reset Quote</span>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="qoutationSelectTheType">
                                                    Request Type
                                                </label>
                                                <select
                                                    className='form-select'
                                                    id="qoutationSelectTheType"
                                                    value={requestIntries?.type}
                                                    onChange={(event) => {
                                                        setRequestIntries({ ...requestIntries, type: event?.target?.value })
                                                    }}
                                                >
                                                    <option value={''} disabled>Select Type</option>
                                                    {
                                                        typesOfQuotations?.map(type => (
                                                            <option className='text-capitalize' value={type?.name} key={type?.id}>
                                                                {type?.name}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className="col-lg-6">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="quotationSelectMainCategory">
                                            Category
                                        </label>
                                        <select
                                            className='form-select'
                                            id="quotationSelectMainCategory"
                                            value={requestIntries?.category_id}
                                            onChange={handleGettingCurrentSubCategories}
                                        >
                                            <option value={''} disabled>Select Category</option>
                                            {currentCategories?.map(cat => (
                                                <option
                                                    value={cat?.id}
                                                    key={cat?.id}
                                                >{cat?.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="qouteSelectSubCategory">
                                            Sub-category
                                        </label>
                                        <select
                                            value={requestIntries?.sub_category_id}
                                            className='form-select'
                                            id="qouteSelectSubCategory"
                                            onChange={(event) => {
                                                setRequestIntries({ ...requestIntries, sub_category_id: event?.target?.value })
                                            }}
                                        >
                                            <option value="" disabled>Select Sub-Category</option>
                                            {
                                                currentSubCategories?.map(subCat => (
                                                    <option value={subCat?.id} key={subCat?.id}>{subCat?.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="singleQuote__searchInput">
                                                <h3>
                                                    Want to add more products?
                                                </h3>
                                                <input className='form-control' type="text" placeholder='Search here' value={requestIntries?.title} onChange={(event) => setRequestIntries({ ...requestIntries, title: event?.target?.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    {
                                        loadingCart ?
                                            <div className="permissionsLoader"></div>
                                            :
                                            <div className="singleQuote__slideProducts ">
                                                <Swiper
                                                    className='mySwiper'
                                                    modules={[Autoplay]}
                                                    autoplay={{
                                                        delay: 2500,
                                                        pauseOnMouseEnter: true,
                                                        disableOnInteraction: false
                                                    }}
                                                    breakpoints={{
                                                        300: {
                                                            slidesPerView: 1.1,
                                                            spaceBetween: 10
                                                        },
                                                        426: {
                                                            slidesPerView: 1.2,
                                                            spaceBetween: 20
                                                        },
                                                        600: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        768: {
                                                            slidesPerView: 2.2,
                                                            spaceBetween: 15
                                                        },
                                                        995: {
                                                            slidesPerView: 3.2,
                                                            spaceBetween: 20
                                                        },
                                                    }}
                                                >
                                                    {currentProd?.map((el) => {
                                                        const isAdded = cart?.some((selectedProduct) => +selectedProduct.item.id === +el?.id);
                                                        return (
                                                            <SwiperSlide className=' my-3' key={el?.id}>
                                                                <LastMinuteCard
                                                                    productImage={el?.image ? el?.image : el?.media[0]}
                                                                    productName={el?.title}
                                                                    dealQuantity={el?.dealQuantity}
                                                                    showCustomContent={true}
                                                                    buttonLabel={isAdded ? "Added" : "Add"}
                                                                    onAddClick={() => handleAddProduct(el)}
                                                                    borderColor={isAdded ? 'rgba(7, 82, 154, 1)' : 'rgba(0, 0, 0, 0.5)'}
                                                                />
                                                            </SwiperSlide>
                                                        )
                                                    })}
                                                </Swiper>
                                            </div>
                                    }
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="selectedProducts__handler">
                                                <h3>
                                                    Selected Products
                                                </h3>
                                                {(cart?.length === 0) ? (
                                                    <p>No products selected</p>
                                                ) : (
                                                    cart?.map((el) => (
                                                        <CartProduct
                                                            key={el?.item?.quotation_cart_id}
                                                            title={el?.item?.title}
                                                            description={el?.item?.description}
                                                            notes={el?.item.notes}
                                                            imageSrc={el?.item?.image ? el?.item?.image : el?.item?.medias[0]?.media}
                                                            showImage={el?.item?.image ? !!el?.item?.image : !!el?.item?.medias[0]?.media}
                                                            quantity={el?.quantity}
                                                            cartId={el?.quotation_cart_id}
                                                            companyIdWantedToHaveQuoteWith={companyIdWantedToHaveQuoteWith}
                                                            token={token}
                                                            setCart={setCart}
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    customizationCondition &&
                                    <div className="col-12">
                                        <div className="customizationQuote__handler">
                                            <h3>
                                                <span>{companyName}</span> Offers Customization
                                            </h3>
                                            <div className="customization__form row">
                                                <div className="col-lg-6">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="customProductTitle">
                                                            Title
                                                        </label>
                                                        <input
                                                            id="customProductTitle"
                                                            name="title"
                                                            className='form-control'
                                                            type="text"
                                                            placeholder='L-Shape Sofa-Grey'
                                                            value={customProduct?.title}
                                                            onChange={handleCustomProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="customProductQuantity">
                                                            Quantity
                                                        </label>
                                                        <input
                                                            id="customProductQuantity"
                                                            name="quantity"
                                                            className='form-control'
                                                            type="number"
                                                            placeholder='5'
                                                            value={customProduct?.quantity}
                                                            onChange={handleCustomProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="customProductType">
                                                            Add Type
                                                        </label>
                                                        <select
                                                            id="customProductType"
                                                            name="type"
                                                            className='form-select'
                                                            value={customProduct?.type}
                                                            onChange={handleCustomProductChange}
                                                        >
                                                            <option value="" disabled>Select Type</option>
                                                            {
                                                                typesOfQuotations?.map(type => (
                                                                    <option className='text-capitalize' value={type?.name} key={type?.id}>
                                                                        {type?.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="customProductDescription">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            id="customProductDescription"
                                                            name="description"
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder='The L-shaped sofa is the relax version of the long sofa. Its main feature is the extended terminal seat, which can be placed on the left or right side, on the basis of the living room design and the personal needs.'
                                                            value={customProduct?.description}
                                                            onChange={handleCustomProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6"
                                                >
                                                    <div className="customizationQuote__actions">
                                                        <label htmlFor="customProductImageBtn" className='addedButtonStyle'>
                                                            Add Files
                                                        </label>
                                                        <input
                                                            type='file'
                                                            id='customProductImageBtn'
                                                            multiple
                                                            onChange={handleCustomProductChangeImage}
                                                            className={`d-none`}
                                                        />
                                                        <span className='pageMainBtnStyle' onClick={handleAddCustomProduct}>
                                                            Add to Quotation
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="col-12">
                                    <div className="quotaionCheckInputs__handler mt-5">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                name={'include_shipping'}
                                                checked={distinationData?.include_shipping}
                                                onChange={handleCheckboxChange}
                                                id="flexCheckDefault" />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Include Shipping
                                            </label>
                                        </div>
                                        {
                                            distinationData?.include_shipping &&
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name={'include_insurance'}
                                                    checked={distinationData?.include_insurance}
                                                    onChange={handleCheckboxChange}
                                                    id="flexCheckDefault2" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                    Include Insurance
                                                </label>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {distinationData?.include_shipping && (
                                    <div className="col-12">
                                        <DestinationForm countries={countries} distinationData={distinationData} setDistinationData={setDistinationData} />
                                    </div>
                                )}
                                <div className="col-12">
                                    <button type='submit' disabled={loadingSubmit} className='addedButtonStyle btnSubmitQuote mt-5'>
                                        Submit quotation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}