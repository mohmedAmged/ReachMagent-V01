import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { useDashBoardAppointmentsStore } from '../../store/DashBoardAppointMents';
import Cookies from 'js-cookie';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';

export default function MyAppointments({ token }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType');
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;
    const {
        loading,
        appointments,
        unAuth,
        totalPages,
        currentPage,
        fetchAppointments,
        deleteAppointment,
        setCurrentPage,
    } = useDashBoardAppointmentsStore();

    useEffect(() => {
        fetchAppointments(token, loginType, currentPage);
    }, [token, loginType, currentPage, fetchAppointments]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteAppointment = (id) => {
        deleteAppointment(token, loginType, id);
    };

    return (
        <>
            {loading ? (
                <MyNewLoader />
            ) : (
                <div className='dashboard__handler d-flex'>
                    <MyNewSidebarDash />
                    <div className='main__content container'>
                        <MainContentHeader currentUserLogin={currentUserLogin} search={false} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className='content__view__handler'>
                                <ContentViewHeader title={t('DashboardAppointementPage.headerPageText')} />
                                <AddNewItem link={'/profile/appointments/addNewAppointment'} />
                                {appointments.length !== 0 ? (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="productTable__content">
                                                <Table responsive>
                                                    <thead>
                                                        <tr className='table__default__header'>
                                                            <th className='text-center'></th>
                                                            <th className='text-center'>{t('DashboardAppointementPage.tableHeadDateFrom')}</th>
                                                            <th className='text-center'>{t('DashboardAppointementPage.tableHeadDateTo')}</th>
                                                            <th className='text-center'>{t('DashboardAppointementPage.tableHeadAvailableFrom')}</th>
                                                            <th className='text-center'>{t('DashboardAppointementPage.tableHeadAvailableTo')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {appointments.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <i
                                                                        className="bi bi-trash-fill"
                                                                        onClick={() => handleDeleteAppointment(row?.id)}
                                                                    ></i>
                                                                </td>
                                                                <td>
                                                                    <div className="product__created">
                                                                        {row?.date_from}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="product__statue">
                                                                        {row?.date_to}
                                                                    </div>
                                                                </td>
                                                                <td>{row?.available_from}</td>
                                                                <td>{row?.available_to}</td>
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
                                                        <span className='currentPagePagination'>{currentPage}</span>
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
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row'>
                                        <div className="col-12 text-danger fs-5">
                                            {t('DashboardAppointementPage.NoAppointmentText')}
                                        </div>
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
