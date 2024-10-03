import React, { useEffect, useState } from 'react';
import './singleCompanyQuote.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
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
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function SingleCompanyQuote({ token, countries }) {
    const [loading, setLoading] = useState(true);
    const { companyName } = useParams();
    const [customizationCondition, setCustomizationCondition] = useState(null);
    const [requestIntries, setRequestIntries] = useState({ type: '', category_id: '', sub_category_id: '', title: '' });
    const [currentSubCategories, setCurrentSubCategories] = useState([]);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [currentProd, setCurrentProd] = useState([]);
    const [cart, setCart] = useState([]);
    const [loadingCart, setloadingCart] = useState(true);
    const [loadingSubmit, setloadingSubmit] = useState(false);
    const typesOfQuotations = [
        { id: 1, name: 'catalog' }, { id: 2, name: 'service' }
    ];
    const loginType = localStorage.getItem(`loginType`);
    const [customProduct, setCustomProduct] = useState({
        type: '',
        title: '',
        quantity: '',
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
        po_box: '',
        postal_code: '',
        user_notes: '',
        request_by_notes: ''
    });

    // getting Cart Between CurrentUserLoginned and CompanyWantedToSendQuotationFor
    useEffect(() => {
        if (token && loginType && companyIdWantedToHaveQuoteWith) {
            setloadingCart(true);
            (async () => {
                    await axios.get(`${baseURL}/user/prepare-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    }).then(res => {
                        setCart(res?.data?.data?.cart);
                        setCurrentProd(res?.data?.data?.data);
                        setCustomizationCondition(res?.data?.data?.company_customization);
                    }).catch(err => {
                        toast.error(err.message);
                    })
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
            setCustomProduct({ ...customProduct, type: requestIntries?.type });
            setDistinationData({ ...distinationData, type: requestIntries?.type });
            if (requestIntries?.title.length === 0 || requestIntries?.title.length >= 3) {
                setloadingCart(true);
                (async () => {
                    const toastId = toast.loading('Loading...');
                    await axios.post(`${baseURL}/user/filter-to-make-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                            requestIntries,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${token}`
                                },
                            },
                        ).then(res => {
                            setCurrentCategories(res?.data?.categories);
                            setCurrentProd(res?.data?.catalogs || res?.data?.services);
                            toast.success(res?.message || 'Loaded Successfully', {
                                id: toastId,
                                duration: 1000,
                            });
                        }).catch((err) => {
                            toast.error(`${err.response?.data?.message}`, {
                                id: toastId,
                                duration: 1000,
                            });
                        });
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
            const res = await fetch(`${baseURL}/user/reset-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`
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
            type: product?.type,
            item_id: `${product?.id}`
        };
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/user/add-to-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
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
            await axios.post(`${baseURL}/user/make-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
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
            await axios.post(`${baseURL}/user/add-cutomized-item-for-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
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
                    setCustomProduct({
                        type: '',
                        title: '',
                        quantity: '',
                        description: '',
                        image: ''
                    });
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

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
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
                        Get a Quote from <span>{companyName}</span>
                    </h1>
                </div>
                <div className="singleCompanyQuote__mainFrom">
                    <form action="" onSubmit={handleFormSubmit} className='row'>
                        <div className="col-12 d-flex justify-content-end align-items-center mb-5">
                            <span onClick={handleResetCurrentQuotation} className='deleteRuleBtn mt-3 me-5'>Reset Quote</span>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 singleQuote__searchInput">
                                    <h3>
                                        Filter Items By
                                    </h3>
                                </div>
                                <div className="col-lg-4">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="qoutationSelectTheType">
                                            Type
                                        </label>
                                        <select
                                            className='form-select w-100'
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
                                <div className="col-lg-4">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="quotationSelectMainCategory">
                                            Category
                                        </label>
                                        <select
                                            className='form-select w-100'
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
                                <div className="col-lg-4">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="qouteSelectSubCategory">
                                            Sub-category
                                        </label>
                                        <select
                                            value={requestIntries?.sub_category_id}
                                            className='form-select w-100'
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
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="singleQuote__searchInput">
                                        <h3 className='fs-4'>
                                            Or Search For a Specific Item
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
                                                            productImage={el?.image ? el?.image : el?.media[0].image ? el?.media[0].image : el.media[0]}
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
                                            cart?.map((el) => {
                                                return <CartProduct
                                                    key={el?.quotation_cart_id}
                                                    title={el?.item?.title}
                                                    description={el?.item?.description}
                                                    notes={el?.note}
                                                    imageSrc={el?.item?.image ? el?.item?.image : el?.item?.medias[0]?.media}
                                                    showImage={el?.item?.image ? !!el?.item?.image : !!el?.item?.medias[0]?.media}
                                                    quantity={el?.quantity}
                                                    cartId={el?.quotation_cart_id}
                                                    companyIdWantedToHaveQuoteWith={companyIdWantedToHaveQuoteWith}
                                                    token={token}
                                                    setCart={setCart}
                                                />
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            customizationCondition &&
                            <div className="col-12">
                                <div className="customizationQuote__handler">
                                    <h3 className='text-capitalize customizationHead'>
                                        Can’t find what you’re looking for?
                                        <br />
                                        <span>{companyName}</span> tailors solutions to fit your unique needs
                                    </h3>
                                    <div className="customization__form row">
                                        <div className="col-lg-7">
                                            <div className="singleQuoteInput">
                                            <label htmlFor="qoutationSelectTheType">
                                                Type
                                            </label>
                                            <select
                                                className='form-select w-100'
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
                                        <div className="col-lg-6">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="customProductTitle">
                                                    Title
                                                </label>
                                                <input
                                                    id="customProductTitle"
                                                    name="title"
                                                    className='form-control customizedInput'
                                                    type="text"
                                                    placeholder='Ex: L-Shape Sofa-Grey'
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
                                                    className='form-control customizedInput'
                                                    type="number"
                                                    placeholder='Ex: 0'
                                                    min={0}
                                                    value={customProduct?.quantity}
                                                    onChange={handleCustomProductChange}
                                                />
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
                                                    className="form-control customizedInput"
                                                    rows="3"
                                                    placeholder='Ex: The L-shaped sofa is the relax version of the long sofa. Its main feature is the extended terminal seat, which can be placed on the left or right side, on the basis of the living room design and the personal needs.'
                                                    value={customProduct?.description}
                                                    onChange={handleCustomProductChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="customizationQuote__actions singleQuoteInput">
                                                <label>UpLoad A Reference</label>
                                                <p className='fw-light mb-2'>It’s recommended to upload a photo or file as a reference for better clarity on your request</p>
                                                <input
                                                    type='file'
                                                    id='customProductImageBtn'
                                                    multiple
                                                    onChange={handleCustomProductChangeImage}
                                                    className={`form-control`}
                                                />
                                                <span className='pageMainBtnStyle addItemToQuoteBtn mt-4' onClick={handleAddCustomProduct}>
                                                    Add Item to Quotation
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
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name={'include_shipping'}
                                        checked={distinationData?.include_shipping}
                                        onChange={handleCheckboxChange}
                                        id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Include Shipping Cost In The Quotation
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
                                <DestinationForm isOneClickQuotation={false} countries={countries} distinationData={distinationData} setDistinationData={setDistinationData} />
                            </div>
                        )}

                        <div className="col-12">
                            <div className="customizationQuote__handler">
                                <h3 className='text-capitalize customizationHead'>

                                </h3>
                                <div className="customization__form row">
                                    <div className="col-lg-12">
                                        <div className="singleQuoteInput">
                                            <label htmlFor="quotationNote">
                                                Add Note To Quotation
                                            </label>
                                            <textarea
                                                id="quotationNote"
                                                name="request_by_notes"
                                                className="form-control customizedInput"
                                                rows="3"
                                                defaultValue={distinationData?.request_by_notes}
                                                placeholder='Ex: Add any notes or specific terms and conditions for your request in this section.'
                                                onChange={(e)=>{
                                                    setDistinationData({ ...distinationData, [e.target.name]: e.target.value })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            }
        </>
    );
};