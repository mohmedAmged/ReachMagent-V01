import React, { useEffect, useState } from 'react'
import './quotationTableSec.css'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';

export default function QuotationTableSec({ token }) {
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);

    const fetchAllQuotations = async () => {
        const slug = loginType === 'user' ? `${loginType}/my-quotations`
            :
            `${loginType}/all-quotations`
        try {
            const response = await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.quotations);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchAllQuotations();
    }, [loginType, token]);

    return (
        <div className='quotationTable__handler content__view__handler'>
            <ContentViewHeader title={'All Customers'} />
            <div className="quotationTable__content">
                <Table responsive>
                    <thead>
                        <tr className='table__default__header'>
                            <th>Request</th>
                            <th>Country</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newData?.map((row, index) => (
                            <tr className='' key={index}>
                                <td>{row?.area === 'N/A' ? (loginType === 'user' ? row?.company_name : row?.user_name) : row?.area}</td>
                                <td >{row?.country === 'N/A' ? 'No Shipping' : row?.country}</td>
                                <td className='adjust__flex'>
                                    <button className={`${ row?.user_status } table__statu__btn`}>
                                        {row?.user_status}
                                    </button>
                                    <NavLink className={'nav-link'}  onClick={() => {
                                    scrollToTop();
                                }} to={`/profile/quotations/${row?.id}`}>
                                        {
                                            row?.user_status === 'Pending' &&
                                            <button className={`table__statu__btn show__btn`}>
                                                <span>show</span>
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        }
                                    </NavLink>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
