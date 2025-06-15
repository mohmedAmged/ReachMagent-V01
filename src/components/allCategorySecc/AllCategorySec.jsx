import React from 'react'
import './allCategorySec.css'
import HeaderSec from '../myHeaderSec/HeaderSec'
import other from '../../assets/categoryIcons/other.png'
import CategoryOctagonShape from '../categoryOctagonShapeSec/CategoryOctagonShape'
import otherIcon from '../../assets/categoryIcons/other.jpg'
import { useTranslation } from 'react-i18next'

export default function AllCategorySec({selectedIndustries}) {
    console.log(selectedIndustries);
      const { t } = useTranslation();
    return (
        <div className='allCategorySec__handler mb-5'>
            <div className="container">
                <div className="allCategory__header text-center">
                    <HeaderSec title={t('browseByIndustryHome.header')}
                    />
                </div>
                <div className="allCategory__items mt-5">
                    <div className="category__octagon__flex__box">
                        {
                        selectedIndustries?.map((el, index) => {
                            return (
                            <div key={index}>
                                <CategoryOctagonShape 
                                octagonIcon={el?.icon} 
                                iconName={el?.name} 
                                iconLink={`/all-Industries/${el?.slug}`}
                                />
                            </div>
                            )})
                        }
                        <div>
                            <CategoryOctagonShape 
                                octagonIcon={otherIcon} 
                                iconName={t('browseByIndustryHome.iconOther')}
                                iconLink={'/all-Industries'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
