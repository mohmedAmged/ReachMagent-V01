import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { Table } from 'react-bootstrap';

export default function MyShippingCosts({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);

    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);


    const fetchShippingCosts = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/shipping-costs?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.shipping_costs);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchShippingCosts();
    }, [loginType, token]);


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
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
        <div className='myProducts__handler content__view__handler'>
            <ContentViewHeader title={'Shipping Costs'} />
            {/* <div className='addNewItem__btn text-lg-end'>
                <NavLink onClick={() => {
                    scrollToTop();
                }}
                    to='/profile/shipping-costs/addNewCost' className='nav-link'>
                    <button>
                        Add New Cost
                    </button>
                </NavLink>
            </div> */}
            {
                newData?.length !== 0 ?
                    <div className="productTable__content">
                        <Table responsive>
                            <thead>
                                <tr className='table__default__header'>
                                    <th>
                                        Country
                                    </th>
                                    <th className='text-center'>City</th>
                                    <th className='text-center'>Shipping Cost</th>
                                    <th className='text-center'>currency Type</th>
                                    <th className='text-center'>Update Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newData?.map((row, index) => (
                                    <tr className='' key={index}>
                                        <td className=' text-start'>
                                            {row?.country}
                                        </td>
                                        <td >
                                            {row?.city}
                                        </td>
                                        <td>
                                            {row?.cost}
                                        </td>
                                        <td>
                                            {row?.currency_code}
                                        </td>
                                        <td>
                                            <NavLink className={'nav-link'} to={`/profile/products/show-one/${row?.id}`}>
                                            <i className="bi bi-pencil-square"></i>
                                            </NavLink>
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
                            }
                        </div>
                    </div>
            }
        </>
    )
}
