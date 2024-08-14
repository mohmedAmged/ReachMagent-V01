import React, { useEffect, useState } from 'react'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import { NavLink } from 'react-router-dom'
import { Table } from 'react-bootstrap';
import chairImg from '../../assets/productsImages/chair.png'
import './myProducts.css'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
export default function MyProducts({ token }) {
  const loginType = localStorage.getItem('loginType')
  const [newData, setNewdata] = useState([])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/${loginType}/all-products?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewdata(response?.data?.data?.products);
    } catch (error) {
      setNewdata(error?.response?.data.message);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [loginType, token]);

  console.log(newData);




  const handleDeleteThisProduct = async (id) => {
    try {
      const response = await axios?.delete(`${baseURL}/${loginType}/delete-product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(response?.data?.message);
      // Optionally update the state to remove the deleted item from the UI
      await fetchProducts()
      // setNewdata(newData?.filter(item => item?.id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  //   {
  //     prodImage: chairImg,
  //     title: 'Blue Chair',
  //     disc: 'Made of wood and steel',
  //     createdIn: '05 May 2024',
  //     status: 'in stock',
  //     style: 'in-stock',
  //     amount: '$250'

  //   },
  //   {
  //     prodImage: chairImg,
  //     title: 'Blue Chair',
  //     disc: 'Made of wood and steel',
  //     createdIn: '05 May 2024',
  //     status: 'out of stock',
  //     style: 'out-stock',
  //     amount: '$250'
  //   },
  //   {
  //     prodImage: chairImg,
  //     title: 'Blue Chair',
  //     disc: 'Made of wood and steel',
  //     createdIn: '05 May 2024',
  //     status: 'in stock',
  //     style: 'in-stock',
  //     amount: '$250'
  //   },
  //   {
  //     prodImage: chairImg,
  //     title: 'Blue Chair',
  //     disc: 'Made of wood and steel',
  //     createdIn: '05 May 2024',
  //     status: 'in stock',
  //     style: 'in-stock',
  //     amount: '$250'
  //   },
  // ];
  return (
    <>
      <div className='dashboard__handler d-flex'>
        <MyNewSidebarDash />
        <div className='main__content container'>
          <MainContentHeader />
          <div className='myProducts__handler content__view__handler'>
            <ContentViewHeader title={'E-Commerce Products'} />
            <div className='addNewItem__btn text-lg-end'>
              
                <NavLink onClick={() => {
                  scrollToTop();
                }}
                  to='/profile/products/addNewItem' className='nav-link'>
                    <button>
                      Add New Item
                    </button>
                </NavLink>
              
            </div>
            <div className="productTable__content">
              <Table responsive>
                <thead>
                  <tr className='table__default__header'>
                    <th>
                      {/* <input type="checkbox" /> */}
                      product
                    </th>
                    <th className='text-center'>Category</th>
                    <th className='text-center'>Status</th>
                    <th className='text-center'>Price</th>
                    <th className='text-center'>Show</th>
                  </tr>
                </thead>
                <tbody>
                  {newData?.map((row, index) => (
                    <tr className='' key={index}>
                      <td className='product__breif__detail d-flex '>
                        <i className="bi bi-trash-fill" onClick={() => handleDeleteThisProduct(row?.id)}></i>
                        <div className="product__img">
                          <img src={row?.productImages[0]?.image} alt="product" />
                        </div>
                        <div className="product__info">
                          <h2>
                            {row?.title}
                          </h2>
                          <p>
                            {row?.description}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="product__created">
                          {row?.category}
                        </div>
                      </td>
                      <td>
                        <div className={`product__statue ${row?.status}`}>
                          {row?.status}
                        </div>
                      </td>
                      <td>
                        ${row?.price}
                      </td>
                      <td>
                        <NavLink className={'nav-link'} to={`/profile/products/show-one/${row?.id}`}>
                        <i className="bi bi-eye-fill showProd"></i>
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
