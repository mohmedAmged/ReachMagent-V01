import React from 'react'
import ContentViewHeader from '../../components/contentViewHeader/ContentViewHeader'
import './catalogContent.css'
import cardImg from '../../assets/card-images/Rectangle 4705.png'
import { NavLink } from 'react-router-dom'
export default function MyInsights() {
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
  return (
    <div className='content__view__handler'>
      <ContentViewHeader title={'Catalog'}/>
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
          <NavLink to='/catalog/addNewItem' className='nav-link'>
            Add New Item
          </NavLink>
        </button>
      </div>
    </div>
  )
}
