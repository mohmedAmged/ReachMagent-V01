import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import './showOneOrderInfo.css'
import { Table } from 'react-bootstrap';
import defaulImg from '../../assets/servicesImages/default-store-350x350.jpg'
export default function ShowOneOrderInfo({ token }) {
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [newData, setNewdata] = useState([]);
    const fetchOrderInfo = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/show-order/${orderId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.order);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchOrderInfo();
    }, [loginType, token]);
    const taxesPrice = newData?.taxes;
    const shippingPrice = newData?.shipping_price;
    const servicePrice = newData?.services;
    const currencySymbol = newData?.currency_symbol;
    

    const handleChangeStatue = async (id, orderNextSatus) => {
        await axios.post(`${baseURL}/${loginType}/update-order-status?t=${new Date().getTime()}`, {
          order_id: `${id}`,
          order_status: `${orderNextSatus}`
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            toast.success(response?.data?.message || 'Changed Successfully!');
            fetchOrderInfo();
          })
          .catch(error => {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
          })
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
                    <div className='dashboard__handler showOneProductInDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container showOneOrder__handler'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
        <div className='content__view__handler'>
            <ContentViewHeader title={`main order Details #${newData?.code} (${newData?.type})`} />
            <div className="content__card__list showOrder__handler">
                <div className="row">
                    <div className="col-12 main_header_for_order">
                        <div className="row justify-content-between">
                            <div className="col-lg-6 col-md-6 col-sm-12 ">
                                <p>
                                    <i className="bi bi-calendar me-2"></i>
                                    {newData?.created_at}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 ">
                                <div className="changeOrderStatu__handler ">
                                    <p className={`order__statue ${newData?.order_status}`}>
                                        {newData?.order_status}
                                    </p>
                                    {
                                        newData?.order_status !== 'Completed' && loginType !== 'user' &&
                                        <button  onClick={() => handleChangeStatue(newData?.id, newData?.next_status)} className='changeSatusBtn'>
                                        change status
                                        </button>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <p className='specialP'>
                                    Customer Information
                                </p>
                                <h5>
                                    {newData?.user_name}
                                </h5>
                                <p>
                                    {newData?.user_phone}
                                </p>
                                <p>
                                    {newData?.city}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6  sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-geo-alt-fill"></i>

                                </div>
                                <p className='specialP'>
                                    Destination & Payment
                                </p>
                                <h5>
                                    {newData?.city}, {newData?.country}
                                </h5>
                                <p>
                                    Adress: {newData?.address}
                                </p>
                                <p>
                                    payment statue: {newData?.payment_status}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        {
                            newData?.length !== 0 ?
                                <div className="productTable__content">
                                    <Table responsive>
                                        <thead>
                                            <tr className='table__default__header'>
                                                <th>
                                                    product
                                                </th>
                                                <th className='text-center'>Qty</th>
                                                <th className='text-center'>Price</th>
                                                <th className='text-center'>shipping</th>
                                                <th className='text-center'>taxes</th>
                                                <th className='text-center'>services</th>
                                                <th className='text-center'>total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newData?.order_details?.map((row, index) => (
                                                <tr className='' key={index}>
                                                    <td className='product__breif__detail d-flex '>
                                                        <div className="product__img">
                                        <img src={row?.medias?.length !== 0 ? row?.medias[0]?.media : defaulImg} alt="product" />
                                                        </div>
                                                        <div className="product__info">
                                                            <h2 className='cursorPointer' title={row?.title}>
        {row?.title?.length > 5 ? `${row?.title.substring(0, 5)}...` : row?.title}
                                                            </h2>
                                                        </div>
                                                    </td>



                                                    <td>
                                                        {row?.quantity}
                                                    </td>
                                                    <td>
                                                        {currencySymbol}{row?.total_price}
                                                    </td>
                                                    <td>
                                                    {currencySymbol}{shippingPrice}
                                                    </td>
                                                    <td>
                                                    {currencySymbol}{taxesPrice}
                                                    </td>
                                                    <td>
                                                    {currencySymbol}{servicePrice}
                                                    </td>
                                                    <td>
                                                    {currencySymbol}
                        {
                            ((parseFloat(row?.total_price) * parseFloat(row?.quantity)) + parseFloat(shippingPrice) + parseFloat(taxesPrice) + + parseFloat(servicePrice))
                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                :
                                <div className='row'>
                                    <div className="col-12 text-danger fs-5">
                                        No Product Items Yet
                                    </div>
                                </div>
                        }
                    </div>
                </div>


            </div>

        </div>
                            }
                        </div>
                    </div>
            }
        </>
    )
}
