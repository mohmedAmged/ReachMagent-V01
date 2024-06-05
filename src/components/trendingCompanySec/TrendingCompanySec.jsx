import React from 'react'
import './trendingCompanySec.css'
import cover1 from '../../assets/companyCards/cover 1.png'
import cover2 from '../../assets/companyCards/cover 2.png'
import cover3 from '../../assets/companyCards/cover 3.png'
import profile from '../../assets/companyCards/profile.png'
import CopmanyCard from '../companyCard/CopmanyCard'
import HeaderOfSec from '../headerOfSec/HeaderOfSec'
export default function TrendingCompanySec() {
    const companyCardsItems = [
        {
            cardCover: cover1,
            cardProfile: profile,
            cardName: 'company name',
            cardUser: '@email.com',
            productsCount: 112,
            dealsCount: 261,
            ownerCount: 2,
            cardDesc: 'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis'
        },
        {
            cardCover: cover2,
            cardProfile: profile,
            cardName: 'company name',
            cardUser: '@email.com',
            productsCount: 112,
            dealsCount: 261,
            ownerCount: 2,
            cardDesc: 'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis'
        },
        {
            cardCover: cover3,
            cardProfile: profile,
            cardName: 'company name',
            cardUser: '@email.com',
            productsCount: 112,
            dealsCount: 261,
            ownerCount: 2,
            cardDesc: 'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis'
        },
    ]

    return (
        <div className='trendingCompany__handler'>
            <div className="container">
                <HeaderOfSec
                    secHead='Trending Companies'
                    secText='Lorem ipsum dolor sit amet consectetur. Lectus fermentum amet id luctus at libero.' />

                <div className="trendingCompany__cards mb-5">
                    <div className="row">
                        {
                            companyCardsItems.map((el, index) => {
                                return (
                                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                        <CopmanyCard coverImg={el.cardCover} companyProfile={el.cardProfile} companyName={el.cardName} companyUser={el.cardUser} productsCount={el.productsCount} dealsCount={el.dealsCount} ownerCount={el.ownerCount} cardDesc={el.cardDesc}/>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
