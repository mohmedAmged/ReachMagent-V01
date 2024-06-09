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
            link: '/profile'
        },
        {
            img: kitchen,
            title: 'kitchen',
            link: '/profile'
        },
        {
            img: sport,
            title: 'sports',
            link: '/profile'
        },
        {
            img: lighting,
            title: 'lighting',
            link: '/profile'
        },
        {
            img: decor,
            title: 'decoration',
            link: '/profile'
        },
        {
            img: kids,
            title: 'kids',
            link: '/profile'
        },
        {
            img: makeUp,
            title: 'make-up',
            link: '/profile'
        },
        {
            img: health,
            title: 'health',
            link: '/profile'
        },
        {
            img: pets,
            title: 'pets',
            link: '/profile'
        },
        {
            img: other,
            title: 'other',
            link: '/profile'
        },
    ]
    return (
        <div className='allCategorySec__handler'>
            <div className="container">
                <div className="allCategory__header text-center">
                    <HeaderSec title={'All Categories'}
                    />
                </div>
                <div className="allCategory__items mt-5">
                    <div className="row justify-content-center">
                        {
                        categoryItems.map((el, index) => {
                            return (
                            <div key={index} className="col-lg-2 col-md-4 col-sm-6">
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
