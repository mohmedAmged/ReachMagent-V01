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
import './myOrderStyle.css'
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';
export default function MyOrders({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
  
  const [activeRole, setActiveRole] = useState('Sell');
  const loginType = localStorage.getItem('loginType');
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllOrders = async (params) => {
    const slug = loginType === 'user' ? 'all-quotation-orders' : 'quotation-orders';
    await axios.get(`${baseURL}/${loginType}/${slug}${params ? `${params}&` : '?'}page=${currentPage}?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Locale": Lang
      }
    })
      .then(response => {
        setAllOrders(response?.data?.data?.quotationOrders);
        setTotalPages(response?.data?.data?.meta?.last_page);
      })
      .catch(error => {
        console.log(`${baseURL}/${loginType}/${slug}${params ? `${params}&` : '?'}page=${currentPage}?t=${new Date().getTime()}`);
        
        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message || 'Something Went Wrong');
      })
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    };
  };

  useEffect(() => {
    getAllOrders();
  }, [currentPage]);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  // const handleDeleteOrder = async (id) => {
  //   await axios.post(`${baseURL}/${loginType}/reject-order?t=${new Date().getTime()}`, {
  //     order_id: `${id}`
  //   }, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //     .then(response => {
  //       toast.success(response?.data?.message || 'Deleted Successfully!');
  //       getAllOrders(currentPage);
  //     })
  //     .catch(error => {
  //       toast.error(error?.response?.data?.message || 'Something Went Wrong!');
  //     })
  // };
console.log(allOrders);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);
  return (
    <>
    {
      loading ? 
      <MyNewLoader />
      :
      <div className='dashboard__handler d-flex'>
        <MyNewSidebarDash />
        <div className='main__content container'>
          <MainContentHeader currentUserLogin={currentUserLogin} />
          <div className='myProducts__handler quotationTable__handler content__view__handler'>
            {
              loginType === 'employee' &&
              <div className="my__roles__actions mb-5 ps-0 ms-0">
                {/* <button
                  className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                  onClick={() =>{
                    setActiveRole('All');
                    getAllOrders('');
                  } }
                >
                  All
                </button> */}
                <button
                  className={`${Lang === 'ar' ? 'def__btn_RTL' : 'def__btn'} px-5 ${activeRole === 'Sell' ? 'rolesActiveBtn' : ''}`}
                  onClick={() =>{
                    setActiveRole('Sell');
                    getAllOrders('?q=sell');
                  } }
                >
                  {t('DashboardQuotationOrdersPage.sellFilterItem')}
                </button>
                <button
                  className={`${Lang === 'ar' ? 'cust__btn_RTL' : 'cust__btn'} px-5 ${activeRole === 'Buy' ? 'rolesActiveBtn' : ''}`}
                  onClick={() =>{
                    setActiveRole('Buy');
                    getAllOrders('?q=buy');
                  } }
                >
                  {t('DashboardQuotationOrdersPage.buyFilterItem')}
                </button>
              </div>
            }
            <ContentViewHeader title={t('DashboardQuotationOrdersPage.headerPageText')} />
            {
              unAuth ?
                <UnAuthSec />
                :
                <div className="productTable__content">
                  {
                    allOrders?.length > 0 ?
                      <>
                        {
                          loginType === 'employee' ?
                            <Table responsive >
                              <thead>
                                <tr className='table__default__header'>
                                  <th>
                                    {t('DashboardQuotationOrdersPage.tableHeadOrderInfo')}
                                  </th>
                                  <th className='text-center'>{t('DashboardQuotationOrdersPage.tableHeadDate')}</th>
                                  <th className='text-center'>{t('DashboardQuotationOrdersPage.tableHeadRquestedBy')}</th>
                                  <th className='text-center'>{t('DashboardQuotationOrdersPage.tableHeadStatus')}</th>
                                  <th className='text-center'>{t('DashboardQuotationOrdersPage.tableHeadPrice')}</th>
                                  <th className='text-center'></th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  allOrders?.map(el => (
                                    <tr className='' key={''}>
                                      <td className='product__breif__detail d-flex '>
                                        <div className="product__info m-0">
                                          <p>
                                            {el?.code}
                                          </p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className={`product__statue `}>
                                          {el?.created_at}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="product__created">
                                          {
                                              el?.order_by_name
                                          }
                                        </div>
                                      </td>
                                      
                                      <td>
                                        <div className={`product__statue ${el?.order_status}`}>
                                          {el?.order_status_translated}
                                        </div>
                                      </td>
                                      <td>
                                        {el?.currency_symbol}{el?.total_price}
                                      </td>
                                      <td>
                                        {
                                          el?.order_status !== 'Rejected' &&
                                          <NavLink className={'nav-link'} to={`/profile/quotation-orders/${el?.code}`}>
                                            <i className="bi bi-eye-fill showProd"></i>
                                          </NavLink>
                                        }
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </Table>
                            :
                            <div className="ordersLayoutUser_handler">
                              <div className="row">
                                {
                                  allOrders?.map((el, idx) => (
                                    <div key={idx} className="col-12">
                                      <div className="order_item_handler">
                                        <div className="order_item_header">
                                          <p className='card_title'>
                                            {t('DashboardQuotationOrdersPage.formInputCreatedAt')}<span> ({el?.created_at})</span>
                                          </p>
                                          {/* <i className="bi bi-trash-fill" onClick={() => handleDeleteOrder(el?.id)}></i> */}
                                        </div>
                                        <div className="order_item_details row">
                                          <div className="col-lg-2 col-md-2 col-sm-12 image_handler">
                                            <img src={testImg} alt="shop-icon" />
                                          </div>
                                          <div className="col-lg-6 col-md-6 col-sm-12">
                                            <div className="order_details_info">
                                              <p>
                                                {t('DashboardQuotationOrdersPage.formInputOrderfrom')}:<span> {el?.company_name}</span>
                                              </p>
                                              <p>
                                                {t('DashboardQuotationOrdersPage.formInputOrderstatus')} <span className={`order__statue ${el?.order_status}`}> {el?.order_status}</span>
                                              </p>
                                              <p>
                                                {t('DashboardQuotationOrdersPage.formInputSubTotal')}: <span> {el?.currency_symbol}{el?.sub_total}</span>
                                              </p>
                                              <p>
                                                {t('DashboardQuotationOrdersPage.formInputShippingPrice')}: <span> {el?.currency_symbol}{el?.shipping_price}</span>
                                              </p>
                                              <p>
                                                {t('DashboardQuotationOrdersPage.formInputTotal')}: <span> {el?.currency_symbol}{el?.total_price}</span>
                                              </p>
                                            </div>
                                          </div>
                                          <div className="col-lg-4 col-md-4 col-sm-12 orderId_handler">
                                            <NavLink className={'nav-link'} to={`/profile/quotation-orders/${el?.code}`}>
                                              <p>
                                                {t('DashboardQuotationOrdersPage.formInputOrderId')}: <span> #{el?.code}</span> <i className="bi bi-arrow-up-right"></i>
                                              </p>
                                            </NavLink>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                }

                              </div>
                            </div>
                        }
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
                          {t('DashboardQuotationOrdersPage.noOrdersItemsText')}
                        </div>
                      </div>
                  }
                </div>
            }
          </div>
        </div>
      </div>
    }
    </>
  )
}
