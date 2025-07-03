import React, { useEffect, useRef, useState } from 'react';
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
import { GetAllCountriesStore } from '../../store/AllCountries';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function SingleCompanyQuote({ token }) {
    const [activeTooltip, setActiveTooltip] = useState(null);

    const toggleTooltip = (key) => {
    setActiveTooltip(prev => (prev === key ? null : key));
    };
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const { companyName } = useParams();
    const [companyId, setCompanyId] = useState(0)
    const [customizationCondition, setCustomizationCondition] = useState(null);
    const [requestIntries, setRequestIntries] = useState({ type: '', category_id: '', sub_category_id: '', title: '' });
    const [currentSubCategories, setCurrentSubCategories] = useState([]);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [perparedProd, setPreparedProd] = useState([]);
    const [currentProd, setCurrentProd] = useState([]);
    const [cart, setCart] = useState([]);
    const [loadingCart, setloadingCart] = useState(true);
    const [loadingSubmit, setloadingSubmit] = useState(false);
    const [currCurrency, setCurrCurrency] = useState('');
    const [companyCurrency, setCompanyCurrency] = useState('')
    const fileInputRef = useRef(null);
    const [showOption, setShowOption] = useState(false);
    const [activeOptionCard, setActiveOptionCard] = useState(null);
    // const handleCloseOption = () => setShowOption(false);
    // const handleShowOption = () => setShowOption(true);
    const handleShowOption = (el) => setActiveOptionCard(el?.id);
    const handleCloseOption = () => setActiveOptionCard(null);

    const typesOfQuotations = [
        { id: 1, name: 'catalog', renderName:`${t('SingleQuotePage.renderTypeCatalogName')}` },
         { id: 2, name: 'service', renderName:`${t('SingleQuotePage.renderTypeServiceName')}` }
    ];
    const loginType = localStorage.getItem(`loginType`);
    const [customProduct, setCustomProduct] = useState({
        type: '',
        title: '',
        quantity: '',
        description: '',
        file: []
    });
    const companyIdWantedToHaveQuoteWith = Cookies.get('currentCompanyRequestedQuote');
    const [selectedPreferences, setSelectedPreferences] = useState({});

    
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
        request_by_notes: '',
        longitude: '',
        latitude: '', 
        currency: '', 
    });

    const handleCurrencyChange = (event) => {
        const selectedCurrency = event.target.value;
        setCurrCurrency(selectedCurrency); // Update state
        setDistinationData((prevData) => ({
            ...prevData,
            currency: selectedCurrency, // Update currency in the data object
        }));
    };

    const countries = GetAllCountriesStore((state) => state.countries);

    useEffect(() => {
        if (token && loginType && companyIdWantedToHaveQuoteWith && requestIntries?.type) {
            setCurrentProd([]);
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
        } else if (token && loginType && companyIdWantedToHaveQuoteWith) {
            setCurrentProd([])
            setloadingCart(true);
            (async () => {
                await axios.get(`${baseURL}/user/prepare-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        "Locale": Lang
                    },
                }).then(res => {
                    setCart(res?.data?.data?.cart);
                    setCurrentProd(res?.data?.data?.data);
                    setCustomizationCondition(res?.data?.data?.company_customization);
                    setCompanyCurrency(res?.data?.data?.local_currency);
                    
                }).catch(err => {
                    toast.error(err.message);
                })
                setloadingCart(false);
            })();
        };
    }, [companyIdWantedToHaveQuoteWith, loginType, token, requestIntries]);

    const handleGettingCurrentSubCategories = (event) => {
        const currentCategoryChosed = currentCategories?.find(cat => +cat?.id === +event?.target?.value);
        if (currentCategoryChosed) {
            setRequestIntries({ ...requestIntries, category_id: event?.target?.value });
            setCurrentSubCategories(currentCategoryChosed?.subCategories);
        };
    };

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
                setDistinationData({
                    include_shipping: false,
                    include_insurance: false,
                    country_id: '',
                    city_id: '',
                    area_id: '',
                    type: requestIntries?.type ? requestIntries?.type : customProduct?.type,
                    address: '',
                    longitude: '',
                    latitude: '',
                    currency: '',
                    request_by_notes:'' 
                });
                setCurrCurrency('')
                console.log(distinationData);
            } else {
                toast.error(`${response?.message || 'Error!'}`, {
                    id: toastId,
                    duration: 1000
                });
            }
            setloadingCart(false);
        })();
    };

    const handleAddProduct = (product) => {
        const selectedIds = Object.values(selectedPreferences);

        const addedProduct = {
            type: requestIntries?.type || product?.type,
            item_id: `${product?.id}`,
            preferences: selectedIds 
        };

        (async () => {
            const toastId = toast.loading('Loading...');
            try {
            const response = await axios.post(
                `${baseURL}/user/add-to-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                addedProduct,
                {
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                }
                }
            );
            setCart(response?.data?.data?.cart);
             setSelectedPreferences({});
            toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                id: toastId,
                duration: 1000
            });
            console.log(selectedIds);
            
            } catch (error) {
                const backendErrors = error?.response?.data?.errors;
                const preferenceError = backendErrors?.preferences?.[0];
                 if (preferenceError) {
                    // Open modal for this product
                    setActiveOptionCard(product.id);
                }
                toast.error(preferenceError || error?.response?.data?.message || 'Error!', {
                    duration: 5000,
                    id: toastId,
                });
            }
    })();
    };

    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        (async () => {
            setloadingSubmit(true);
    
            const data = {
                ...distinationData,
                include_shipping: distinationData?.include_shipping ? 'yes' : 'no',
                include_insurance: distinationData?.include_insurance ? 'yes' : 'no',
            };
    
            const toastId = toast.loading('Loading...');
    
            await axios.post(
                `${baseURL}/user/make-quotation/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                data,
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                setDistinationData({
                    include_shipping: false,
                    include_insurance: false,
                    country_id: '',
                    city_id: '',
                    area_id: '',
                    type: requestIntries?.type ? requestIntries?.type : customProduct?.type,
                    address: '',
                    longitude: '',
                    latitude: '',
                    currency: '',
                });
    
                setCart([]);
                setCurrCurrency('');
    
                toast.success(`${response?.data?.message || 'Sent Successfully!'}`, {
                    id: toastId,
                    duration: 1000
                });
    
                console.log(distinationData);
            })
            .catch(error => {
                const res = error?.response;
                let message = 'Error!';
    
                if (res?.status === 422 && res?.data?.errors) {
                    const errors = res.data.errors;
                    if (
                        errors?.include_shipping &&
                        errors.include_shipping.includes("Cannot Request Quotaiton Include Shipping")
                    ) {
                        message = "Request for quotation related to services (only) cannot include shipping";
                    } else {
                        message = Object.values(errors).flat().join('\n');
                    }
    
                } else if (res?.data?.message) {
                    message = res.data.message;
                }
    
                toast.error(message, {
                    id: toastId,
                    duration: 7000
                });
    
                console.log(distinationData);
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
        const maxFileSize = 5 * 1024 * 1024;
        const maxFileCount = 3;
        const files = Array.from(e.target.files);

        setCustomProduct((prevState) => {
            if (files?.length >= maxFileCount) {
                toast.error('Maximum file count reached. Please remove some files before adding more.',
                    { duration: 4000 });
                return prevState;
            }
            files.forEach((file) => {
                if (file.size >= maxFileSize) {
                    toast.error('Files must not exceed 5MB', { duration: 4000 })

                }
            });
            return {
                ...prevState,
                file: files,
            };
        });
    };

    const handleAddCustomProduct = () => {
        const formData = new FormData();
        Object.keys(customProduct).forEach((key) => {
            if (key !== 'file') {
                formData.append(key, customProduct[key]);
            } else if (Array.isArray(customProduct[key]) && key === 'file') {
                customProduct[key].forEach((file, index) => {
                    formData.append(`file[${index}]`, file);
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
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                .then((response) => {
                    setCart(response?.data?.data?.cart);
                    setCustomProduct({
                        type: '',
                        title: '',
                        quantity: '',
                        description: '',
                        file: []
                    });
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch((err) => {
                    Object.keys(err?.response?.data?.errors).forEach((field) => {
                        err?.response?.data?.errors[field]?.forEach((message) => {
                            toast.error(message, {
                                duration: 2000,
                                id: toastId,
                            });
                        });
                    });
                });
        })();
    };


    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, [loading]);
console.log(currentProd);
// const hasNoCatalog = cart?.some(item => item.item.type === 'catalog');
console.log(cart);

    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='singleCompanyQuote__handler'>
                        <MyMainHeroSec
                            heroSecContainerType='singleCompany__quote'
                            headText={t('SingleQuotePage.heroSecHeader')}
                            paraPartOne={t('SingleQuotePage.heroSecSubHeader')}
                        />
                        <>
                <div className="singleCompanyQuote__contents">
                    <div className="container">
                        <div className="singleCompanyQuote__headText">
                            <h1>
                                {t('SingleQuotePage.pageMainHeader')} <span>{companyName}</span>
                            </h1>
                        </div>
                        <div className="singleCompanyQuote__mainFrom">
                            <form action="" onSubmit={handleFormSubmit} className='row'>
                                <div className="col-12 d-flex justify-content-end align-items-center mb-5">
                                    <span onClick={handleResetCurrentQuotation} className='deleteRuleBtn mt-3 me-5'>{t('SingleQuotePage.resetQuoteBtn')}</span>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 singleQuote__searchInput">
                                            <h3>
                                                {t('SingleQuotePage.quoteFilterTit')}
                                            </h3>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="qoutationSelectTheType" className='position-relative'>
                                                    {t('SingleQuotePage.quoteFilteInputType')}
                                                    <i title={t('SingleQuotePage.quoteFilteInputTypeTit')} 
                                                     onClick={() => toggleTooltip('typeFirst')}className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                    {activeTooltip === 'typeFirst' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteFilteInputTypeTit')} 
                                                    </div>
                                                    )}
                                                </label>
                                                <select
                                                    className={`form-select w-100 ${Lang === "ar" ? "formSelect_RTL" : ""}`}
                                                    id="qoutationSelectTheType"
                                                    value={requestIntries?.type}
                                                    onChange={(event) => {
                                                        setRequestIntries({ ...requestIntries, type: event?.target?.value })
                                                    }}
                                                >
                                                    <option value={''} disabled>{t('SingleQuotePage.quoteFilteInputTypePlaceholder')}</option>
                                                    {
                                                        typesOfQuotations?.map(type => (
                                                            <option className='text-capitalize' value={type?.name} key={type?.id}>
                                                                {type?.renderName}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="quotationSelectMainCategory"
                                                    className='position-relative'
                                                >
                                                    {t('SingleQuotePage.quoteFilteInputCategory')}
                                                    <i title={t('SingleQuotePage.quoteFilteInputCategoryTit')} onClick={() => toggleTooltip('categoryFirst')} className="bi bi-info-circle ms-2 cursorPointer" style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                    {activeTooltip === 'categoryFirst' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteFilteInputCategoryTit')}
                                                    </div>
                                                )}
                                                </label>
                                                <select
                                                    className={`form-select w-100 ${Lang === "ar" ? "formSelect_RTL" : ""}`}
                                                    id="quotationSelectMainCategory"
                                                    value={requestIntries?.category_id}
                                                    onChange={handleGettingCurrentSubCategories}
                                                >
                                                    <option value={''} disabled>{t('SingleQuotePage.quoteFilteInputCategoryPlaceholder')}</option>
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
                                                <label htmlFor="qouteSelectSubCategory"
                                                    className='position-relative'
                                                >
                                                    {t('SingleQuotePage.quoteFilteInputSubCategory')}
                                                    <i title={t('SingleQuotePage.quoteFilteInputSubCategoryTit')} onClick={() => toggleTooltip('subCategoryFirst')}  className="bi bi-info-circle ms-2 cursorPointer" style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                    {activeTooltip === 'subCategoryFirst' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteFilteInputSubCategoryTit')}
                                                    </div>
                                                )}
                                                </label>
                                                <select
                                                    value={requestIntries?.sub_category_id}
                                                    className={`form-select w-100 ${Lang === "ar" ? "formSelect_RTL" : ""}`}
                                                    id="qouteSelectSubCategory"
                                                    onChange={(event) => {
                                                        setRequestIntries({ ...requestIntries, sub_category_id: event?.target?.value })
                                                    }}
                                                >
                                                    <option value="" disabled>{t('SingleQuotePage.quoteFilteInputSubCategoryPlaceholder')}</option>
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
                                            <div className="singleQuote__searchInput mt-3">
                                                <h3 className='fs-4 position-relative'>
                                                    {t('SingleQuotePage.quoteFilteInputSearch')}
                                                    <i title={t('SingleQuotePage.quoteFilteInputSearchTit')} onClick={() => toggleTooltip('search')} className="bi bi-info-circle ms-2 cursorPointer" style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                    {activeTooltip === 'search' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteFilteInputSearchTit')}
                                                    </div>
                                                )}
                                                </h3>
                                                <input className='form-control' type="text" placeholder={t('SingleQuotePage.quoteFilteInputSearchPlaceholder')} value={requestIntries?.title} onChange={(event) => setRequestIntries({ ...requestIntries, title: event?.target?.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div  className="col-12">
                                    {
                                        loadingCart ?
                                            <div className="permissionsLoader"></div>
                                            :
                                            <div className="singleQuote__slideProducts ">
            <Swiper
                className='mySwiper'
                modules={[Autoplay]}
                // autoplay={{
                //     delay: 4500,
                //     pauseOnMouseEnter: true,
                //     disableOnInteraction: true
                // }}
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
                {
                    currentProd?.map((el) => {
                        const isAdded = cart?.some(
                            (selectedProduct) => selectedProduct.item.slug === el?.slug
                        );
                        return (
                            <SwiperSlide className="my-3 equal-slide" key={el?.id}>
                                <div className="card__wrapper_last">
                                    <LastMinuteCard
                                        productImage={
                                            el?.image
                                                ? el?.image
                                                : el?.media[0].image
                                                    ? el?.media[0].image
                                                    : el.media[0]
                                        }
                                        productName={el?.title}
                                        productLink={`/${companyIdWantedToHaveQuoteWith}/${el?.type === "catalog" ? "catalog-details" : "service-details"
                                            }/${el?.slug}`}
                                        dealQuantity={el?.dealQuantity}
                                        showCustomContent={true}
                                        buttonLabel={isAdded ? `${t('SelectedProducts.addedBtn')}` : `${t('SelectedProducts.addBtn')}`}
                                        onAddClick={() => handleAddProduct(el)}
                                        renderdublicate={isAdded ? true : false}
                                        renderOptionData={true}
                                        onDublicateItem={()=>handleAddProduct(el)}
                                        borderColor={
                                            isAdded ? "rgba(7, 82, 154, 1)" : "rgba(0, 0, 0, 0.5)"
                                        }
                                        data={el}
                                        setSelectedPreferences={setSelectedPreferences}
                                        selectedPreferences={selectedPreferences}
                                        setShowOption={setShowOption}
                                        showOption={activeOptionCard === el.id} 
                                        handleShowOption={() => handleShowOption(el)}
                                        handleCloseOption={handleCloseOption}
                                    />
                                </div>
                                
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
                                            </div>
                                    }
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="selectedProducts__handler">
                                                <h3>
                                                    {t('SingleQuotePage.quoteSelectedItemsHeader')}
                                                </h3>
                                                {(cart?.length === 0) ? (
                                                    <p>{t('SingleQuotePage.quoteNoSelectedItemsText')}</p>
                                                ) : (
                                                    cart?.map((el) => {
                                                        const hasImage = el?.item?.image || el?.item?.medias?.some((media) => media.type === 'image');
                                                        const hasFile = el?.item?.medias?.some((media) => media.type === 'file');
                                                        return <CartProduct
                                                            key={el?.quotation_cart_id}
                                                            title={el?.item?.title}
                                                            description={el?.item?.description}
                                                            notes={el?.note}
                                                            imageSrc={el?.item?.image || el?.item?.medias?.find((media) => media.type === 'image')?.media}
                                                            showImage={hasImage}
                                                            showFiles={hasFile}
                                                            fileList={el?.item?.medias?.filter((media) => media.type === 'file') || []}
                                                            quantity={el?.quantity}
                                                            cartId={el?.quotation_cart_id}
                                                            companyIdWantedToHaveQuoteWith={companyIdWantedToHaveQuoteWith}
                                                            token={token}
                                                            setCart={setCart}
                                                            options={el?.item?.options}
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
                                                {t('SingleQuotePage.quoteCustomizeProductHeader')}
                                                <br />
                                                <span>{companyName}</span> {t('SingleQuotePage.quoteCustomizeProductSubHeader')}
                                            </h3>
                                            <div className="customization__form row">
                                                <div className="col-lg-7">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="qoutationSelectTheType"
                                                            className='position-relative'
                                                        >
                                                            {t('SingleQuotePage.quoteFilteInputType')}
                                                            <i title={t('SingleQuotePage.quoteFilteInputTypeTit')} onClick={() => toggleTooltip('typeSecond')} className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                            {activeTooltip === 'typeSecond' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteFilteInputTypeTit')}
                                                    </div>
                                                )}
                                                        </label>
                                                        <select
                                                            className={`form-select w-100 ${Lang === "ar" ? "formSelect_RTL" : ""}`}
                                                            id="qoutationSelectTheType"
                                                            name='type'
                                                            value={customProduct?.type}
                                                            onChange={handleCustomProductChange}
                                                        >
                                                            <option value={''} disabled>{t('SingleQuotePage.quoteFilteInputTypePlaceholder')}</option>
                                                            {
                                                                typesOfQuotations?.map(type => (
                                                                    <option className='text-capitalize' value={type?.name} key={type?.id}>
                                                                        {type?.renderName}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="customProductTitle"
                                                            className='position-relative'
                                                        >
                                                            {t('SingleQuotePage.quoteCustomizeProductTilteInput')}
                                                            <i title={t('SingleQuotePage.quoteCustomizeProductTilteInputTit')} onClick={() => toggleTooltip('title')}  className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                            {activeTooltip === 'title' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteCustomizeProductTilteInputTit')}
                                                    </div>
                                                )}
                                                        </label>
                                                        <input
                                                            id="customProductTitle"
                                                            name="title"
                                                            className='form-control customizedInput'
                                                            type="text"
                                                            placeholder={t('SingleQuotePage.quoteCustomizeProductTilteInputOlaceholder')}
                                                            value={customProduct?.title}
                                                            onChange={handleCustomProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="singleQuoteInput">
                                                        <label htmlFor="customProductQuantity"
                                                            className='position-relative'
                                                        >
                                                            {t('SingleQuotePage.quoteCustomizeProductQuantityInput')}
                                                            <i title={t('SingleQuotePage.quoteCustomizeProductQuantityInputTit')} onClick={() => toggleTooltip('quantity')} className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                            {activeTooltip === 'quantity' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteCustomizeProductQuantityInputTit')}
                                                    </div>
                                                )}
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
                                                        <label htmlFor="customProductDescription"
                                                            className='position-relative'
                                                        >
                                                            {t('SingleQuotePage.quoteCustomizeProductDescriptionInput')}
                                                            <i title={t('SingleQuotePage.quoteCustomizeProductDescriptionInputTit')} onClick={() => toggleTooltip('Desc')}  className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                             {activeTooltip === 'Desc' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteCustomizeProductDescriptionInputTit')}
                                                    </div>
                                                )}
                                                        </label>
                                                        <textarea
                                                            id="customProductDescription"
                                                            name="description"
                                                            className="form-control customizedInput"
                                                            rows="3"
                                                            placeholder={t('SingleQuotePage.quoteCustomizeProductDescriptionInputPlacholder')}
                                                            value={customProduct?.description}
                                                            onChange={handleCustomProductChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="customizationQuote__actions singleQuoteInput">
                                                        <label className=' position-relative'>{t('SingleQuotePage.quoteCustomizeProductUploadInput')} <span className='optional'>
                                                            ({t('SingleQuotePage.quoteCustomizeProductSubUploadInput')})
                                                        </span>
                                                            <i title={t('SingleQuotePage.quoteCustomizeProductUploadInputTit')} onClick={() => toggleTooltip('upload')} className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                            {activeTooltip === 'upload' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteCustomizeProductUploadInputTit')}
                                                    </div>
                                                )}
                                                        </label>
                                                        <p style={{
                                                            fontSize:'14px'
                                                        }} className='fw-light mb-2 ps-2'>{t('SingleQuotePage.quoteCustomizeProductUploadInputPlaceholder')} </p>
                                                        <input
                                                            
                                                            type='file'
                                                            id='customProductImageBtn'
                                                            multiple
                                                            ref={fileInputRef}
                                                            onChange={handleCustomProductChangeImage}
                                                            className={`form-control ps-2`}
                                                        />
                                                        {
                                                            customProduct.file.length > 0 &&
                                                            <small className="hintForAddedFiles d-block">{t('SingleQuotePage.quoteCustomizeProductAttachAdded')}</small>
                                                        }
                                                        <span className='pageMainBtnStyle addItemToQuoteBtn mt-4' onClick={handleAddCustomProduct}>
                                                            {t('SingleQuotePage.quoteCustomizeProductAddItemBtn')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                               { 
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
                                            <label className="form-check-label position-relative" htmlFor="flexCheckDefault"

                                            >
                                                {t('SingleQuotePage.quoteIncludeShippingInput')}
                                                <i title={t('SingleQuotePage.quoteIncludeShippingInputTit')} onClick={() => toggleTooltip('shipping')}  className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                {activeTooltip === 'shipping' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteIncludeShippingInputTit')}
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                        <p style={{fontSize:'14px'}} className='ms-4 mb-3 mt-2'>
                                            {t('SingleQuotePage.quoteIncludeShippingInputPlaceholder')}
                                        </p>
                                        {
                                            distinationData?.include_shipping &&
                                            <>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name={'include_insurance'}
                                                        checked={distinationData?.include_insurance}
                                                        onChange={handleCheckboxChange}
                                                        id="flexCheckDefault2" />
                                                    <label className="form-check-label position-relative" htmlFor="flexCheckDefault2">
                                                        {t('SingleQuotePage.quoteIncludeInsuranceInput')}
                                                        <i title={t('SingleQuotePage.quoteIncludeInsuranceInputTit')} onClick={() => toggleTooltip('Insurance')} className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                        {activeTooltip === 'Insurance' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.quoteIncludeInsuranceInputTit')}
                                                    </div>
                                                )}
                                                    </label>
                                                </div>
                                                <p style={{fontSize:'14px'}} className='ms-4 mb-3 mt-2'>
                                                    {t('SingleQuotePage.quoteIncludeInsuranceInputPlaceholder')}
                                                </p>
                                            </>
                                        }
                                    </div>
                                </div>
}
                                { distinationData?.include_shipping && (
                                    <div className="col-12">
                                        <DestinationForm isOneClickQuotation={false} countries={countries} distinationData={distinationData} setDistinationData={setDistinationData} />
                                    </div>
                                )}
                            
                                <div className="col-12">
                                    <div className="customizationQuote__handler">
                                        <h3 className='text-capitalize customizationHead'>

                                        </h3>
                                        <div className="customization__form row">
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="currency" className='position-relative'>
                                                        {t('SingleQuotePage.QuotepreferredCurrInput')}
                                                        <i title={t('SingleQuotePage.QuotepreferredCurrInputTit')} onClick={() => toggleTooltip('prefferd')} className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                        {activeTooltip === 'prefferd' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.QuotepreferredCurrInputTit')}
                                                    </div>
                                                )}
                                                    </label>
                                                    <select
                            defaultValue={''}
                            className={`form-select w-100 ${Lang === "ar" ? "formSelect_RTL" : ""}`}
                            id="currency"
                            name={ 'currency'}
                            onChange={handleCurrencyChange}
                        >
                            <option value='' disabled>{t('SingleQuotePage.QuotepreferredCurrInputPlaceholder')}</option>
                            <option value="default">{t('SingleQuotePage.QuotepreferredUsdCurrInput')}</option>
                            <option value="local">{companyCurrency} ({t('SingleQuotePage.QuotepreferredSellerCurrInput')})</option>
                        </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="quotationNote" className='position-relative'>
                                                        {t('SingleQuotePage.QuotepreferredNoteInput')}
                                                        <i title= {t('SingleQuotePage.QuotepreferredNoteInputTit')} onClick={() => toggleTooltip('note')}  className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                        {activeTooltip === 'note' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('SingleQuotePage.QuotepreferredNoteInputTit')}
                                                    </div>
                                                )}
                                                    </label>
                                                    <textarea
                                                        id="quotationNote"
                                                        name="request_by_notes"
                                                        className="form-control customizedInput"
                                                        rows="3"
                                                        defaultValue={distinationData?.request_by_notes}
                                                        placeholder={t('SingleQuotePage.QuotepreferredNoteInputPlaceholder')}
                                                        onChange={(e) => {
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
                                        {t('SingleQuotePage.quoteSubmitBtn')}
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