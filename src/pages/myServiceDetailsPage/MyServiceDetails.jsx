import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { Col, Container, Row } from 'react-bootstrap';
import { useServiceStore } from '../../store/SingleService';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import Cookies from 'js-cookie';
import ProductDetailsFilterationBar from '../../components/productDetailsFilterationBarSec/ProductDetailsFilterationBar';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyServiceDetails({ token }) {
    const { servId } = useParams();
    const { t } = useTranslation();
    console.log(servId);
    
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [addedPreferences, setAddedPreferences] = useState([]);

    const { currentService, loading, fetchService } = useServiceStore();
    const optionsRef = useRef(null);
console.log(currentService);

    useEffect(() => {
        fetchService(servId, token);
    }, [servId, token, loginType, fetchService]);


    const [activeItem, setActiveItem] = useState(`${t('singleCatalogPage.filterbarAbout')}`);
    
    
    
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
        if (itemName === `${t('singleCatalogPage.filterbarOptions')}` && optionsRef.current) {
            optionsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // const handleAddProduct = (product) => {
    //     const preferences = Object.values(addedPreferences);
    //     const addedProduct = {
    //         type:  product?.type,
    //         item_id: `${product?.id}`,
    //         preferences

    //     };
    //     (async () => {
    //         const toastId = toast.loading('Loading...');
    //         await axios.post(`${baseURL}/user/add-item-to-quotation-cart?t=${new Date().getTime()}`,
    //             addedProduct
    //             , {
    //                 headers: {
    //                     'Content-type': 'application/json',
    //                     'Accept': 'application/json',
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             })
    //             .then((response) => {
    //                 toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
    //                     id: toastId,
    //                     duration: 1000
    //                 });
    //                 fetchService(servId, token);
    //             })
    //             .catch((error) => {
    //                 const errorMessage =
    //                     error?.response?.data?.message || 'Something went wrong!';
    //                 const errorDetails =
    //                     error?.response?.data?.errors || {}; 
    //                 toast.error(errorMessage, {
    //                     id: toastId,
    //                     duration: 4000,
    //                 });
    //                 if (errorDetails.preferences && Array.isArray(errorDetails.preferences)) {
    //                     errorDetails.preferences.forEach((err) => {
    //                         toast.error(err, {
    //                             duration: 4000,
    //                         });
    //                     });
    //                 }
    //             });
    //     })();
    // };

    const handleAddProduct = (product) => {
        const preferences = Object.values(addedPreferences);
        const addedProduct = {
            type: product?.type,
            item_id: `${product?.id}`,
            preferences
        };

        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/user/add-item-to-quotation-cart?t=${new Date().getTime()}`,
                addedProduct,
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    toast.success(response?.data?.message || 'Added Successfully!', {
                        id: toastId,
                        duration: 1000
                    });
                    fetchService(servId, token);
                })
                .catch((error) => {
                    const errorMessage = error?.response?.data?.message || 'Something went wrong!';
                    const errorDetails = error?.response?.data?.errors || {};

                    toast.error(errorMessage, {
                        id: toastId,
                        duration: 4000,
                    });

                    if (errorDetails.preferences && Array.isArray(errorDetails.preferences)) {
                        errorDetails.preferences.forEach((err) => {
                            toast.error(err, { duration: 4000 });
                        });

                        setActiveItem('Options');
                        setTimeout(() => {
                            if (optionsRef.current) {
                                optionsRef.current.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 200);
                    }
                });
        })();
    };
     
    const items = [
        { name: `${t('singleCatalogPage.filterbarAbout')}`, active: activeItem === `${t('singleCatalogPage.filterbarAbout')}` },
        { name: `${t('singleCatalogPage.filterbarOptions')}`, active: activeItem === `${t('singleCatalogPage.filterbarOptions')}` },
        ];

    console.log(currentService);
    
    return (
        <>
            {loading ? (
                <MyNewLoader />
            ) : (
                <div className='productDetailsPage'>
                    <Container className='productDetails__sec mb-5 mt-3'>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col md={12} className='activeImage'>
                                        <div className="imgContainer">
                                            <img src={currentService?.image} alt="product Details" />
                                        </div>
                                    </Col>
                                    <Col lg={12} className='sliderOfProductDetails'>
                                        <div className="imgContainer">
                                            <img src={currentService?.image} alt="product Details" />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <div className='productDetails__description mt-md-4'>
                                    <h2 className='productDetails__head text-capitalize'>
                                        {currentService?.title}
                                    </h2>
                                    <p className='mt-3 mb-4 fs-5 text-capitalize'>
                                        {currentService?.description}
                                    </p>
                                    {/* {
                                        currentService?.price_after_tax !== 'N/A' &&
                                        <p className="productDetails__price">
                                            <span style={{color:'gray', fontWeight:'normal', fontSize:'18px', textTransform:'capitalize'}}>starting from</span> <br/>
                                            {currentService?.price_after_tax || ''} {currentService?.currency}
                                        </p>
                                    } */}
                                    { currentService?.can_make_quotation &&
                                        <div className="companyQutation__btn my-4">
                                    {
                                    token ? (
                                        <>
                                            {localStorage.getItem('loginType') === 'user' && Cookies.get('verified') === 'false' ? (
                                                // Unverified user
                                                <button
                                                    onClick={() => {
                                                        toast.error(`${t('SingleCompanyPage.infoCardVerfiyAccToast')}`);
                                                        setTimeout(() => {
                                                            navigate('/user-verification');
                                                        }, 1000);
                                                    }}
                                                    className='btnColoredBlue'
                                                >
                                                   {t('singleCatalogPage.catalogAddToQuote')}
                                                </button>
                                            ) : currentService?.in_cart === false ? (
                                                // Verified user or other login types
                                                <button
                                                    onClick={() => handleAddProduct(currentService)}
                                                    className='btnColoredBlue'
                                                >
                                                    {t('singleCatalogPage.catalogAddToQuote')}
                                                </button>
                                            ) : (
                                                <NavLink
                                                onClick={() => {
                                                    Cookies.set('currentCompanyRequestedQuote', currentService?.company_slug);}}
                                                    to={`/${currentService?.company_name}/request-quote`}
                                                    target='_blank'
                                                    className={'nav-link'}
                                                >
                                                    <p className='text-capitalize' style={{ color: 'rgb(63, 215, 86)' }}>
                                                        {t('singleCatalogPage.catalogViewInCart')}<i className="bi bi-box-arrow-up-right"></i>
                                                    </p>
                                                </NavLink>
                                            )}
                                        </>
                                    ) : (
                                        // Unauthenticated user
                                        <NavLink to={'/login'} className={'nav-link'}>
                                            <button className='btnColoredBlue'> {t('singleCatalogPage.catalogAddToQuote')}</button>
                                        </NavLink>
                                    )
                                    }
                                        </div>
                                    }
                                     <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                        <NavLink target='_blanck' to={`/${currentService?.company_slug}`}>
                                        <span style={{textDecoration:'underline', color:'#000'}}>{t('singleCatalogPage.catalogViewCompanyProfile')}</span>
                                        </NavLink>
                                    </p>
                                    {/* <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                        <span>
                                            Sold by <strong>{currentService?.company_name}</strong>
                                        </span>
                                    </p> */}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className='my-5'>
                                    <ProductDetailsFilterationBar items={items} onItemClick={handleItemClick} />
                                </div>
                                {
                                    activeItem === `${t('singleCatalogPage.filterbarAbout')}` &&
                                    <>
                                    <div className='productDetails__content mb-5 mt-4 ms-4'>
                                    <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>
                                        {t('singleCatalogPage.catalogDescription')}:
                                    </h4>
                                    <p className='mt-3 mb-4 fs-5'>{currentService?.description}</p>
                                    <div className="row prodDetailsChangeColorSpan">
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                {t('singleCatalogPage.CatalogCategory')}:
                                                <span className={`fw-medium fs-5 ${Lang === 'ar' ? 'me-2' : 'ms-2'}`}>{currentService?.category}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                {t('singleCatalogPage.CatalogSubCategory')}:
                                                <span className={`fw-medium fs-5 ${Lang === 'ar' ? 'me-2' : 'ms-2'}`}>{currentService?.subCategory}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-12 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                {t('singleCatalogPage.catalogItemCode')}:
                                                <span className={`fw-medium fs-5 ${Lang === 'ar' ? 'me-2' : 'ms-2'}`}>{currentService?.code}</span>
                                            </p>
                                        </div>
                                    </div>
                                    </div>
                                    </>
                                }
                                {
                                    activeItem === `${t('singleCatalogPage.filterbarOptions')}` && 
                                    
                                    <div ref={optionsRef} className='productDetails__content mb-5 mt-4 ms-4'>
                                     {
                                        currentService?.options?.map((option)=>(
                                            <div className='fw-medium text-capitalize fs-4'>
                                                <h4 className='productDetails__contentHead my-4 fs-3 fw-bold text-capitalize'>{option?.attribute}</h4>
                                                {
                                                    option?.values.map((value, index)=>(
                                                        <div style={{
                                                            backgroundColor:'rgba(211, 212, 219, 0.5)', padding:'4px', borderRadius:'5px',
                                                        }} key={index} className='mt-2 d-flex gap-2 align-items-center'>
                                                        <input 
                                                        className='form-check cursorPointer'
                                                        type="radio" 
                                                        id={`option-${value.id}
                                                        `}
                                                        name={`option-${option.attribute_id}`} 
                                                        value={value.id}
                                                        checked={addedPreferences[option.attribute_id] === String(value.id)} // Check based on attribute_id
                                                        onChange={() => {
                                                            // Update the state with the selected value for this attribute_id
                                                            setAddedPreferences((prev) => ({
                                                                ...prev,
                                                                [option.attribute_id]: String(value.id), // Update or add the selected value for the group
                                                            }));
                                                        }}
                                                        />
                                                        <label 
                                                        style={{fontSize:'20px'}}
                                                        className='text-capitalize' htmlFor={`option-${value.id}`}>{value.name}</label>
                                                        <span style={{fontSize:'20px'}} className='ms-2'>
                                                        {value?.price} 
                                                        </span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                     }
                                     {/* <p className='mt-3 mb-4 fs-5'>     {currentCatalog?.options}
                                     </p> */}
                                     </div>
                                    
                                }
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}
