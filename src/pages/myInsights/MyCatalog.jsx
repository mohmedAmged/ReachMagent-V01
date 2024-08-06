import React, { useEffect, useState } from 'react'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import './catalogContent.css'
import cardImg from '../../assets/card-images/Rectangle 4705.png'
import { NavLink } from 'react-router-dom'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import { useQuery } from 'react-query'
import { getDataFromAPI } from '../../functions/fetchAPI'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
export default function MyCatalog({ token }) {
  const cardListItems = [
    {
      title: "Mirror 100x80 cm",
      image: cardImg,
      id: 1
    },
    {
      title: "Mirror 100x80 cm",
      image: cardImg,
      id: 1
    },
    {
      title: "Mirror 100x80 cm",
      image: cardImg,
      id: 1
    },

  ]
  const loginType = localStorage.getItem('loginType')
  const [newData, setNewdata] = useState([])
  useEffect(() => {
    (async () => {
      await axios.get(`${baseURL}/${loginType}/all-catalogs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response=>{
        setNewdata(response?.data)
      }).catch(error=>{
        setNewdata(error?.response?.data.message)
      })
      
    })()
  }, [])
  console.log(loginType);
  console.log(token);

  console.log(newData);

  return (
    <>
      <div className='dashboard__handler d-flex'>
        <MyNewSidebarDash />
        <div className='main__content container'>
          <MainContentHeader />
          <div className='content__view__handler'>
            <ContentViewHeader title={'Catalog'} />
            <div className="content__card__list">
              <div className="row">
                {
                  cardListItems?.map((el) => {
                    return (
                      <div className='col-lg-6 mb-3' key={el.id}>
                        <div className="card__item">
                          <div className="card__image">
                            <img src={el.image} alt={el.title} />
                          </div>
                          <div className="card__name">
                            <h3>
                              {el.title}
                            </h3>
                          </div>
                          <div className="card__btns d-flex">
                            <>
                              <button className='btn__D'>
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
            </div>
            <div className='addNewItem__btn'>
              <button>
                <NavLink to='/profile/catalog/addNewItem' className='nav-link'>
                  Add New Item
                </NavLink>
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
