import React from 'react'
import './singleCompany.css'
import HeroOnlyCover from '../../components/heroOnlyCoverSec/HeroOnlyCover'
import CompanyInfoCard from '../../components/companyInfoCardSec/CompanyInfoCard'
import ProductDetailsFilterationBar from '../../components/productDetailsFilterationBarSec/ProductDetailsFilterationBar'
export default function SingleCompany() {
    const items = [
        { name: 'Overview', active: true },
        { name: 'Services', active: false },
        { name: 'Products', active: false },
        // Add more items as needed
      ];
    return (
        <div className='singleCompany__handler'>
            <HeroOnlyCover />
            <CompanyInfoCard />
            <div className='my-5'>
                <ProductDetailsFilterationBar items={items}/>
            </div>
            
        </div>
    )
}