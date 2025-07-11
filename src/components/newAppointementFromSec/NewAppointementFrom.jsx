import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';

export default function NewAppointementFrom({token}) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        date_from: '', /*2024-10-12 */
        date_to: '', /*2024-10-30 */
        available_from: '', /*18:30 */
        available_to: '',   /*22:30 */
    });
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
            if (key === 'image' && formData[key] instanceof File) {
                submissionData.append(key, formData[key]);
            } else {
                submissionData.append(key, formData[key]);
            };
        });

        try {
            const response = await axios.post(`${baseURL}/${loginType}/add-appointments`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/appointments');
                scrollToTop()
                toast.success(response?.data?.message || ('Appointments item added successfully!'),{
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error('Failed to add Appointments item!',{
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
        }, 3000);
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
                                        <ContentViewHeader title={t('DashboardAppointementPage.AddAppointementsBtn')} />
                                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="catalog__new__input">
                                                        <label  htmlFor="date_from"> 
                                                            {t('DashboardAppointementPage.tableHeadDateFrom')}
                                                            <span className="requiredStar"> *</span>
                                                            <i title={t('DashboardAppointementPage.tableHeadDateFrom')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input type="date" name="date_from" className='form-control'
                                                        value={formData?.date_from}
                                                        onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="catalog__new__input">
                                                        <label 
                                                        htmlFor="date_to"> 
                                                            {t('DashboardAppointementPage.tableHeadDateTo')}
                                                            <span className="requiredStar"> *</span>
                                                            <i title={t('DashboardAppointementPage.tableHeadDateTo')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input type="date" name="date_to" className='form-control'
                                                        value={formData?.date_to}
                                                        onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="catalog__new__input">
                                                        <label 
                                                        htmlFor="available_from"> 
                                                        {t('DashboardAppointementPage.tableHeadAvailableFrom')}
                                                            <span className="requiredStar"> *</span>
                                                            <i title={t('DashboardAppointementPage.tableHeadAvailableFrom')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input type="time" name="available_from" className='form-control'
                                                        value={formData?.available_from}
                                                        onChange={handleInputChange}
                                                        />
                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="catalog__new__input">
                                                        <label 
                                                        htmlFor="available_to"> 
                                                            {t('DashboardAppointementPage.tableHeadAvailableTo')}
                                                            <span className="requiredStar"> *</span>
                                                            <i title={t('DashboardAppointementPage.tableHeadAvailableTo')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input type="time" name="available_to" className='form-control'
                                                        value={formData?.available_to}
                                                        onChange={handleInputChange}
                                                        />
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form__submit__button">
                                                <button type="submit" className="btn btn-primary">
                                                    {t('DashboardAppointementPage.AddAppointementsBtn')}
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
