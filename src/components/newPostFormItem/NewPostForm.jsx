import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
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

export default function NewPostForm({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currPost,setCurrPost] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        status: 'active',
        type: ''
    });

    useEffect(()=>{
        if(id && loginType === 'employee') {
            (async ()=> {
                await axios.get(`${baseURL}/${loginType}/show-post/${id}?t=${new Date().getTime()}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                .then(response => {
                    setCurrPost(response?.data?.data);
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Something went wrong!');
                });
            })();
        };
    },[id]);

    useEffect(()=>{
        if(currPost?.postId && +currPost?.postId === +id){
            setFormData({
                title_ar: currPost?.postTitle_ar || '',
                title_en: currPost?.postTitle_en || '',
                description_ar: currPost?.postDescription_ar || '',
                description_en: currPost?.postDescription_en || '',
                status: currPost?.postStatus.toLowerCase() || '',
                type: currPost?.postType.toLowerCase() || ''
            })
        };
    },[currPost]);

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
            const slugCompletion = id ? `update-post/${id}` : 'add-post';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {

                navigate('/profile/posts')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Post updated successfully' : 'Post added successfully'),{
                        id: toastId,
                        duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update the post' : 'Failed to add post',{
                        id: toastId,
                        duration: 2000
                });
            };
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
        }, 3000);
    }, [loading]);

    console.log(currPost);
    
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
                                <ContentViewHeader title={id ? `${t('DashboardNewPostsItemPage.headerPageTextUpdate')}` : `${t('DashboardNewPostsItemPage.headerPageTextAdd')}`} />
                                <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="title_en">{t('DashboardNewPostsItemPage.postEnFormInput')} <span className="requiredStar"> *</span>
                                                <i title={t('DashboardNewPostsItemPage.postEnFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title_en"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPostsItemPage.addCompanyNameFormInputPlaceholder')}
                                                    value={formData?.title_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="title_ar">{t('DashboardNewPostsItemPage.postArFormInput')} <span className="requiredStar"> *</span>
                                                <i title={t('DashboardNewPostsItemPage.postArFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title_ar"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPostsItemPage.addCompanyNameFormInputPlaceholder')}
                                                    value={formData?.title_ar}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="description_en">{t('DashboardNewPostsItemPage.descEnFormInput')} <span className="requiredStar"> *</span>
                                                <i title={t('DashboardNewPostsItemPage.descEnFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <textarea
                                                    name="description_en"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.description_en}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="description_ar">{t('DashboardNewPostsItemPage.descArFormInput')} <span className="requiredStar"> *</span>
                                                <i title={t('DashboardNewPostsItemPage.descArFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <textarea
                                                    name="description_ar"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.description_ar}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="type">{t('DashboardNewPostsItemPage.postTypeFormInput')} <span className="requiredStar"> *</span>
                                                <i title={t('DashboardNewPostsItemPage.postTypeFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <select
                                                    name="type"
                                                    className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                                    value={formData?.type}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>{t('DashboardNewPostsItemPage.postTypeFormInputPlaceholder')}</option>
                                                    <option value="news">{t('DashboardNewPostsItemPage.newsTypeFormInput')}</option>
                                                    <option value="discount">
                                                        {t('DashboardNewPostsItemPage.discountTypeFormInput')}
                                                    </option>
                                                    <option value="announcement">{t('DashboardNewPostsItemPage.announcementTypeFormInput')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            {id ? `${t('DashboardNewPostsItemPage.updatePostBtn')}` : `${t('DashboardNewPostsItemPage.addNewPostBtn')}`}
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
