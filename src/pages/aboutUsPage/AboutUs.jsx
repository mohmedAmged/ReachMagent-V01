import React, { useEffect, useState } from 'react'
import styles from './aboutUs.module.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';
export default function AboutUs() {
      const { t } = useTranslation();
      const [loading, setLoading] = useState(true);
        useEffect(() => {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        }, [loading]);
    
    return (
        <>
        {
            loading ?
            <MyNewLoader />
            :
            <div className={`aboutUs__handler singleCompanyQuote__handler`}>
                <MyMainHeroSec
                heroSecContainerType='singleCompany__quote'
                headText={t('AboutUsPage.header')}
                />
                <div className="aboutUse_moreInfo_handler container ">
                    <p className={`p-5  my-5 ${styles.textStyle}`} >
                    {t('AboutUsPage.aboutInfo')}
                    </p>
                </div>
            </div>
        }
        </>
    )
}
