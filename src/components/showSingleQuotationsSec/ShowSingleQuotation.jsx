import React, { useEffect, useState } from 'react'
import './showSinglequotation.css'
import { NavLink, useParams } from 'react-router-dom';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import defaultProdImg from '../../assets/servicesImages/default-store-350x350.jpg'
import msgIcon from '../../assets/icons/Vector (1).svg'

export default function ShowSingleQuotation({ token }) {
    const loginType = localStorage.getItem('loginType')
    const { quotationsId } = useParams();
    const [newData, setNewdata] = useState([])

    const fetchShowQuotations = async () => {
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
        } catch (error) {
            setNewdata(error?.response?.data.message);
        }
    };
    useEffect(() => {
        fetchShowQuotations();
    }, [loginType, token]);
    console.log(newData);
    return (
        <div className='dashboard__handler showSingleQuotation__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader />
                <div className='content__view__handler'>
                    <ContentViewHeader title={'Request a quote'} />
                    <div className="quotationTable__content">
                        <Table responsive>
                            <thead>
                                <tr className='table__default__header'>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>QTY</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newData?.quotation_details?.map((row, index) => (
                                    <tr className='' key={index}>
                                        <td className='product__item__content'>
                                            <i className="bi bi-x-circle-fill"></i>
                                            <img src={row?.medias[0]?.media ? row?.medias[0]?.media : `${defaultProdImg}`} alt="" />
                                            <span>{row?.slug ? row?.slug : `${row?.title}`}</span>
                                        </td>
                                        <td>
                                            {row?.category ? row?.category : 'N/A'}
                                        </td>

                                        <td>
                                            <input type="number" className='form-control'
                                                value={!row?.price ?
                                                    row?.offer_price !== 'N/A' ? row?.offer_price : 0
                                                    : row?.price} />
                                        </td>
                                        <td>
                                            {row?.quantity}
                                        </td>
                                        <td>
                                            <input type="number" className='form-control'
                                                value={row?.expected_price ? row?.expected_price === 'N/A' ? 0
                                                    : row?.expected_price : 0} />
                                            {/* {row?.expected_price} */}
                                        </td>
                                    </tr>
                                ))}
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
                                        <h5 className='mb-4'>
                                            Shipping cost
                                        </h5>
                                        <h5>
                                            Total
                                        </h5>
                                    </div>
                                    <div className="totals__prices">
                                        <h5 className='mb-4'>
                                            $4,230.00
                                        </h5>
                                        <h5 className='mb-4'>
                                            $150.00
                                        </h5>
                                        <h5>
                                            $4,380.00
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
                            <div className="col-lg-11 requesterDetails__content">
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
                                        {newData?.user_name
                                            }
                                        </h5>
                                        <h5 className='mb-4'>
                                        {newData?.user_phone
                                            }
                                        </h5>
                                        <h5>
                                        {newData?.address}
                                        </h5>
                                    </div>
                                </div>
                                <div className="requesterDetails__subInfo">
                                    <div className="mainInfo__title">
                                        {/* <h5 className='mb-4'>
                                            Email Address:
                                        </h5> */}
                                        <h5 className='mb-4'>
                                            City:
                                        </h5>
                                        <h5 className='mb-4'>
                                            State/Region:
                                        </h5>
                                        <h5 className='mb-4'>
                                            Postal Code:
                                        </h5>
                                        <h5>
                                            Country:
                                        </h5>
                                    </div>
                                    <div className="mainInfo__texts">
                                        {/* <h5 className='mb-4'>
                                            MikeA12@gmail.com
                                        </h5> */}
                                        <h5 className='mb-4'>
                                            {newData?.city}
                                        </h5>
                                        <h5 className='mb-4'>
                                            {newData?.area}
                                        </h5>
                                        <h5 className='mb-4'>
                                            {newData?.code}
                                        </h5>
                                        <h5>
                                            {newData?.country}
                                        </h5>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
