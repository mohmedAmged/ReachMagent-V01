import React, { useEffect, useState } from 'react'
import './showSinglequotation.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import UnAuthSec from '../unAuthSection/UnAuthSec';

export default function ShowSingleQuotation({ token }) {
    const loginType = localStorage.getItem('loginType');
    const { quotationsId } = useParams();
    const [fullData, setFullData] = useState([]);
    const [newData, setNewdata] = useState([]);
    const [acceptedSingleQuotations, setAcceptedSingleQuotations] = useState([]);
    const [updatedUnitPrices, setUpdatedUnitPrices] = useState([]);
    const [updatedQuantity, setUpdatedQuantity] = useState([]);
    const [updatedTaxPrices, setUpdatedTaxPrices] = useState([]);
    const [submitionData, setSubmitionData] = useState({
        quotation_id: quotationsId,
        status: '',
        quotation_detail_id: [],
        offer_price: [],
        tax: '',
        services: '',
        shipping_price: '',
        total_price: ''
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingValue, setShippingValue] = useState(0);
    const [servicesValue, setServicesValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const isOneClickQuotation = location.pathname.includes('companyoneclick');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const fetchShowQuotations = async () => {
        if (!isOneClickQuotation) {
            const slug = loginType === 'user' ? `${loginType}/show-single-quotation`
                :
                `${loginType}/show-quotation`
            try {
                const response = await axios.get(`${baseURL}/${slug}/${quotationsId}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNewdata(response?.data?.data?.quotation);
                setAcceptedSingleQuotations(response?.data?.data?.quotation?.quotation_details);
            } catch (error) {
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data.message || 'Something Went Wrong!');
            };
        } else {
            const slug = `${loginType}/show-one-click-quotation`
            try {
                const response = await axios.get(`${baseURL}/${slug}/${quotationsId}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFullData(response?.data?.data?.one_click_quotation);
                setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation[0]);
                setAcceptedSingleQuotations(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation[0]?.negotiate_one_click_quotation_details);
            } catch (error) {
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data.message || 'Something Went Wrong!');
            };
        };
    };

    useEffect(() => {
        fetchShowQuotations();
    }, [loginType, token]);

    useEffect(() => {
        if (updatedUnitPrices.length === 0 || updatedQuantity.length === 0) {
            const totalPriceArray = acceptedSingleQuotations?.map(el => el?.offer_price === 'N/A' ? +el?.price ? +el?.price : 0 : +el?.offer_price ? +el?.offer_price : 0);
            const totalQuantityArray = acceptedSingleQuotations?.map(el => el?.quantity !== 'N/A' && +el?.quantity);
            setUpdatedUnitPrices(totalPriceArray);
            setUpdatedQuantity(totalQuantityArray);
            setShippingValue(newData?.shipping_price === 'N/A' ? 0 : newData?.shipping_price ? +newData?.shipping_price : 0);
            setServicesValue(newData?.services === 'N/A' ? 0 : newData?.services ? newData?.services : 0);
        };
    }, [updatedQuantity, updatedUnitPrices]);

    useEffect(() => {
        const subTotalPrice = updatedUnitPrices.reduce(
            (acc, current, idx) => 
                +acc 
            + 
                ((+current * +updatedQuantity[idx]) 
                + 
                (updatedTaxPrices.find(el => +el?.id === +idx) 
                ? (+updatedTaxPrices.find(el => +el?.id === +idx)?.tax * (+current * +updatedQuantity[idx]) / 100) : 0))
        , 0);
        setTotalPrice(subTotalPrice);
        setSubmitionData({...submitionData,total_price: subTotalPrice});
    }, [updatedQuantity, updatedTaxPrices, updatedUnitPrices, acceptedSingleQuotations])

    useEffect(() => {
        setTotalPrice(+submitionData?.total_price + +shippingValue + +servicesValue);
    }, [submitionData?.total_price, shippingValue, servicesValue]);

    const handleChangeInput = (event) => {
        setSubmitionData({ ...submitionData, [event?.target?.name]: `${event?.target?.value}` });
        if (event.target.name === 'shipping_price') {
            setShippingValue(event?.target?.value);
        } else if (event.target.name === 'services') {
            setServicesValue(event.target.value);
        };
    };

    const handleRejectAllQuotation = () => {
        const toastId = toast.loading('Loading...');
        const submitData = { status: 'rejected' };
        let slug = undefined;
        if (!isOneClickQuotation) {
            submitData.quotation_id = quotationsId;
            slug = 'update-quotation-status';
        } else {
            submitData.one_click_quotation_id = quotationsId;
            submitData.negotiate_one_click_quotation_id = `${newData?.id}`;
            slug = 'update-one-click-quotation-status';
        };
        (async () => {
            await axios.post(`${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`,
                submitData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (isOneClickQuotation) {
                        navigate('/profile/oneclick-quotations');
                    } else {
                        navigate('/profile/quotations');
                    };
                    toast.success(response?.data?.message || 'Quotation Rejected!', {
                        id: toastId,
                        duration: 1000,
                    });
                })
                .catch(error => {
                    if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                        setUnAuth(true);
                    };
                    toast.error(
                        error?.response?.data?.message ||
                        'Error', {
                        id: toastId,
                        duration: 1000
                    });
                });
        })();
    };

    const handleAcceptQuotation = () => {
        const toastId = toast.loading('Loading...');
        let submitData = {};
        let slug = undefined;
        if (!isOneClickQuotation) {
            slug = 'update-quotation-status';
            if (loginType === 'employee') {
                submitData = submitionData;
                submitData.status = 'accepted';
                submitData.total_price = +totalPrice;
                submitData.quotation_detail_id = acceptedSingleQuotations?.map(el => `${el?.id}`);
                submitData.offer_price = updatedUnitPrices;
            } else if (loginType === 'user') {
                submitData.quotation_id = quotationsId;
                submitData.status = 'accepted';
            };
        } else {
            slug = 'update-one-click-quotation-status';
            submitData.one_click_quotation_id = quotationsId;
            submitData.negotiate_one_click_quotation_id = `${newData?.id}`;
            submitData.status = 'accepted';
            submitData.total_price = +totalPrice;
            submitData.negotiate_one_click_quotation_detail_id = acceptedSingleQuotations?.map(el => `${el?.id}`);
            submitData.offer_price = updatedUnitPrices;
            submitData.shipping_price = shippingValue;
            submitData.services = servicesValue;
        };
        (async () => {
            await axios.post(`${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`,
                submitData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (isOneClickQuotation) {
                        navigate('/profile/oneclick-quotations');
                    } else {
                        navigate('/profile/quotations');
                    };
                    toast.success(response?.data?.message || 'Quotation Accepted!', {
                        id: toastId,
                        duration: 1000,
                    });
                })
                .catch(error => {
                    if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                        setUnAuth(true);
                    };
                    toast.error(
                        error?.response?.data?.message ||
                        'Error!', {
                        id: toastId,
                        duration: 1000
                    });
                });
        })();
    };

    const [loading, setLoading] = useState(true);

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
                    <div className='dashboard__handler showSingleQuotation__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader search={false} currentUserLogin={currentUserLogin} />
                            {
                                loginType === 'employee' &&
                                (
                                    unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={`Quotation: ${newData?.code || fullData?.code} `} />
                                        <div className="quotationTable__content">
                                            <Table responsive>
                                                <thead>
                                                    <tr className='table__default__header'>
                                                        <th># Title ( Code )</th>
                                                        <th className='text-center'>Unit Of Measure</th>
                                                        <th className='text-center'>QTY</th>
                                                        <th className='text-center'>Unit Price</th>
                                                        <th className='text-center'>Tax (xx%)</th>
                                                        <th className='text-center'>Total Price</th>
                                                        <th className='text-center'>Available For (##days)</th>
                                                        <th className='text-center'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        acceptedSingleQuotations?.map((row, idx) => (
                                                            <tr key={row?.id}>
                                                                <td className='text-capitalize'>
                                                                    <span className='me-2 indexOfTheTable'>{idx + 1}</span>
                                                                    <span>{
                                                                    `${row?.title} (${row?.code ?
                                                                    `${row?.code}` :
                                                                    '####'
                                                                    })`
                                                                    }
                                                                    </span>
                                                                </td>
                                                                <td className='text-center text-capitalize'>
                                                                    {
                                                                        row?.unit_of_measure !== 'N/A' ? row?.unit_of_measure : 'Customized Product'
                                                                    }
                                                                </td>
                                                                <td className='text-center text-capitalize'>
                                                                    <input
                                                                        type="number"
                                                                        className={`form-control ${(newData?.company_status === 'Pending') ? 'bg-white' : ''}`}
                                                                        defaultValue={row?.quantity !== 'N/A' ? +row?.quantity : 0}
                                                                        disabled={newData?.company_status !== 'Pending'}
                                                                        min={1}
                                                                        minLength={1}
                                                                        onChange={(e) => {
                                                                            
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className='text-center text-capitalize'>
                                                                    <input
                                                                        type="number"
                                                                        className={`form-control w-75 m-auto ${(newData?.company_status === 'Pending') ? 'bg-white' : ''}`}
                                                                        value={row?.price !== 'N/A' ? +row?.price : 0}
                                                                        min={1}
                                                                        minLength={1}
                                                                        onChange={(e) => {
                                                                            
                                                                        }}
                                                                        disabled={newData?.company_status !== 'Pending'}
                                                                    />
                                                                </td>
                                                                <td className='text-center text-capitalize'>
                                                                    <input
                                                                        type="number"
                                                                        className={`form-control ${(newData?.company_status === 'Pending') ? 'bg-white' : ''}`}
                                                                        value={row?.tax !== 'N/A' ? +row?.tax : 0}
                                                                        onChange={(e) => {
                                                                            
                                                                        }}
                                                                        disabled={newData?.company_status !== 'Pending'}
                                                                    />
                                                                </td>
                                                                <td className='text-center text-capitalize'>
                                                                    ${row?.expected_price !== 'N/A' ? +row?.expected_price : 0}
                                                                </td>
                                                                <td className='text-center text-capitalize'>
                                                                    <input type="number" className={`form-control m-auto ${(newData?.company_status === 'Pending') ? 'bg-white' : ''}`} />
                                                                </td>
                                                                <td className='text-center text-capitalize p-0'>
                                                                    <div className="actions w-100">
                                                                        <i className="bi bi-x-circle me-2" onClick={''}></i>
                                                                        <i class="bi bi-check-circle" onClick={''}></i>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div className="quoteTotals__handler">
                                            <h3>
                                                Quote Totals
                                            </h3>
                                            <div className="row align-items-center">
                                                <div className="col-lg-6">
                                                    <div className="totals__full__info">
                                                        <div className="totals__text">
                                                            <h5 className='mb-4'>
                                                                subtotal (Standard)
                                                            </h5>
                                                            {
                                                                (newData?.include_shipping === 'Yes' || isOneClickQuotation) ?
                                                                    <h5 className='mb-4'>
                                                                        Shipping cost
                                                                    </h5>
                                                                    :
                                                                    ''
                                                            }
                                                            <h5 className='mb-4'>
                                                                Services
                                                            </h5>
                                                            <h5>
                                                                Total
                                                            </h5>
                                                        </div>
                                                        <div className="totals__prices">
                                                            <h5 className='mb-4'>
                                                                ${submitionData?.total_price}
                                                            </h5>
                                                            {
                                                                (newData?.include_shipping === 'Yes' || isOneClickQuotation) ?
                                                                    <h5 className='mb-4'>
                                                                        <input
                                                                            defaultValue={newData?.shipping_price === 'N/A' ? 0 : newData?.shipping_price}
                                                                            name='shipping_price'
                                                                            type="number"
                                                                            id='quotationShippingPrice'
                                                                            className='form-control w-50'
                                                                            maxLength={4}
                                                                            disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                            onChange={handleChangeInput}
                                                                        />
                                                                    </h5>
                                                                    :
                                                                    ''
                                                            }
                                                            <h5 className='mb-4'>
                                                                <input
                                                                    defaultValue={newData?.services === 'N/A' ? 0 : newData?.services}
                                                                    name='services'
                                                                    type="number"
                                                                    id='quotationservicesPrice'
                                                                    className='form-control w-50'
                                                                    min={0}
                                                                    maxLength={4}
                                                                    disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                    onChange={handleChangeInput}
                                                                />
                                                            </h5>
                                                            <h5>
                                                                ${totalPrice || (newData?.total_price !== 'N/A' && newData?.total_price) || 0 }
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 adjustPositione">
                                                    <div className="totals__have__problem">
                                                        <h3>
                                                            Having a problem?
                                                        </h3>
                                                        <button className='updateBtn'>
                                                            <i className="bi bi-wechat fs-4"></i>
                                                            <span>
                                                                Chat with requester
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="requesterDetails__handler">
                                            <h3>
                                                Requester Details
                                            </h3>
                                            <div className="row">
                                                <div className="col-lg-12 requesterDetails__content">
                                                    <div className="requesterDetails__mainInfo">
                                                        <div className="mainInfo__title">
                                                            <h5 className='mb-4'>
                                                                Full Name:
                                                            </h5>
                                                            <h5 className='mb-4'>
                                                                Phone Number:
                                                            </h5>
                                                            <h5>
                                                                Street address:
                                                            </h5>
                                                        </div>
                                                        <div className="mainInfo__texts">
                                                            <h5 className='mb-4'>
                                                                {newData?.user_name || fullData?.user_name}
                                                            </h5>
                                                            <h5 className='mb-4'>
                                                                {newData?.user_phone || fullData?.user_phone
                                                                }
                                                            </h5>
                                                            <h5>
                                                                {newData?.address || fullData?.address}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="requesterDetails__subInfo">
                                                        <div className="mainInfo__title">
                                                            <h5 className='mb-4'>
                                                                City:
                                                            </h5>
                                                            <h5 className='mb-4'>
                                                                Area:
                                                            </h5>
                                                            <h5 className='mb-4'>
                                                                Postal Code:
                                                            </h5>
                                                            <h5>
                                                                Country:
                                                            </h5>
                                                        </div>
                                                        <div className="mainInfo__texts">
                                                            <h5 className='mb-4'>
                                                                {newData?.city || fullData?.destination_city}
                                                            </h5>
                                                            <h5 className='mb-4'>
                                                                {newData?.area || fullData?.destination_area}
                                                            </h5>
                                                            <h5 className='mb-4'>
                                                                {newData?.code || fullData?.code}
                                                            </h5>
                                                            <h5>
                                                                {newData?.country || fullData?.destination_country}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 d-flex justify-content-around">
                                                    {
                                                        loginType === 'employee' ?
                                                            newData?.company_status === 'Pending' &&
                                                            <>
                                                                <button onClick={handleAcceptQuotation} className='updateBtn' >Accept Quotation</button>
                                                                <button onClick={handleRejectAllQuotation} className='updateBtn reject' >Reject Quotation</button>
                                                            </>
                                                            :
                                                            (newData?.company_status === 'Accepted' && newData?.user_status !== 'Accepted') &&
                                                            <>
                                                                <button onClick={handleAcceptQuotation} className='updateBtn' >Accept Quotation</button>
                                                                <button onClick={handleRejectAllQuotation} className='updateBtn reject' >Reject Quotation</button>
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            {/* {
                                loginType === 'user' &&
                                (
                                    unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                    <ContentViewHeader title={`Quotation: ${newData?.code || fullData?.code} `} />
                                    <div className="quotationTable__content">
                                        <Table responsive>
                                            <thead>
                                                <tr className='table__default__header'>
                                                    <th># Item description</th>
                                                    <th className='text-center'>Item Code</th>
                                                    <th className='text-center'>Unit Of Measure</th>
                                                    <th className='text-center'>QTY</th>
                                                    <th className='text-center'>Unit Price</th>
                                                    <th className='text-center'>Tax (xx%)</th>
                                                    <th className='text-center'>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    acceptedSingleQuotations?.map((row, idx) => (
                                                        <tr key={row?.id}>
                                                            <td className='text-capitalize'>
                                                                <span className='me-2 indexOfTheTable'>{idx + 1}</span>
                                                                <span>{row?.slug ? row?.slug : `${row?.title}`}</span>
                                                            </td>
                                                            <td className='text-center text-capitalize'>
                                                                Item Code
                                                            </td>
                                                            <td className='text-center text-capitalize'>
                                                                Measure Unit
                                                            </td>
                                                            <td className='text-center text-capitalize'>
                                                                <input
                                                                    type="number"
                                                                    className={`form-control ${(loginType !== 'user' && newData?.company_status === 'Pending') ? 'bg-white' : ''}`}
                                                                    defaultValue={+updatedQuantity[idx] === 0 ? +row?.quantity : +updatedQuantity[idx]}
                                                                    disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                    min={1}
                                                                    minLength={1}
                                                                    onChange={(e) => {
                                                                        setUpdatedQuantity(updatedQuantity.map((el, id) => +id === +idx ? +e.target.value : el));
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className='text-center text-capitalize'>
                                                                <input
                                                                    type="number"
                                                                    className={`form-control ${(loginType !== 'user' && newData?.company_status === 'Pending') ? 'bg-white' : ''}`}
                                                                    defaultValue={updatedUnitPrices?.length === 0 ? 0 : +updatedUnitPrices[idx] === 0 ? +row?.price : +updatedUnitPrices[idx] }
                                                                    min={1}
                                                                    minLength={1}
                                                                    onChange={(e) => {
                                                                        setUpdatedUnitPrices(updatedUnitPrices?.map((el, id) => +id === +idx ? +e.target.value : el));
                                                                    }}
                                                                    disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                />
                                                            </td>
                                                            <td className='text-center text-capitalize'>
                                                                <input
                                                                    type="number"
                                                                    className={`form-control ${(loginType !== 'user' && newData?.company_status === 'Pending') ? 'bg-white' : ''}`}
                                                                    value={updatedTaxPrices[idx]?.tax || row?.tax}
                                                                    onChange={(e) => {
                                                                        const updatingObj = updatedTaxPrices?.find(el => +el?.id === +idx);
                                                                        if(e.target.value >= 0 && e.target.value <= 100){
                                                                            updatingObj ?
                                                                                setUpdatedTaxPrices(updatedTaxPrices.map(el => +el?.id === +updatingObj?.id ? { id: idx, tax: +e.target.value } : el))
                                                                                :
                                                                                setUpdatedTaxPrices([...updatedTaxPrices, { id: idx, tax: +e.target.value }]);
                                                                        }else if(e.target.value < 0){
                                                                            updatingObj &&
                                                                            setUpdatedTaxPrices(updatedTaxPrices.map(el => +el?.id === +updatingObj?.id ? { id: idx, tax: 0 } : el));
                                                                        }else if(e.target.value > 100){
                                                                            updatingObj &&
                                                                            setUpdatedTaxPrices(updatedTaxPrices.map(el => +el?.id === +updatingObj?.id ? { id: idx, tax: 100 } : el));
                                                                        };
                                                                    }}
                                                                    disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                />
                                                            </td>
                                                            <td className='text-center text-capitalize'>
                                                                ${(updatedQuantity[idx] || row?.quantity) * (updatedUnitPrices[idx] || row?.price) + ((updatedQuantity[idx] || row?.quantity) * (updatedUnitPrices[idx] || row?.price) * (updatedTaxPrices?.find((el) => +el?.id === +idx) ? (+updatedTaxPrices?.find((el) => +el?.id === +idx).tax) : 0)) / 100}
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="quoteTotals__handler">
                                        <h3>
                                            Quote Totals
                                        </h3>
                                        <div className="row align-items-center">
                                            <div className="col-lg-6">
                                                <div className="totals__full__info">
                                                    <div className="totals__text">
                                                        <h5 className='mb-4'>
                                                            subtotal (Standard)
                                                        </h5>
                                                        {
                                                            (newData?.include_shipping === 'Yes' || isOneClickQuotation) ?
                                                                <h5 className='mb-4'>
                                                                    Shipping cost
                                                                </h5>
                                                                :
                                                                ''
                                                        }
                                                        <h5 className='mb-4'>
                                                            Services
                                                        </h5>
                                                        <h5>
                                                            Total
                                                        </h5>
                                                    </div>
                                                    <div className="totals__prices">
                                                        <h5 className='mb-4'>
                                                            ${submitionData?.total_price}
                                                        </h5>
                                                        {
                                                            (newData?.include_shipping === 'Yes' || isOneClickQuotation) ?
                                                                <h5 className='mb-4'>
                                                                    <input
                                                                        defaultValue={newData?.shipping_price === 'N/A' ? 0 : newData?.shipping_price}
                                                                        name='shipping_price'
                                                                        type="number"
                                                                        id='quotationShippingPrice'
                                                                        className='form-control w-50'
                                                                        maxLength={4}
                                                                        disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                        onChange={handleChangeInput}
                                                                    />
                                                                </h5>
                                                                :
                                                                ''
                                                        }
                                                        <h5 className='mb-4'>
                                                            <input
                                                                defaultValue={newData?.services === 'N/A' ? 0 : newData?.services}
                                                                name='services'
                                                                type="number"
                                                                id='quotationservicesPrice'
                                                                className='form-control w-50'
                                                                min={0}
                                                                maxLength={4}
                                                                disabled={loginType === 'user' || newData?.company_status !== 'Pending'}
                                                                onChange={handleChangeInput}
                                                            />
                                                        </h5>
                                                        <h5>
                                                            ${(newData?.total_price === 'N/A') ? totalPrice : newData?.total_price}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 adjustPositione">
                                                <div className="totals__have__problem">
                                                    <h3>
                                                        Having a problem?
                                                    </h3>
                                                    <button className='updateBtn'>
                                                        <i className="bi bi-wechat fs-4"></i>
                                                        <span>
                                                            Chat with requester
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="requesterDetails__handler">
                                        <h3>
                                            Requester Details
                                        </h3>
                                        <div className="row">
                                            <div className="col-lg-12 requesterDetails__content">
                                                <div className="requesterDetails__mainInfo">
                                                    <div className="mainInfo__title">
                                                        <h5 className='mb-4'>
                                                            Full Name:
                                                        </h5>
                                                        <h5 className='mb-4'>
                                                            Phone Number:
                                                        </h5>
                                                        <h5>
                                                            Street address:
                                                        </h5>
                                                    </div>
                                                    <div className="mainInfo__texts">
                                                        <h5 className='mb-4'>
                                                            {newData?.user_name || fullData?.user_name}
                                                        </h5>
                                                        <h5 className='mb-4'>
                                                            {newData?.user_phone || fullData?.user_phone
                                                            }
                                                        </h5>
                                                        <h5>
                                                            {newData?.address || fullData?.address}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="requesterDetails__subInfo">
                                                    <div className="mainInfo__title">
                                                        <h5 className='mb-4'>
                                                            City:
                                                        </h5>
                                                        <h5 className='mb-4'>
                                                            Area:
                                                        </h5>
                                                        <h5 className='mb-4'>
                                                            Postal Code:
                                                        </h5>
                                                        <h5>
                                                            Country:
                                                        </h5>
                                                    </div>
                                                    <div className="mainInfo__texts">
                                                        <h5 className='mb-4'>
                                                            {newData?.city || fullData?.destination_city}
                                                        </h5>
                                                        <h5 className='mb-4'>
                                                            {newData?.area || fullData?.destination_area}
                                                        </h5>
                                                        <h5 className='mb-4'>
                                                            {newData?.code || fullData?.code}
                                                        </h5>
                                                        <h5>
                                                            {newData?.country || fullData?.destination_country}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 d-flex justify-content-around">
                                                {
                                                    loginType === 'employee' ?
                                                        newData?.company_status === 'Pending' &&
                                                        <>
                                                            <button onClick={handleAcceptQuotation} className='updateBtn' >Accept Quotation</button>
                                                            <button onClick={handleRejectAllQuotation} className='updateBtn reject' >Reject Quotation</button>
                                                        </>
                                                        :
                                                        (newData?.company_status === 'Accepted' && newData?.user_status !== 'Accepted') &&
                                                        <>
                                                            <button onClick={handleAcceptQuotation} className='updateBtn' >Accept Quotation</button>
                                                            <button onClick={handleRejectAllQuotation} className='updateBtn reject' >Reject Quotation</button>
                                                        </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                )
                            } */}
                        </div>
                    </div>
            }
        </>
    );
};