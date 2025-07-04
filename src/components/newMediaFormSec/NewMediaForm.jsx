import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function NewMediaForm({token}) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const { id } = useParams();
    const [currMedia, setCurrMedia] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        type: '',
        image: '',
        link: ''
    });

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/company-portfolio/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                    .then(response => {
                        setCurrMedia(response?.data?.data?.portfolio);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    useEffect(() => {
        if(currMedia?.id && +currMedia?.id === +id){
            setFormData({
                type: currMedia?.type || '',
                image: currMedia?.link || '',
                link: currMedia?.link || '',
            });
            
        };
    }, [currMedia, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = (e.target.files);
        setFormData((prevState) => ({
            ...prevState,
            image: files[0],
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Loading...');
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'image' && formData[key] instanceof File) {
                submissionData.append(key, formData[key]);
            } else {
                submissionData.append(key, formData[key]);
            };
        });

        try {
            const slugCompletion = id ? `update-company-portfolio/${id}` : 'add-company-portfolio';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/media');
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Media item Updated Successfully!' : 'Media item added successfully!'),{
                        id: toastId,
                        duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update Media item!' : 'Failed to add Media item!',{
                        id: toastId,
                        duration: 1000
                });
            }
        } catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n'); // Join with newline for separate lines
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>,{
                        id: toastId,
                        duration: 1000
                }); // Preserve line breaks
            } else {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
                        id: toastId,
                        duration: 1000
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
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='newCatalogItem__form__handler'>
                                        <ContentViewHeader title={id ? `${t('DashboardNewMediaItemPage.headerPageTextUpdate')}` :`${t('DashboardNewMediaItemPage.headerPageTextAdd')}`} />
                                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="category_id"> 
                                                            {id ? `${t('DashboardNewMediaItemPage.editFormInput')}` : `${t('DashboardNewMediaItemPage.chooseFormInput')}`} {t('DashboardNewMediaItemPage.typeOfFormInput')}
                                                            <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <select
                                                            name="type"
                                                            className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                                            value={formData?.type}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="" disabled>{t('DashboardNewMediaItemPage.typeOfFormInputPlaceholder')}
                                                            </option>
                                                            <option 
                                                            key="image"
                                                            value="image">
                                                                {t('DashboardMediaPage.imageFilterItem')}
                                                            </option>
                                                            <option 
                                                            key="link"
                                                            value="link">
                                                                {t('DashboardMediaPage.videoFilterItem')}
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {
                                                    formData?.type === 'image' &&
                                                    <div className="col-lg-8">
                                                        <div className="upload__image__btn ">
                                                        <label htmlFor="image" style={{marginBottom: '8px', fontSize: '16px', fontWeight: '400'}}>{id ? `${t('DashboardNewMediaItemPage.editFormInput')}` : `${t('DashboardNewMediaItemPage.addFormInput')}`} {t('DashboardMediaPage.imageFilterItem')}<span className="requiredStar"> *</span>
                                                        <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        <br />
                <span style={{color: 'gray', fontSize: '14px'}}>({t('DashboardNewServiceItemPage.AddImagesFormInputPlaceholder')})</span>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            onChange={handleImageChange}
                                                            className="form-control mt-2"
                                                        />
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    formData?.type === 'link' &&
                                                    <div className="col-lg-8">
                                                        <div className="catalog__new__input">
                                                            <label htmlFor="link">{id ? `${t('DashboardNewMediaItemPage.editFormInput')}` : `${t('DashboardNewMediaItemPage.addFormInput')}`} {t('DashboardNewMediaItemPage.linkVideoFormInput')}
                                                            <span className='optional'>({t('DashboardNewMediaItemPage.linkVideoFormInputOptional')})</span>
                                                            <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="link"
                                                                className="form-control"
                                                                placeholder={t('DashboardNewMediaItemPage.linkVideoFormInputPlaceholder')}
                                                                value={formData?.link}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                
                                            </div>
                                            <div className="form__submit__button">
                                                <button type="submit" className="btn btn-primary">
                                                    {id ? `${t('DashboardNewMediaItemPage.updateMediaBtn')}` : `${t('DashboardNewMediaItemPage.addMediaBtn')}`}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                            }
                        </div>
                    </div>
    }
    </>
  )
}
