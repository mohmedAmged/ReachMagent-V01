import React, { useEffect, useState } from 'react'
import './quotationTableSec.css'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
export default function QuotationTableSec({ token }) {
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])

    const fetchAllQuotations = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-quotations?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.quotations);
        } catch (error) {
            setNewdata(error?.response?.data.message);
        }
    };
    useEffect(() => {
        fetchAllQuotations();
    }, [loginType, token]);

    console.log(loginType);
    console.log(token);

    console.log(newData);

    const tableData = [
        { request: '15 AC Units include shipping', country: 'United States', status: 'accept', statusStyle: 'accept' },
        { request: '12 Central AC', country: 'Jordan', status: 'Pending', statusStyle: 'pending' },
        { request: 'Spare part #23', country: 'Jordan', status: 'Submitted', statusStyle: 'submitted' },
    ];
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
                        {newData.map((row, index) => (
                            <tr className='' key={index}>
                                <td>{row?.area}</td>
                                <td >{row?.country}</td>
                                <td className='adjust__flex'>
                                    <button className={`${row?.user_status} table__statu__btn`}>
                                        {row?.user_status}
                                    </button>
                                    <button className={`table__statu__btn show__btn`}>
                                        <span>show</span>
                                        <i className="bi bi-eye"></i>

                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
