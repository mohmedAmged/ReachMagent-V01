import React, { useEffect, useState } from 'react'
import './trendingCompanySec.css'
import cover3 from '../../assets/companyCards/cover 3.png'
import CopmanyCard from '../companyCardSec/CopmanyCard'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
import Cookies from 'js-cookie'
export default function TrendingCompanySec({ companies ,token }) {
    const [currentFollowedCompanies,setCurrentFollowedCompanies] = useState(() => {
        const cookieValue = Cookies.get('CurrentFollowedCompanies');
        return cookieValue ? JSON.parse(cookieValue) : [];
    });

    useEffect(()=>{
        if(!Cookies.get('CurrentFollowedCompanies') && companies){
            const firstCompany = companies[0] ? companies[0] : ''
            if(firstCompany?.followed !== undefined){
                const filteredCompanies = companies?.filter(company => company?.followed === true);
                setCurrentFollowedCompanies([...currentFollowedCompanies , ...filteredCompanies ]);
            };
        };
    },[companies]);

    return (
        <div className='trendingCompany__handler'>
            <div className="container">
                <HeaderOfSec
                    secHead='Trending Companies'
                    secText='Explore a wide array of trending companies making headlines in the industry'/>

                <div className="trendingCompany__cards mb-5">
                    <div className="row">
                        {
                            companies?.map((el) => {
                                return (
                                    <div key={el?.companyId} className="col-lg-4 col-md-6 col-sm-12 mb-2 d-flex justify-content-center">
                                        <CopmanyCard
// ************* dynamic info
                                            currentFollowedCompanies={currentFollowedCompanies}
                                            setCurrentFollowedCompanies={setCurrentFollowedCompanies}
                                            token={token}
                                            companyProfile={el.companyLogo}
                                            companyName={el.companyName} 
                                            companyUser={el.companyEmail}
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
