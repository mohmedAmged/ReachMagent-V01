import React, { useEffect, useState } from 'react';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import './showOneProductInfoInDash.css';
import MyLoader from '../myLoaderSec/MyLoader';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function ShowOneProductInfoInDash(
    { token, show_slug }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const { itemId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [newData, setNewdata] = useState([]);
    const fetchProductInfo = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/${show_slug}/${itemId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                }
            });
            setNewdata(response?.data?.data);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchProductInfo();
    }, [loginType, token]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, [loading]);
console.log(newData);

    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='dashboard__handler showOneProductInDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
            <div className='content__view__handler'>
                <ContentViewHeader title={`${Lang === 'ar' ? newData?.title_ar : newData?.title_en} ${t('DashboardShowSingleProdPage.mainHeaderText')}`} />
                <div className="content__card__list">
                    <div className="row">
                        <div className="col-12 showOneProductDash__item mb-5">
                            <h5>
                                {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.mediaHeaderText')}
                            </h5>
                            <div className="showProdImagesInDash__handler">
                                {newData?.media ?
                                    newData?.media?.map((el) => {
                                        return (
                                            <div key={el?.id}>
                                                <div className="prod__image__item">
                                                    <img src={el?.image} alt={`prod-img-${itemId}`} />
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div key={newData.id}>
                                        <div className="prod__image__item">
                                            <img src={newData?.image} alt={`prod-img-${itemId}`} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-12 showOneProductDash__item mb-5">
                            <h5>
                                {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.descriptionHeaderText')}
                            </h5>
                            <p>
                                {Lang === 'ar' ? newData?.description_ar : newData?.description_en}
                                
                            </p>
                        </div>
                        <div className="col-12 showOneProductDash__item mb-5">
                            <h5>
                                 {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.codeHeaderText')}
                            </h5>
                            <p>
                                {newData?.code}
                            </p>
                        </div>
                        {
                            newData?.unit_of_measure &&
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                    {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.unitOfMeasureHeaderText')}
                                </h5>
                                <p>
                                    {newData?.unit_of_measure}
                                </p>
                            </div>
                        }
                        {
                            newData?.catalogTypes &&
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                    {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.typesHeaderText')}
                                </h5>
                                {
                                    newData?.catalogTypes?.map((type) => (
                                        <p className='mb-2'>
                                            <i className="bi bi-check2-circle"></i>
                                            {type?.type}
                                        </p>
                                    ))
                                }
                            </div>
                        }
                        {
                            newData?.price &&
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5 >
                                    {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.priceInformationHeaderText')}
                                </h5>
                                <div className="row">
                                    <div className="col-6">
                                        <h6>
                                            {t('DashboardShowSingleProdPage.priceHeaderText')}
                                        </h6>
                                        <p>
                                            {newData?.price} {newData?.currency}
                                        </p>
                                    </div>
                                    {
                                        newData?.tax &&
                                        <div className="col-6">
                                            <h6>
                                                {t('DashboardShowSingleProdPage.taxHeaderText')} (x%)
                                            </h6>
                                            <p>
                                                {newData?.tax}%
                                            </p>
                                        </div>
                                    }
                                    {
                                        newData?.price_after_tax &&
                                        <div className="col-6 mt-4">
                                            <h6>
                                                {t('DashboardShowSingleProdPage.priceAfterTaxHeaderText')}
                                            </h6>
                                            <p>
                                                {newData?.price_after_tax} {newData?.currency}
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                        <div className="col-12 showOneProductDash__item mb-5">
                            <h5>
                                {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.categoryHeaderText')}
                            </h5>
                            <div className="row">
                                <div className="col-6">
                                    <h6>
                                        {t('DashboardShowSingleProdPage.categoryHeaderText')}
                                    </h6>
                                    <p>
                                        {newData?.category}
                                    </p>
                                </div>
                                <div className="col-6">
                                    <h6>
                                        {t('DashboardShowSingleProdPage.subCategoryHeaderText')}
                                    </h6>
                                    <p>
                                        {newData?.subCategory}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {  show_slug === 'show-catalog' &&
                            newData?.details?.length !== 0 &&
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                    {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.detailsHeaderText')}
                                </h5>
                                <div className="row">
                                    {
                                        newData?.details?.map((det,idx) => {
                                            return (
                                                <div key={idx} className="col-lg-6">
                                                    <p>
                                                    {t('DashboardShowSingleProdPage.labelHeaderText')}: <span>{det?.label}</span>
                                                    </p>
                                                    
                                                    <p>
                                                    {t('DashboardShowSingleProdPage.valueHeaderText')}: <span>{det?.value}</span>
                                                    </p>
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                                                {
                            newData?.options?.length !== 0 &&
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                    {Lang === 'ar' ? newData?.title_ar : newData?.title_en} {t('DashboardShowSingleProdPage.optionsHeaderText')}
                                </h5>
                                <div className="row">
                                    {
                                        newData?.options?.map((att) => {
                                            return (
                                                <div key={att?.attribute_id} className="col-lg-6">
                                                    <p>
                                                    {t('DashboardShowSingleProdPage.attributeHeaderText')}: <span>{att?.attribute}</span>
                                                    </p>
                                                    {
                                                        att?.values?.map((val)=>(
                                                    <div style={{border: '1px solid #000' , padding:'3px', margin:'4px 0'}}>
                                                    <p>
                                                        {t('DashboardShowSingleProdPage.valueHeaderText')}: <span>{val?.name}</span>
                                                    </p>
                                                    {
                                                        val?.price !== 'N/A'&&
                                                        <p>
                                                        {t('DashboardShowSingleProdPage.priceHeaderText')}: <span>{val?.price}</span>
                                                    </p>
                                                    }
                                                    </div>
                                                        ))
                                                    }
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }


                    </div>
                </div>

            </div>
                            }
                        </div>
                    </div>
            }
        </>
    );
};
