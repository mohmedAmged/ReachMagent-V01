import React, { useEffect, useState } from 'react'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import { NavLink } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import testImg from '../../assets/productImages/S0-unsplash-1_650d426ce6d6f.jpg'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import Cookies from 'js-cookie';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';

export default function MyOrders() {
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  return (
    <>
      <div className='dashboard__handler d-flex'>
        <MyNewSidebarDash />
        <div className='main__content container'>
          <MainContentHeader currentUserLogin={currentUserLogin} />
          <div className='myProducts__handler content__view__handler'>
            <ContentViewHeader title={'My Orders'} />
            {
              unAuth ?
                <UnAuthSec />
                :
                <div className="productTable__content">
                  <Table responsive>
                    <thead>
                      <tr className='table__default__header'>
                        <th>
                          product
                        </th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Date</th>
                        <th className='text-center'>Statue</th>
                        <th className='text-center'>Price</th>
                        <th className='text-center'></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='' key={''}>
                        <td className='product__breif__detail d-flex '>
                          <i className="bi bi-trash-fill" ></i>
                          <div className="product__img">
                            <img src={testImg} alt="product" />
                          </div>
                          <div className="product__info">
                            <h2>
                              order Name
                            </h2>
                            <p>
                              order code
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="product__created">
                            3
                          </div>
                        </td>
                        <td>
                          <div className={`product__statue `}>
                            05 May 2024
                          </div>
                        </td>
                        <td>
                          active
                        </td>
                        <td>
                          $200
                        </td>
                        <td>
                          <NavLink className={'nav-link'} to={`/profile/products/show-one/`}>
                            <i className="bi bi-eye-fill showProd"></i>
                          </NavLink>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
