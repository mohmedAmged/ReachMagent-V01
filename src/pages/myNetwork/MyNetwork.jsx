import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { useNetworkStore } from '../../store/DashBoardNetwork';
import Cookies from 'js-cookie';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';

export default function MyNetwork({ token }) {
  const { t } = useTranslation();
  const loginType = localStorage.getItem('loginType');
  const cookiesData = Cookies.get("currentLoginedData");
  const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

  const {
    loading,
    networks,
    unAuth,
    totalPages,
    currentPage,
    fetchNetwork,
    deleteNetwork,
    setCurrentPage,
  } = useNetworkStore();

  useEffect(() => {
    fetchNetwork(token, loginType, currentPage);
  }, [token, loginType, currentPage, fetchNetwork]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteThisNetwork = (id) => {
    deleteNetwork(token, loginType, id);
  };

  return (
    <>
      {loading ? (
        <MyNewLoader />
      ) : (
        <div className="dashboard__handler d-flex">
          <MyNewSidebarDash />
          <div className="main__content container">
            <MainContentHeader currentUserLogin={currentUserLogin} />
            {unAuth ? (
              <UnAuthSec />
            ) : (
              <div className="myProducts__handler content__view__handler">
                <ContentViewHeader title={t('DashboardNetworkPage.headerPageText')} />
                <AddNewItem link="/profile/network/addNewItem" />
                {networks.length !== 0 ? (
                  <div className="productTable__content">
                    <Table responsive>
                      <thead>
                        <tr className="table__default__header">
                          <th>{t('DashboardNetworkPage.tableHeadLogo')}</th>
                          <th className="text-center">{t('DashboardNetworkPage.tableHeadName')}</th>
                          <th className="text-center">{t('DashboardNetworkPage.tableHeadLabel')}</th>
                          <th className="text-center">{t('DashboardNetworkPage.tableHeadEdit')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {networks.map((row, index) => (
                          <tr key={index}>
                            <td className="product__breif__detail d-flex">
                              <i
                                className="bi bi-trash-fill"
                                onClick={() => handleDeleteThisNetwork(row?.id)}
                              ></i>
                              <div className="product__img">
                                <img src={row?.logo} alt="network logo" />
                              </div>
                            </td>
                            <td>{row?.name}</td>
                            <td>
                              <div className="product__created">{row?.label}</div>
                            </td>
                            <td>
                              <NavLink className="nav-link" to={`/profile/network/edit-item/${row?.id}`}>
                                <i className="bi bi-pencil-square"></i>
                              </NavLink>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                          type="button"
                          className="paginationBtn me-2"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <i className="bi bi-caret-left-fill"></i>
                        </button>
                        <span className="currentPagePagination">{currentPage}</span>
                        <button
                          type="button"
                          className="paginationBtn ms-2"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <i className="bi bi-caret-right-fill"></i>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-12 text-danger fs-5">{t('DashboardNetworkPage.noNetworkItemsText')}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
