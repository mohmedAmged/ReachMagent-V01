import React, { useEffect } from 'react';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import './catalogContent.css';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDashBoardCatalogStore } from '../../store/DashBoardCatalog';
import Cookies from 'js-cookie';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyCatalog({ token }) {
  const { t } = useTranslation();
  const loginType = localStorage.getItem('loginType');
  const cookiesData = Cookies.get("currentLoginedData");
  const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;
  const navigate = useNavigate();
  const {
    loading,
    catalogs,
    unAuth,
    totalPages,
    currentPage,
    filterCatalog,
    fetchCatalogs,
    filterCatalogs,
    deleteCatalog,
    setCurrentPage,
    setFilterCatalog,
  } = useDashBoardCatalogStore();

  useEffect(() => {
    if (filterCatalog.title.length >= 3 || filterCatalog.status) {
      filterCatalogs(token, loginType, currentPage, filterCatalog);
    } else {
      fetchCatalogs(token, loginType, currentPage);
    }
  }, [token, loginType, currentPage, filterCatalog, filterCatalogs, fetchCatalogs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteThisCatalog = (id) => {
    deleteCatalog(token, loginType, id);
  };
console.log(catalogs);

  return (
    <>
      {loading ? (
        <MyNewLoader />
      ) : (
        <div className="dashboard__handler d-flex">
          <MyNewSidebarDash />
          <div className="main__content container">
            <MainContentHeader
              search
              filteration={filterCatalog}
              setFilteration={setFilterCatalog}
              name="title"
              currentUserLogin={currentUserLogin}
              placeholder={t('DashboardAllCatalogPage.headerInputPlaceholder')}
            />
            {unAuth ? (
              <UnAuthSec />
            ) : (
              <div className="content__view__handler">
                <ContentViewHeader title={t('DashboardAllCatalogPage.headerPageText')} />
                <AddNewItem link="/profile/catalog/addNewItem" />
                <div className="content__card__list">
                  {catalogs.length ? (
                    <div className="row">
                      {catalogs.map((el) => (
                        <div className="col-lg-6 d-flex justify-content-center mb-3" key={el?.id}>
                          <div className="card__item">
                            <div className="card__image">
                              <img src={el?.media[0]?.image} alt={el?.title} />
                            </div>
                            <NavLink className="nav-link" to={`/profile/catalogs/show-one/${el?.slug}`}>
                              <div className="card__name">
                                <h3>
                                  {el?.title} <i className="bi bi-box-arrow-in-up-right"></i>
                                </h3>
                                <p>({el?.code})</p>
                              </div>
                            </NavLink>
                            <div className="card__btns d-flex">
                              <button onClick={() => handleDeleteThisCatalog(el?.id)} className={`${Lang ===  'ar' ? 'btn__D_RTL' : 'btn__D'}`}>
                                {t('DashboardAllCatalogPage.catalogDeleteBtn')}
                              </button>
                              <button className={`btn__E ${Lang ===  'ar' ? 'btn__E_RTL' : 'btn__E'}`} onClick={() => navigate(`/profile/catalog/edit-item/${el?.slug}`)}>
                                {t('DashboardAllCatalogPage.catalogEditBtn')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {totalPages > 1 && (
                        <div className="col-12 d-flex justify-content-center align-items-center mt-4">
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
                      <div className="col-12 text-danger fs-5">{t('DashboardAllCatalogPage.noCatalogItemsText')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
