import React, { useEffect, useState } from 'react'
import './quotationTableSec.css'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function QuotationTableSec({ token, setUnAuth }) {
    const [activeRole, setActiveRole] = useState('All');
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAllQuotations = async () => {
        const slug = loginType === 'user' ? `${loginType}/my-quotations`
            :
            `${loginType}/all-quotations`
        try {
            const response = await axios.get(`${baseURL}/${slug}?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.quotations);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchAllQuotations();
    }, [loginType, token]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    return (
        <div className='quotationTable__handler content__view__handler'>
            {
                loginType === 'employee' &&
                <div className="my__roles__actions mb-5 ps-0 ms-0">
                    <button
                        className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                        onClick={() => setActiveRole('All')}
                    >
                        All
                    </button>
                    <button
                        className={`def__btn meddle_btn px-5 ${activeRole === 'Sell' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('Sell')}
                    >
                        Sell
                    </button>
                    <button
                        className={`cust__btn px-5 ${activeRole === 'Buy' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('Buy')}
                    >
                        Buy
                    </button>
                </div>
            }
            <ContentViewHeader title={'All Quotations'} />
            <div className="quotationTable__content">
                <Table responsive>
                    <thead>
                        <tr className='table__default__header'>
                            <th>ID</th>
                            <th>Submission Date</th>
                            <th>Requested {loginType === 'user' ? 'From' : 'By'}</th>
                            <th>Request type</th>
                            <th>Country</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newData?.map((row, index) => (
                            <tr key={index}>
                                <td className='mx-0 px-0'>
                                    <NavLink to={`/profile/quotations/${row?.id}`} className={'nav-link fw-bold'}>
                                        {row?.code === 'N/A' ? '' : row?.code}
                                    </NavLink>
                                </td>
                                <td >{row?.created_at === 'N/A' ? 'InProgress' : row?.created_at}</td>
                                <td>{loginType === 'user' ? row?.company_name : row?.user_name}</td>
                                <td>{row?.type === 'N/A' ? '' : row?.type}</td>
                                <td >{row?.country === 'N/A' ? 'No Shipping' : row?.country}</td>
                                <td className='adjust__flex'>
                                    <button className={`${row?.user_status} table__statu__btn`}>
                                        {row?.user_status}
                                    </button>
                                </td>
                            </tr>
                        ))}
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
            </div>
        </div>
    )
}
