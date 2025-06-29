import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function NewFaqForm({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currFaq,setCurrFaq] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        question_ar: '',
        question_en: '',
        answer_ar: '',
        answer_en: '',
        status: 'active',
    });

    useEffect(()=>{
        if(id && loginType === 'employee') {
            (async ()=> {
                await axios.get(`${baseURL}/${loginType}/show-faq/${id}?t=${new Date().getTime()}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                .then(response => {
                    setCurrFaq(response?.data?.data);
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Something went wrong!');
                });
            })();
        };
    },[id]);

    useEffect(()=>{
        if(currFaq?.id && +currFaq?.id === +id){
            setFormData({
                question_ar: currFaq?.question_ar || '',
                question_en:  currFaq?.question_en || '',
                answer_ar: currFaq?.answer_ar || '',
                answer_en: currFaq?.answer_en || '',
                status: 'active'
            });
        };
    },[currFaq, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Loading...');
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });
        try {
            const slugCompletion = id ? `update-faq/${id}` : 'add-faq';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/profile/faqs')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Faq updated successfully' : 'Faq added successfully'),{
                        id: toastId,
                        duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update Faq item' : 'Failed to add Faq item',{
                        id: toastId,
                        duration: 2000
                });
            }
        }  catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n'); // Join with newline for separate lines
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>,{
                        id: toastId,
                        duration: 2000
                }); // Preserve line breaks
            } else {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
                        id: toastId,
                        duration: 2000
                });
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            <div className='newCatalogItem__form__handler'>
                                <ContentViewHeader title={id ? `${t('DashboardNewFAQsItemPage.headerPageTextUpdate')}` : `${t('DashboardNewFAQsItemPage.headerPageTextAdd')}`} />
                                <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="question_en">{t('DashboardNewFAQsItemPage.faqEnFormInput')} <span className="requiredStar"> *</span></label>
                                                <input
                                                    type="text"
                                                    name="question_en"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewFAQsItemPage.addCompanyNameFormInputPlaceholder')}
                                                    value={formData?.question_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="question_ar">{t('DashboardNewFAQsItemPage.faqArFormInput')} <span className='optional'>(optional)</span></label>
                                                <input
                                                    type="text"
                                                    name="question_ar"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewFAQsItemPage.addCompanyNameFormInputPlaceholder')}
                                                    value={formData?.question_ar}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="answer_en">{t('DashboardNewFAQsItemPage.answerEnFormInput')} <span className="requiredStar"> *</span></label>
                                                <textarea
                                                    name="answer_en"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.answer_en}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="answer_ar">{t('DashboardNewFAQsItemPage.answerArFormInput')} <span className='optional'>(optional)</span></label>
                                                <textarea
                                                    name="answer_ar"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.answer_ar}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            {id? `${t('DashboardNewFAQsItemPage.updateFaqBtn')}` : `${t('DashboardNewFAQsItemPage.addNewFaqBtn')}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
