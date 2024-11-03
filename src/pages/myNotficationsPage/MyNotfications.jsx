import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import { Table } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import checkIcon from '../../assets/icons/check-lg.svg'
export default function MyNotfications({ token, fireNotification, setFireNotification }) {
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate()

    const getAllNotifications = async (params) => {
        const slug = loginType === 'user' ? `${loginType}/all-notifications`
        :
        `${loginType}/company-all-notifications`
        await axios.get(`${baseURL}/${slug}${params ? `${params}&` : '?'}page=${currentPage}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setAllNotifications(response?.data?.data?.notifications);
                setTotalPages(response?.data?.data?.meta?.last_page);
            })
            .catch(error => {
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data?.message || 'Something Went Wrong');
            });
            setFireNotification(false)
    };
    const handleDeleteThisProduct = async (id) => {
        const slug = loginType === 'user' ? `${loginType}/delete-notification`
        :
        `${loginType}/company-delete-notification`
        try {
            const response = await axios?.delete(`${baseURL}/${slug}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await getAllNotifications();
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message);
        }
    };
    const handleDeleteAllNotification = async () => {
        const slug = loginType === 'user' ? `${loginType}/delete-all-notifications`
        :
        `${loginType}/company-delete-all-notifications`
        try {
            const response = await axios?.delete(`${baseURL}/${slug}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await getAllNotifications();
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message);
        }
    };
    const handleReadOneNotification = async (NotifId) => {
        const slug = loginType === 'user' ? `${loginType}/read-one-notification`
        :
        `${loginType}/company-read-one-notification`
        try {
            const response = await axios?.post(`${baseURL}/${slug}`, {
                id: NotifId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                scrollToTop()
                toast.success(response?.data?.message);
            } else {
                toast.error('Failed to add product item!');
            };
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message);
        }
    }

    const handleMArkAllRead = async () => {
        const slug = loginType === 'user' ? `${loginType}/mark-all-as-read`
        :
        `${loginType}/company-mark-all-as-read`
        try {
            const response = await axios?.get(`${baseURL}/${slug}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await getAllNotifications();
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message);
        }
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        getAllNotifications();
    }, [currentPage, token, fireNotification]);

    const handleNavigation = (target, id) => {
        if (target === 'booked_appointments') {
            navigate(`/profile/booked-appointments`);
        } else if (target === 'one_click_quotation') {
            navigate(`/profile/companyoneclick-quotations/${id}`);
        } else if (target === 'quotation') {
            navigate(`/profile/quotations/${id}`);
        } else if (target === 'quotation_order') {
            navigate(`/profile/quotation-orders/${id}`);
        } else if (target === 'followers') {
            navigate(`/profile/followers`);
        } else {
            console.warn(`Unhandled target: ${target}`);
        }
    };

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);
    console.log(allNotifications);

    return (
        <>
            <div className='dashboard__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader currentUserLogin={currentUserLogin} />
                    <div className='myProducts__handler quotationTable__handler content__view__handler'>
                        <div className="productTable__content">
                            {
                                allNotifications?.length > 0 ?
                                    <>
                                        <div className="d-flex justify-content-between flex-wrap">
                                            <button type="button" className="markBtnHandler"
                                                onClick={() => handleMArkAllRead()}
                                                >
                                                <span className="button__text">Mark all as read</span>
                                                <span className="button__icon">
                                                    <i className="bi bi-check-lg"></i>
                                                </span>
                                            </button>
                                            <button 
                                            onClick={() => handleDeleteAllNotification()}
                                            className="DeleteAllNotifyHandler">
                                                <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                                            </button>
                                        </div>

                                        <Table responsive >
                                            <thead>
                                                <tr className='table__default__header'>
                                                    <th>
                                                        Sender
                                                    </th>
                                                    <th className='text-center'>Type</th>
                                                    <th className='text-center'>time</th>
                                                    <th className='text-center'>Message</th>
                                                    <th>
                                                        view
                                                    </th>
                                                </tr>
                                            </thead>
                <tbody>
                    {
                        allNotifications?.map((el) => (
                            <tr key={el?.id}>
                                <td className={`${el?.read === false ? 'notifBgGray' : ''}`}>
                                    <div className='product__breif__detail d-flex '>
                                        <i className="bi bi-trash-fill" onClick={() => handleDeleteThisProduct(el?.id)}></i>
                                        <div className="product__img">
                                            <img src={el?.image} alt="sender-img" />
                                        </div>
                                        <div className="product__info">
                                            <h2>
                                                {el?.name}
                                            </h2>
                                        </div>
                                    </div>
                                </td>
                                <td className={`${el?.read === false ? 'notifBgGray' : ''}`}>
                                    {el?.target}
                                </td>
                                <td className={`${el?.read === false ? 'notifBgGray' : ''}`}>
                                    {el?.date}
                                </td>
                                <td className={`${el?.read === false ? 'notifBgGray' : ''}`}>
                                    {el?.message}
                                </td>
                                <td className={`${el?.read === false ? 'notifBgGray' : ''}`}>
                                    <i className="bi bi-box-arrow-up-right" onClick={() => {
                                        handleReadOneNotification(el?.id)
                                        // navigate(`${el?.target === 'followers' ? '/profile/followers' : '/profile'}`)
                                        handleNavigation(el.target, el.sender_id)
                                    }}></i>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
                                        </Table>
                                        {
                                            totalPages > 1 &&
                                            <div className="d-flex justify-content-center align-items-center mt-4">
                                                <button
                                                    type="button"
                                                    className="paginationBtn me-2"
                                                    disabled={currentPage === 1}
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                >
                                                    <i class="bi bi-caret-left-fill"></i>
                                                </button>
                                                <span className='currentPagePagination'>{currentPage}</span>
                                                <button
                                                    type="button"
                                                    className="paginationBtn ms-2"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                >
                                                    <i class="bi bi-caret-right-fill"></i>
                                                </button>
                                            </div>
                                        }
                                    </>
                                    :
                                    <div className='row'>
                                        <div className="col-12 text-danger fs-5">
                                            No Notifications Yet
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};
