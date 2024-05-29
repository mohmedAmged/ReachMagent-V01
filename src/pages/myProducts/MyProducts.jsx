import React from 'react'
import ContentViewHeader from '../../components/contentViewHeader/ContentViewHeader'
import { NavLink } from 'react-router-dom'
import { Table } from 'react-bootstrap';
import chairImg from '../../assets/productsImages/chair.png'
import './myProducts.css'
export default function MyProducts() {
  const productsData = [
    {
      prodImage: chairImg,
      title: 'Blue Chair',
      disc: 'Made of wood and steel',
      createdIn: '05 May 2024',
      status: 'in stock',
      style: 'in-stock',
      amount: '$250'

    },
    {
      prodImage: chairImg,
      title: 'Blue Chair',
      disc: 'Made of wood and steel',
      createdIn: '05 May 2024',
      status: 'out of stock',
      style: 'out-stock',
      amount: '$250'
    },
    {
      prodImage: chairImg,
      title: 'Blue Chair',
      disc: 'Made of wood and steel',
      createdIn: '05 May 2024',
      status: 'in stock',
      style: 'in-stock',
      amount: '$250'
    },
    {
      prodImage: chairImg,
      title: 'Blue Chair',
      disc: 'Made of wood and steel',
      createdIn: '05 May 2024',
      status: 'in stock',
      style: 'in-stock',
      amount: '$250'
    },
  ];
  return (
    <div className='myProducts__handler content__view__handler'>
      <ContentViewHeader title={'E-Commerce Products'} />
      <div className='addNewItem__btn text-lg-end'>
        <button>
          <NavLink to='/catalog/addNewItem' className='nav-link'>
            Add New Item
          </NavLink>
        </button>
      </div>
      <div className="productTable__content">
            <Table responsive>
                <thead>
                    <tr className='table__default__header'>
                        <th>
                          <input type="checkbox" />
                          product
                        </th>
                        <th className='text-center'>Created in</th>
                        <th className='text-center'>Status</th>
                        <th className='text-center'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {productsData.map((row, index) => (
                        <tr className='' key={index}>
                            <td className='product__breif__detail d-flex '>
                                <input type="checkbox" />
                                <div className="product__img">
                                  <img src={row.prodImage} alt="product" />
                                </div>
                                <div className="product__info">
                                    <h2>
                                      {row.title}
                                    </h2>
                                    <p>
                                      {row.disc}
                                    </p>
                                </div>
                            </td>
                            <td>
                              <div className="product__created">
                                {row.createdIn}
                              </div>
                            </td>
                            <td>
                                <div className={`product__statue ${row.style}`}>
                                  {row.status}
                                </div>
                            </td>
                            <td>
                              {row.amount}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
      </div>
    </div>
  )
}
