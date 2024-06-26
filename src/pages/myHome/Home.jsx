import React from 'react';
import './home.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
import AboutReachSec from '../../components/aboutReachSecc/AboutReachSec';
import AllCategorySec from '../../components/allCategorySecc/AllCategorySec';
import FranchiseSec from '../../components/franchiseSecc/FranchiseSec';
import ReadyToBuySec from '../../components/readyToBuySecc/ReadyToBuySec';
import TrendingCompanySec from '../../components/trendingCompanySecc/TrendingCompanySec';
import GrowBuisnessSec from '../../components/growBuisnessSecc/GrowBuisnessSec';
import LastMinuteDeals from '../../components/lastMinuteDealsSec/LastMinuteDeals';
import SingleCompanyNewsSec from '../../components/singleCompanyNewsSec/SingleCompanyNewsSec';
import HeaderOfSec from '../../components/myHeaderOfSec/HeaderOfSec';
import DownloadApp from '../../components/downloadAppSec/DownloadApp';

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
    <div className='myHomeSec__handler'>
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
      <div className='oneClickQuotation__handler'>
        <FranchiseSec
          pageName='discover'
          headText='One-click Quotation'
          paraText='Lorem ipsum dolor sit amet consectetur.'
          btnOneText='Start Now'
        />
      </div>
      <>
        <HeaderOfSec
          secHead='News'
          secText='Lorem ipsum dolor sit amet consectetur. Lectus fermentum amet id luctus at libero.'
        />
        <SingleCompanyNewsSec />
      </>
      <DownloadApp />
    </div>
  )
}
