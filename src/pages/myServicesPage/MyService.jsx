import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { useDashBoardServiceStore } from '../../store/DashBoardServices';
import Cookies from 'js-cookie';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyService({ token }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

    const {
        loading,
        services,
        unAuth,
        totalPages,
        currentPage,
        filterService,
        fetchServices,
        filterServices,
        deleteService,
        setCurrentPage,
        setFilterService
    } = useDashBoardServiceStore();

    // Fetch services and apply filters
    useEffect(() => {
        if (filterService.title.length >= 3 || filterService.status) {
            filterServices(token, loginType, currentPage, filterService);
        } else {
            fetchServices(token, loginType, currentPage);
        }
    }, [token, loginType, currentPage, filterService, filterServices, fetchServices]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteThisService = (id) => {
        deleteService(token, loginType, id);
    };
console.log(services);

    return (
        <>
            {loading ? (
                <MyNewLoader />
            ) : (
                <div className="dashboard__handler d-flex">
                    <MyNewSidebarDash />
                    <div className="main__content container">
                        <MainContentHeader currentUserLogin={currentUserLogin} search={true} filteration={filterService} setFilteration={setFilterService} name="title" placeholder={t('DashboardAllServicePage.headerInputPlaceholder')} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className="content__view__handler">
                                <ContentViewHeader title={t('DashboardAllServicePage.headerPageText')} />
                                <AddNewItem link="/profile/service/addNewItem" />
                                <div className="content__card__list">
                                    {services.length !== 0 ? (
                                        <div className="row">
                                            {services.map((el) => (
                                                <div className="col-lg-6 d-flex justify-content-center mb-3" key={el?.id}>
                                                    <div className="card__item">
                                                        <div className="card__image">
                                                            <img src={el?.image} alt={el?.title} />
                                                        </div>
                                                        <NavLink className="nav-link" to={`/profile/service/show-one/${el?.slug}`}>
                                                            <div className="card__name">
                                                                <h3>
                                                                    {el?.title}
                                                                    <i className="bi bi-box-arrow-in-up-right"></i>
                                                                </h3>
                                                                <p>({el?.code})</p>
                                                            </div>
                                                        </NavLink>
                                                        <div className="card__btns d-flex">
                                                            <button onClick={() => handleDeleteThisService(el?.id)} className={`${Lang === 'ar' ? 'btn__D_RTL': 'btn__D'}`}>
                                                                {t('DashboardAllServicePage.catalogDeleteBtn')}
                                                            </button>
                                                            <button className={`${Lang === 'ar' ? 'btn__E_RTL': 'btn__E'}`} onClick={() => navigate(`/profile/service/edit-item/${el?.slug}`)}>
                                                                {t('DashboardAllServicePage.catalogEditBtn')}
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
                                            <div className="col-12 text-danger fs-5">{t('DashboardAllServicePage.noCatalogItemsText')}</div>
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
