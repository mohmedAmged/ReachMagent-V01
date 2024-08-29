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
    console.log(newData);

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
                        <div className="row">
                            <div className="col-6 ">
                                <p>
                                    <i className="bi bi-calendar me-2"></i>
                                    {newData?.created_at}
                                </p>
                            </div>

                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="row">
                            <div className="col-lg-6 sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <p>
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
                            <div className="col-lg-6 sub_header_for_order">
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
                                <th className='text-center'>total price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newData?.order_details?.map((row, index) => (
                                <tr className='' key={index}>
                                  <td className='product__breif__detail d-flex '>
                                    <div className="product__img">
                                      <img src={row?.medias[0]?.media} alt="product" />
                                    </div>
                                    <div className="product__info">
                                      <h2>
                                        {row?.title}
                                      </h2>
                                    </div>
                                  </td>
                                  
                                 
                                  
                                  <td>
                                    {row?.quantity}
                                  </td>
                                  <td>
                                    ${row?.price}
                                  </td>
                                  <td>
                                    ${row?.total_price}
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
