import React from 'react';
import './Home.css';
// import ProductCategoryCard from '../../components/productCategoryCard/ProductCategoryCard';
import MyMainHeroSec from '../../components/myMainHeroSec/MyMainHeroSec';
import AboutReachSec from '../../components/aboutReachSec/AboutReachSec';
import AllCategorySec from '../../components/allCategorySec/AllCategorySec';
import FranchiseSec from '../../components/franchiseSec/FranchiseSec';
import ReadyToBuySec from '../../components/readyToBuySec/ReadyToBuySec';

export default function Home() {
    return (
        <div className=''>
            <MyMainHeroSec />
            <AboutReachSec />
            <AllCategorySec />
            <FranchiseSec />
            <ReadyToBuySec />
        </div>
    )
}
