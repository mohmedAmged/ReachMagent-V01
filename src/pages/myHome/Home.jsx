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

export default function Home({companies}) {
  // console.log(companies);
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
      <div className='oneClickQuotation__handler'>
        <FranchiseSec
          pageName='discover'
          headText='One-click Quotation'
          paraText='Submit your request with ReachMagnets one-click tool and receive multiple quotations from companies, allowing you to compare and choose the best offer'
          btnOneText='Start Now'
        />
      </div>

      <ReadyToBuySec secMAinTitle={`Ready-To-Buy Products`}/>
      <TrendingCompanySec companies={companies}/>
      <GrowBuisnessSec />
      <LastMinuteDeals />
      <FranchiseSec
        pageName='home'
        headText='Franchise Opportunities'
        paraText='Find secure and verified franchises, or attract franchisees for your current brand'
        btnOneText='Submit Your Brand'
        btnTwoText='Explore Now'
      />
      <>
        <HeaderOfSec
          secHead='Companies Insights'
          secText='Stay informed with the latest updates, announcements, and specials from top companies'
        />
        <SingleCompanyNewsSec />
      </>
      <DownloadApp />
    </div>
  )
}
