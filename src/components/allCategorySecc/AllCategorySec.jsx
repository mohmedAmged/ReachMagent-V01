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
            link: '/all-category/:subCategID'
        },
        {
            img: kitchen,
            title: 'kitchen',
            link: '/all-category/:subCategID'
        },
        {
            img: sport,
            title: 'sports',
            link: '/all-category/:subCategID'
        },
        {
            img: lighting,
            title: 'lighting',
            link: '/all-category/:subCategID'
        },
        {
            img: decor,
            title: 'decoration',
            link: '/all-category/:subCategID'
        },
        {
            img: kids,
            title: 'kids',
            link: '/all-category/:subCategID'
        },
        {
            img: makeUp,
            title: 'make-up',
            link: '/all-category/:subCategID'
        },
        {
            img: health,
            title: 'health',
            link: '/all-category/:subCategID'
        },
        {
            img: pets,
            title: 'pets',
            link: '/all-category/:subCategID'
        },
        {
            img: other,
            title: 'other',
            link: '/all-category/:subCategID'
        },
    ];
    return (
        <div className='allCategorySec__handler mb-5'>
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
