import React, { useEffect, useState } from 'react'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import './catalogContent.css'
import { NavLink } from 'react-router-dom'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import { scrollToTop } from '../../functions/scrollToTop'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import Cookies from 'js-cookie';

export default function MyCatalog({ token }) {
  const [loading, setLoading] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [newData, setNewdata] = useState([]);
  const fetchCatalogs = async () => {
    try {
      const response = await axios.get(`${baseURL}/${loginType}/all-catalogs?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewdata(response?.data?.data?.catalogs);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    }
  };
  const [unAuth, setUnAuth] = useState(false);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
        const newShape = JSON.parse(cookiesData);
        setCurrentUserLogin(newShape);
    }
}, [Cookies.get('currentLoginedData'), currentUserLogin]);
  useEffect(() => {
    fetchCatalogs();
  }, [loginType, token]);

  const handleDeleteThisCatalog = async (id) => {
      await axios?.delete(`${baseURL}/${loginType}/delete-catalog/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        toast.success(response?.data?.message);
        fetchCatalogs();
      })
      .catch(error => {
        toast.error(error?.response?.data?.message);
      })
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);

  return (
    <>
      {
        loading ?
          <MyLoader />
          :
          <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
              <MainContentHeader currentUserLogin={currentUserLogin} />
              {
                unAuth ?
                  <UnAuthSec />
                  :
                  <div className='content__view__handler'>
                    <ContentViewHeader title={'Catalog'} />
                    <div className="content__card__list">
                      {
                        newData?.length !== 0 ?
                          <div className="row">
                            {
                              newData?.map((el) => {
                                return (
                                  <div className='col-lg-6 d-flex justify-content-center mb-3' key={el?.id}>
                                    <div className="card__item">
                                      <div className="card__image">
                                        <img src={el?.media[0]?.image} alt={el?.title} />
                                      </div>
                                      <div className="card__name">
                                        <h3>
                                          {el?.title}
                                        </h3>
                                      </div>
                                      <div className="card__btns d-flex">
                                        <>
                                          <button onClick={() => handleDeleteThisCatalog(el?.id)} className='btn__D'>
                                            Delete
                                          </button>
                                        </>
                                        <>
                                          <button className='btn__E'>
                                            Edit
                                          </button>
                                        </>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                          :
                          <div className='row'>
                            <div className="col-12 text-danger fs-5">
                              No Catalog Items Yet
                            </div>
                          </div>
                      }

                    </div>
                    <div className='addNewItem__btn'>
                      <NavLink
                        onClick={() => {
                          scrollToTop();
                        }}
                        to='/profile/catalog/addNewItem' className='nav-link'>
                        <button >
                          Add New Item
                        </button>
                      </NavLink>

                    </div>
                  </div>
              }
            </div>
          </div>
      }
    </>
  )
}
