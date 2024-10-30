import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import { Table } from 'react-bootstrap';

export default function MyNotfications({ token }) {
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getAllNotifications = async (params) => {
        // await axios.get(`${baseURL}/${loginType}/${''}${params ? `${params}&` : '?'}page=${currentPage}?t=${new Date().getTime()}`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // })
        //     .then(response => {
        //         setAllNotifications(response?.data?.data);
        //         setTotalPages(response?.data?.data?.meta?.last_page);
        //     })
        //     .catch(error => {
        //         if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        //             setUnAuth(true);
        //         };
        //         toast.error(error?.response?.data?.message || 'Something Went Wrong');
        //     });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        getAllNotifications();
    }, [currentPage]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    return (
        <>
            <div className='dashboard__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader currentUserLogin={currentUserLogin} />
                    <div className='myProducts__handler quotationTable__handler content__view__handler'>
                        <div className="productTable__content">
                            {
                                // allNotifications?.length > 0 ?
                                <>
                                    <Table responsive >
                                        <thead>
                                            <tr className='table__default__header'>
                                                <th>
                                                    #
                                                </th>
                                                <th className='text-center'>Type</th>
                                                <th className='text-center'>Sender</th>
                                                <th className='text-center'>time</th>
                                                <th className='text-center'>Message</th>
                                            </tr>
                                        </thead>
                                        {/* <tbody>
                                {
                                    allNotifications?.map(el => (
                                        <tr className='' key={''}>
                                            <td className='product__breif__detail d-flex '>
                                                <div className="product__info m-0">
                                                    <p>
                                                        {el?.code}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody> */}
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
                                // :
                                // <div className='row'>
                                //     <div className="col-12 text-danger fs-5">
                                //         No Orders Yet
                                //     </div>
                                // </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};
