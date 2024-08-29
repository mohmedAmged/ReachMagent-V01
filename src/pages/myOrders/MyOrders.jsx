import React, { useEffect, useState } from 'react'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import { NavLink } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import testImg from '../../assets/servicesImages/default-store-350x350.jpg'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import Cookies from 'js-cookie';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function MyOrders({ token }) {
  const loginType = localStorage.getItem('loginType');
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllOrders = async (page = 1) => {
    await axios.get(`${baseURL}/${loginType}/all-orders?page=${page}?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setAllOrders(response?.data?.data?.orders);
        setTotalPages(response?.data?.data?.meta?.last_page);
      })
      .catch(error => {
        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message || 'Something Went Wrong');
      })
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    getAllOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  const handleDeleteOrder = async (id) => {
    await axios.post(`${baseURL}/${loginType}/reject-order?t=${new Date().getTime()}`, {
      order_id: `${id}`
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        toast.success(response?.data?.message || 'Deleted Successfully!');
        getAllOrders(currentPage);
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || 'Something Went Wrong!');
      })
  };

  console.log(allOrders);

  return (
    <>
      <div className='dashboard__handler d-flex'>
        <MyNewSidebarDash />
        <div className='main__content container'>
          <MainContentHeader currentUserLogin={currentUserLogin} />
          <div className='myProducts__handler content__view__handler'>
            <ContentViewHeader title={'My Orders'} />
            {
              unAuth ?
                <UnAuthSec />
                :
                <div className="productTable__content">
                  {
                    allOrders?.length > 0 ?
                      <>
                        <Table responsive>
                          <thead>
                            <tr className='table__default__header'>
                              <th>
                                Order Info
                              </th>
                              <th className='text-center'>{loginType === 'user' ? 'Company Name' : 'User Name'}</th>
                              <th className='text-center'>Date</th>
                              <th className='text-center'>Status</th>
                              <th className='text-center'>Price</th>
                              <th className='text-center'></th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              allOrders?.map(el => (
                                <tr className='' key={''}>
                                  <td className='product__breif__detail d-flex '>
                                    <i className="bi bi-trash-fill" onClick={() => handleDeleteOrder(el?.id)}></i>
                                    <div className="product__img">
                                      <img src={testImg} alt="product" />
                                    </div>
                                    <div className="product__info">
                                      <h2>
                                        {el?.type}
                                      </h2>
                                      <p>
                                        {el?.code}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="product__created">
                                      {
                                        loginType === 'user' ?
                                          el?.company_name
                                          :
                                          el?.user_name
                                      }
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`product__statue `}>
                                      {el?.created_at}
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`product__statue ${el?.order_status}`}>
                                      {el?.order_status}
                                    </div>
                                  </td>
                                  <td>
                                    {el?.currency_symbol}{el?.total_price}
                                  </td>
                                  <td>
                                    {
                                      el?.order_status !== 'Rejected' &&
                                      <NavLink className={'nav-link'} to={`/profile/orders/${el?.id}`}>
                                        <i className="bi bi-eye-fill showProd"></i>
                                      </NavLink>
                                    }
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
                          No Orders Yet
                        </div>
                      </div>
                  }
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
