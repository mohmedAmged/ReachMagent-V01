import React from 'react';
import './home.css';
import MyMainHeroSec from '../../components/myMainHeroSec/MyMainHeroSec';
import AboutReachSec from '../../components/aboutReachSec/AboutReachSec';
import AllCategorySec from '../../components/allCategorySec/AllCategorySec';
import FranchiseSec from '../../components/franchiseSec/FranchiseSec';
import ReadyToBuySec from '../../components/readyToBuySec/ReadyToBuySec';
import TrendingCompanySec from '../../components/trendingCompanySec/TrendingCompanySec';
import GrowBuisnessSec from '../../components/growBuisnessSec/GrowBuisnessSec';
import LastMinuteDeals from '../../components/lastMinuteDeals/LastMinuteDeals';

export default function Home() {
    const arrOfCateg = [
        {
          name: 'All',
          id: 1
        },
        {
          name: 'One',
          id: 2
        },
        {
          name: 'Two',
          id: 3
        },
        {
          name: "Three",
          id: 4
        }
        ]

    return (
        <div className=''>
            <MyMainHeroSec 
            heroSecContainerType='heroSec__container' 
            headText='We Make Things Better' 
            paraPartOne=' Save  thousands to millions of bucks by using single tool for different' 
            paraPartTwo='amazing and outstanding cool and great useful admin' 
            categoryArr={arrOfCateg}
            />
            <AboutReachSec />
            <AllCategorySec />
            <FranchiseSec 
            pageName='home'
            headText='Franchise Opportunities'
            paraText='Lorem ipsum dolor sit amet consectetur. Fermentum tortor tortor nisi laoreet cursus ultrices amet. Odio arcu ornare turpis '
            btnOneText='Submit Your Brand'
            btnTwoText='Explore Now'
            />
            <ReadyToBuySec />
            <TrendingCompanySec />
            <GrowBuisnessSec />
            <LastMinuteDeals />
        </div>
    )
}
