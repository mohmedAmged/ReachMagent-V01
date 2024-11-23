import React, { useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { Col, Container, Row } from 'react-bootstrap';
import { useServiceStore } from '../../store/SingleService';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function MyServiceDetails({ token }) {
    const { servId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();

    const { currentService, loading, fetchService } = useServiceStore();

    useEffect(() => {
        fetchService(servId, token);
    }, [servId, token, loginType, fetchService]);

    const handleAddProduct = (product) => {
        const addedProduct = {
            type:  product?.type,
            item_id: `${product?.id}`
        };
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/user/add-to-quotation-cart/${currentService?.company_id}?t=${new Date().getTime()}`,
                addedProduct
                , {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                    fetchService(servId, token);
                })
                .catch(error => {
                    toast.error(`${error?.response?.data?.message || 'Error!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
        })();
    };
    return (
        <>
            {loading ? (
                <MyLoader />
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
                                    <p className="productDetails__price">
                                        {currentService?.price_after_tax || ''} {currentService?.currency}
                                    </p>
                                    <div className="companyQutation__btn my-4">
                                    {
                                    token ? (
                                        <>
                                            {localStorage.getItem('loginType') === 'user' && Cookies.get('verified') === 'false' ? (
                                                // Unverified user
                                                <button
                                                    onClick={() => {
                                                        toast.error('You need to verify your account first!');
                                                        setTimeout(() => {
                                                            navigate('/user-verification');
                                                        }, 1000);
                                                    }}
                                                    className='btnColoredBlue'
                                                >
                                                    Add to Quotation
                                                </button>
                                            ) : currentService?.in_cart === false ? (
                                                // Verified user or other login types
                                                <button
                                                    onClick={() => handleAddProduct(currentService)}
                                                    className='btnColoredBlue'
                                                >
                                                    Add to Quotation
                                                </button>
                                            ) : (
                                                <NavLink
                                                    to={`/${currentService?.company_name}/request-quote`}
                                                    className={'nav-link'}
                                                >
                                                    <p className='text-capitalize' style={{ color: 'rgb(63, 215, 86)' }}>
                                                        view in Quotation cart <i className="bi bi-box-arrow-up-right"></i>
                                                    </p>
                                                </NavLink>
                                            )}
                                        </>
                                    ) : (
                                        // Unauthenticated user
                                        <NavLink to={'/login'} className={'nav-link'}>
                                            <button className='btnColoredBlue'>Add to Quotation</button>
                                        </NavLink>
                                    )
                                    }
                                    </div>
                                    <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                        <span>
                                            Sold by <strong>{currentService?.company_name}</strong>
                                        </span>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className='productDetails__content mb-5 mt-4'>
                                    <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>
                                        Description
                                    </h4>
                                    <p className='mt-3 mb-4 fs-5'>{currentService?.description}</p>
                                    <div className="row prodDetailsChangeColorSpan">
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                category:
                                                <span className='fw-medium ms-2 fs-5'>{currentService?.category}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                sub category:
                                                <span className='fw-medium ms-2 fs-5'>{currentService?.subCategory}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-12 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                item code:
                                                <span className='fw-medium ms-2 fs-5'>{currentService?.code}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}
