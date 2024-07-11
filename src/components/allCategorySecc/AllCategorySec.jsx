import React from 'react'
import './allCategorySec.css'
import HeaderSec from '../myHeaderSec/HeaderSec'
import furnitre from '../../assets/categoryIcons/furniture.png'
import kitchen from '../../assets/categoryIcons/kitchen.png'
import sport from '../../assets/categoryIcons/sports.png'
import lighting from '../../assets/categoryIcons/lighting.png'
import decor from '../../assets/categoryIcons/decor.png'
import kids from '../../assets/categoryIcons/kids.png'
import makeUp from '../../assets/categoryIcons/make-up.png'
import health from '../../assets/categoryIcons/health.png'
import pets from '../../assets/categoryIcons/pets.png'
import other from '../../assets/categoryIcons/other.png'
import CategoryOctagonShape from '../categoryOctagonShapeSec/CategoryOctagonShape'

export default function AllCategorySec() {
    const categoryItems = [
        {
            img: furnitre,
            title: 'furnitre',
            link: '/your-messages'
        },
        {
            img: kitchen,
            title: 'kitchen',
            link: '/your-messages'
        },
        {
            img: sport,
            title: 'sports',
            link: '/your-messages'
        },
        {
            img: lighting,
            title: 'lighting',
            link: '/your-messages'
        },
        {
            img: decor,
            title: 'decoration',
            link: '/your-messages'
        },
        {
            img: kids,
            title: 'kids',
            link: '/business-profile'
        },
        {
            img: makeUp,
            title: 'make-up',
            link: '/your-messages'
        },
        {
            img: health,
            title: 'health',
            link: '/your-messages'
        },
        {
            img: pets,
            title: 'pets',
            link: '/your-messages'
        },
        {
            img: other,
            title: 'other',
            link: '/your-messages'
        },
    ]
    return (
        <div className='allCategorySec__handler'>
            <div className="container">
                <div className="allCategory__header text-center">
                    <HeaderSec title={'Browse By Industry'}
                    />
                </div>
                <div className="allCategory__items mt-5">
                    <div className="category__octagon__flex__box">
                        {
                        categoryItems.map((el, index) => {
                            return (
                            <div key={index}>
                                <CategoryOctagonShape 
                                octagonIcon={el.img} 
                                iconName={el.title} 
                                iconLink={el.link}/>
                            </div>
                            )})
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
