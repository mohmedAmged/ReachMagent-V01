import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { useDashBoardBookedAppointmentsStore } from '../../store/DashBoardBookedAppointMents';
import { NavLink } from 'react-router-dom';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';

export default function MyBookedAppointments({ token }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const cookiesData = Cookies.get('currentLoginedData');
    const [visibleRowId, setVisibleRowId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showViewLinkModal, setShowViewLinkModal] = useState(false); 
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [meetingLink, setMeetingLink] = useState('');
    const [modalLink, setModalLink] = useState('');
    const toggleOptions = (rowId) => {
        setVisibleRowId(prevId => (prevId === rowId ? null : rowId));
    };
    const optionsRef = useRef(null);
    const modalRef = useRef(null);
    const viewLinkModalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target) &&
                (!modalRef.current || !modalRef.current.contains(event.target)) &&
                (!viewLinkModalRef.current || !viewLinkModalRef.current.contains(event.target))
            ) {
                setVisibleRowId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const {
        loading,
        appointments,
        unAuth,
        totalPages,
        currentPage,
        filteration,
        activeRole,
        fetchBookedAppointments,
        deleteAppointment,
        updateAppointmentStatus,
        setCurrentPage,
        setFilteration,
        setActiveRole,
    } = useDashBoardBookedAppointmentsStore();

    useEffect(() => {
        if (!currentUserLogin) setCurrentUserLogin(JSON.parse(cookiesData));
    }, [cookiesData, currentUserLogin]);

    useEffect(() => {
        fetchBookedAppointments(token, loginType, currentPage);
    }, [token, loginType, currentPage]);

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const handleFilterChange = (filter) => setFilteration(filter, token, loginType);

    const handleDeleteAppointment = (id) => deleteAppointment(token, loginType, id);

    const handleAcceptAppointment = (id) => {
        setSelectedAppointmentId(id);
        setShowModal(true);
    };

    const handleSubmitMeetingLink = () => {
        // Pass the meeting link along with the status
        updateAppointmentStatus(token, loginType, selectedAppointmentId, 'accepted', meetingLink);
        setShowModal(false);
        setMeetingLink('');
        setVisibleRowId(null);
    };

    const handleShowLinkModal = (link) => {
        setModalLink(link); 
        setShowViewLinkModal(true);
    };
    console.log(appointments);
    
    return (
        <>
            {loading ? (
                <MyNewLoader />
            ) : (
                <div className='dashboard__handler d-flex'>
                    <MyNewSidebarDash />
                    <div className='main__content container'>
                        <MainContentHeader
                            currentUserLogin={currentUserLogin}
                            search={loginType !== 'user'}
                            filteration={filteration}
                            setFilteration={handleFilterChange}
                            name='date'
                            placeholder={t('DashboardBookedAppointementsPage.filterInputHeaderPlaceholder')}
                            inputType='date'
                        />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className='content__view__handler'>
                                <ContentViewHeader title={loginType !== 'user' ? `${t('DashboardBookedAppointementsPage.mainHeaderCompany')}` : `${t('DashboardBookedAppointementsPage.mainHeaderUser')}`} />
                                {/* {loginType === 'employee' && (
                                    <div className="my__roles__actions my-4 ps-0 ms-0">
                                        <button className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => setActiveRole('All', token, loginType)}>
                                            All
                                        </button>
                                        <button className={`def__btn meddle_btn px-5 ${activeRole === 'reservedByOthers' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => setActiveRole('reservedByOthers', token, loginType)}>
                                            Reserved By Others
                                        </button>
                                        <button className={`cust__btn px-5 ${activeRole === 'reservedByUs' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => setActiveRole('reservedByUs', token, loginType)}>
                                            Reserved By Us
                                        </button>
                                    </div>
                                )} */}
                                {
                                    loginType === 'employee' &&
                                    <div className="my__roles__actions my-4 ps-0 ms-0">
                                        <button
                                            className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                                            onClick={() => {
                                                // fetchBookedAppointments();
                                                // setFilteration({ ...filteration, type: '' })
                                                setActiveRole('All', token, loginType)
                                            }}
                                        >
                                            {t('DashboardBookedAppointementsPage.filterCompanyItemAll')}
                                        </button>
                                        <button
                                            className={`def__btn meddle_btn px-5 ${activeRole === 'reservedByOthers' ? 'rolesActiveBtn' : ''}`}
                                            style={{ borderBottomLeftRadius: '0px', borderTopLeftRadius: '0px' }}
                                            onClick={() => {
                                                // setFilteration({ ...filteration, type: 'reservedByOthers' })
                                                setActiveRole('reservedByOthers', token, loginType)
                                            }}
                                        >
                                            {t('DashboardBookedAppointementsPage.filterCompanyItemReservedOther')}
                                        </button>
                                        <button
                                            className={`cust__btn px-5 ${activeRole === 'reservedByUs' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                // setFilteration({ ...filteration, type: 'reservedByUs' })
                                                setActiveRole('reservedByUs', token, loginType)
                                            }}
                                        >
                                            {t('DashboardBookedAppointementsPage.filterCompanyItemReservedUs')}
                                        </button>
                                    </div>
                                }
                                {appointments.length ? (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="productTable__content quotationTable__NewStyle">
    <Table responsive>
        <thead>
            <tr className='table__default__header'>
                <th>{t('DashboardBookedAppointementsPage.tableHeadItemFrom')}</th>
                <th>{t('DashboardBookedAppointementsPage.tableHeadItemTo')}</th>
                <th className='text-center'>{t('DashboardBookedAppointementsPage.tableHeadItemReason')}</th>
                <th className='text-center'>{t('DashboardBookedAppointementsPage.tableHeadItemDate')}</th>
                <th className='text-center'>{t('DashboardBookedAppointementsPage.tableHeadItemTime')}</th>
                <th className='text-center'>{t('DashboardBookedAppointementsPage.tableHeadItemLink')}</th>
                <th className='text-center'>{t('DashboardBookedAppointementsPage.tableHeadItemStatus')}</th>
                {loginType === 'employee' && <th className='text-center'>{t('DashboardBookedAppointementsPage.tableHeadItemActions')}</th>}
            </tr>
        </thead>
        <tbody>
            {appointments.map((row, index) => (
                <tr key={index}>
                    <td className='text-start' style={{ fontSize: '12px' }}>
                        <div className={`product__statue text-start`}>
                            <p>
                                {row?.booked_by_name}
                            </p>
                        </div>
                    </td>
                    <td className='text-start' style={{ fontSize: '12px' }}>
                        <div className="product__created">
                            <p>
                                {row?.company_name || row?.companyName}
                            </p>
                        </div>
                    </td>
                    <td style={{ fontSize: '12px' }}>
                        <div className='bookedAppointementReason'>
                            {row?.reason}
                        </div>
                    </td>
                    <td>{row?.date}</td>
                    <td>{row?.time}</td>
                    {
                        row?.link !== 'N/A' ?
                        <td>
                            <i 
                            className="bi bi-box-arrow-up-right"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleShowLinkModal(row?.link)}
                            >
                            </i>
                        </td>
                        :
                        <td>{t('DashboardBookedAppointementsPage.tableBodyNoLink')}</td>
                    }
                    <Modal show={showViewLinkModal} onHide={() => setShowViewLinkModal(false)}>
                        <div ref={viewLinkModalRef}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t('DashboardBookedAppointementsPage.tableModalUserHead')}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <NavLink to={modalLink} target="_blank">
                                    {t('DashboardBookedAppointementsPage.tableModalUserOpenBtn')}
                                </NavLink>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowViewLinkModal(false)}>
                                    {t('DashboardBookedAppointementsPage.tableModalUserCloseBtn')}
                                </Button>
                            </Modal.Footer>
                        </div>
                    </Modal>
                    <td><span className={`bookedAppointementStatus ${row?.status}`}>{row?.status}</span></td>
                    {
                        loginType === 'employee' &&
                        <td style={{ fontSize: '12px' }}>
                            {
                                row?.type === 'reservedByOthers' ?
                                    <div className='position-relative actions'>
                                        <i className="bi bi-trash-fill" onClick={() => handleDeleteAppointment(row?.id)}></i>
                                        <i style={{ cursor: 'pointer' }} className={`bi bi-three-dots-vertical ${Lang === 'ar' ? 'me-2' : 'ms-2'}`} onClick={() => toggleOptions(row?.id)}></i>
                                        {visibleRowId === row?.id && (
                                            <div className="options-box" ref={optionsRef}>
                                                <p className="option mb-1 text-danger" 
                                                onClick={() => {
                                                    updateAppointmentStatus(token, loginType, row?.id, 'rejected');
                                                    setVisibleRowId(null);
                                                }}
                                                >
                                                    {t('DashboardBookedAppointementsPage.tableBodyRejectAction')}</p>
                                                <p className=" option mb-0 text-success" 
                                                onClick={() =>
                                                    handleAcceptAppointment(
                                                        row?.id
                                                    )
                                                }
                                                >
                                                    {t('DashboardBookedAppointementsPage.tableBodyAcceptAction')}
                                                </p>
                                                <Modal show={showModal} onHide={() => setShowModal(false)}>
    <div ref={modalRef}>
        <Modal.Header closeButton>
            <Modal.Title>{t('DashboardBookedAppointementsPage.tableModalEmployeeHead')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>{t('DashboardBookedAppointementsPage.tableModalEmployeeLabel')}</Form.Label>
                    <Form.Control
                        type="text"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder={t('DashboardBookedAppointementsPage.tableModalEmployeeinputPlaceholder')}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                {t('DashboardBookedAppointementsPage.tableModalEmployeeCancelBtn')}
            </Button>
            <Button variant="primary" onClick={handleSubmitMeetingLink}>
                {t('DashboardBookedAppointementsPage.tableModalEmployeeSubmitBtn')}
            </Button>
        </Modal.Footer>
    </div>
</Modal>
                                            </div>
                                        )}
                                    </div>
                                    :
                                    `${t('DashboardBookedAppointementsPage.tableBodyNoActionText')}`
                            }

                        </td>
                    }
                </tr>
            ))}
        </tbody>
    </Table>
                                                {totalPages > 1 && (
                                                    <div className="d-flex justify-content-center align-items-center mt-4">
                                                        <button className="paginationBtn me-2" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                                                            <i className="bi bi-caret-left-fill"></i>
                                                        </button>
                                                        <span className='currentPagePagination'>{currentPage}</span>
                                                        <button className="paginationBtn ms-2" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                                                            <i className="bi bi-caret-right-fill"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row'>
                                        <div className="col-12 my-5 text-danger fs-5">
                                            {t('DashboardBookedAppointementsPage.tableBodyNoBookedText')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div >
            )
            }
        </>
    );
}
//
