import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { getYoutubeVideoId } from '../../functions/getYoutubeVideo';
import { useDashBoardMediaStore } from '../../store/DashBoardMedia';
import Cookies from 'js-cookie';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyMedia({ token }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

    // Destructure states and actions from the store
    const {
        loading,
        mediaItems,
        unAuth,
        totalPages,
        currentPage,
        activeRole,
        fetchMedias,
        handleRoleChange,
        setCurrentPage,
        deleteMediaItem,
        setFilteration,
        setActiveRole,
    } = useDashBoardMediaStore();

    // Fetch initial media items based on activeRole and currentPage
    useEffect(() => {
        if (activeRole === 'All') {
            fetchMedias(token, loginType, currentPage);
        } else {
            handleRoleChange(activeRole, token, loginType);
        }
    }, [token, loginType, currentPage, activeRole]);

    // Handle pagination changes
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Handle media item deletion
    const handleDeleteMedia = (id) => {
        deleteMediaItem(token, loginType, id);
    };

    return (
        <>
            {loading ? (
                <MyNewLoader />
            ) : (
                <div className="dashboard__handler d-flex">
                    <MyNewSidebarDash />
                    <div className="main__content container">
                        <MainContentHeader currentUserLogin={currentUserLogin} search={false} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className="content__view__handler">
                                <ContentViewHeader title={t('DashboardMediaPage.headerPageText')} />
                                <AddNewItem link="/profile/media/addNewItem" />
                                
                                {/* Role Selection Buttons */}
                                {loginType === 'employee' && (
                                    <div className="my__roles__actions mb-5 ps-0 ms-0">
                                        <button
                                            className={`${Lang === 'ar' ? 'def__btn_RTL' :'def__btn'} px-5 ${activeRole === 'All' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                setFilteration({ type: '' });
                                                setActiveRole('All');
                                            }}
                                        >
                                            {t('DashboardMediaPage.allFilterItem')}
                                        </button>
                                        <button
                                            className={`${Lang === 'ar' ? 'def__btn_RTL' :'def__btn'} meddle_btn px-5 ${activeRole === 'image' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                setFilteration({ type: 'image' });
                                                setActiveRole('image');
                                            }}
                                        >
                                            {t('DashboardMediaPage.imageFilterItem')}
                                        </button>
                                        <button
                                            className={`${Lang === 'ar' ? 'cust__btn_RTL' :'cust__btn'} px-5 ${activeRole === 'link' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                setFilteration({ type: 'link' });
                                                setActiveRole('link');
                                            }}
                                        >
                                            {t('DashboardMediaPage.videoFilterItem')}
                                        </button>
                                    </div>
                                )}
                                
                                {/* Media Items Display */}
                                <div className="content__card__list">
                                    {mediaItems.length !== 0 ? (
                                        <div className="row">
                                            {mediaItems.map((el) => (
                                                <div className="col-lg-6 d-flex justify-content-center mb-3" key={el?.id}>
                                                    <div className="card__item">
                                                        <div className="card__image">
                                                            {el?.type !== 'link' ? (
                                                                <img src={el?.link} alt={el?.id} />
                                                            ) : (
                                                                <iframe
                                                                    width="289px"
                                                                    height="191px"
                                                                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(el?.link)}`}
                                                                    title="YouTube video"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            )}
                                                        </div>
                                                        <div className="card__btns d-flex">
                                                            <button
                                                                onClick={() => handleDeleteMedia(el?.id)}
                                                                className={`${Lang === 'ar' ? 'btn__D_RTL' : 'btn__D'}`}
                                                            >
                                                                {t('DashboardAllServicePage.catalogDeleteBtn')}
                                                            </button>
                                                            <button
                                                                className={`${Lang === 'ar' ? 'btn__E_RTL' : 'btn__E'}`}
                                                                onClick={() => navigate(`/profile/media/edit-item/${el?.id}`)}
                                                            >
                                                                {t('DashboardAllServicePage.catalogEditBtn')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Pagination */}
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
                                            <div className="col-12 text-danger fs-5">{t('DashboardMediaPage.noMediaItemsText')}</div>
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
