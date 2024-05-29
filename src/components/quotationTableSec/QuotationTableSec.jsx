import React from 'react'
import './quotationTableSec.css'
import ContentViewHeader from '../contentViewHeader/ContentViewHeader'
import { Table } from 'react-bootstrap';
export default function QuotationTableSec() {
    const tableData = [
        { request: '15 AC Units include shipping', country: 'United States', status: 'accept',  statusStyle: 'accept'},
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
                        {tableData.map((row, index) => (
                            <tr className='' key={index}>
                                <td>{row.request}</td>
                                <td >{row.country}</td>
                                <td >
                                    <button className={`${row.statusStyle} table__statu__btn`}>
                                        {row.status}
                                    </button>
                                    <button className={`table__statu__btn ignore__btn`}>
                                        Ignore
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
