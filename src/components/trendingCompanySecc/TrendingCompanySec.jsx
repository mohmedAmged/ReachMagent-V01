import React from 'react'
import './trendingCompanySec.css'
import cover1 from '../../assets/companyCards/cover 1.png'
import cover2 from '../../assets/companyCards/cover 2.png'
import cover3 from '../../assets/companyCards/cover 3.png'
import profile from '../../assets/companyCards/profile.png'
import CopmanyCard from '../companyCardSec/CopmanyCard'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
export default function TrendingCompanySec({ companies }) {

    // const companyCardsItems = [
    //     {
    //         cardCover: cover1,
    //         cardProfile: profile,
    //         cardName: 'company name',
    //         cardUser: '@email.com',
    //         productsCount: 112,
    //         dealsCount: 261,
    //         ownerCount: 2,
    //         cardDesc: 'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis',
    //         companyLink:'',
    //         companyId:1
    //     },
    //     {
    //         cardCover: cover2,
    //         cardProfile: profile,
    //         cardName: 'company name',
    //         cardUser: '@email.com',
    //         productsCount: 112,
    //         dealsCount: 261,
    //         ownerCount: 2,
    //         cardDesc: 'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis',
    //         companyLink:'',
    //         companyId:2
    //     },
    //     {
    //         cardCover: cover3,
    //         cardProfile: profile,
    //         cardName: 'company name',
    //         cardUser: '@email.com',
    //         productsCount: 112,
    //         dealsCount: 261,
    //         ownerCount: 2,
    //         cardDesc: 'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis',
    //         companyLink:'',
    //         companyId:3
    //     },
    // ]
    // const updatedCompanyCardsItems = companyCardsItems.map((item, index) => ({
    //     ...item,
    //     cardName: companies[index]?.companyName || item?.cardName 
    // }));
    return (
        <div className='trendingCompany__handler'>
            <div className="container">
                <HeaderOfSec
                    secHead='Trending Companies'
                    secText='Explore a wide array of trending companies making headlines in the industry'/>

                <div className="trendingCompany__cards mb-5">
                    <div className="row">
                        {
                            companies?.map((el, index) => {
                                return (
                                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-2 d-flex justify-content-center">
                                        <CopmanyCard
// ************* dynamic info
                                            companyProfile={el.companyLogo} companyName={el.companyName} companyUser={el.companyEmail}
                                            companyId={el.companyId}
// ************* static info
                                            coverImg={cover3}
                                            productsCount={'112'}
                                            dealsCount={'261'}
                                            ownerCount={'2'}
                                            cardDesc={'Lorem ipsum Dolor Sit Amet Consecteture Adipsciing Elit Tristique Hac Lectus Facillsi Convallis'}
                                        />
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
