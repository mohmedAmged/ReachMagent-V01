import React, { useEffect, useState } from 'react';
import './myContactUs.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import MyNewLoader from '../../components/myNewLoaderSec/MyNewLoader';
import { useTranslation } from 'react-i18next';

export default function MyContactUs({token}) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    //     const cookiesData = Cookies.get('currentLoginedData');
    //     if (!currentUserLogin) {
    //         const newShape = JSON.parse(cookiesData);
    //         setCurrentUserLogin(newShape);
    //     }
    // }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
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
            submissionData.append(key, formData[key]);
        });
        try {
            const response = await axios.post(`${baseURL}/send-contact-us`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/contact-us')
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                })
                scrollToTop()
                toast.success(response?.message || ('message send successfully'),{
                        id: toastId,
                        duration: 1000
                });
            } else {
                toast.error('Failed to send message',{
                        id: toastId,
                        duration: 2000
                });
            }
        }  catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n'); 
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>,{
                        id: toastId,
                        duration: 2000
                }); 
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
        { loading ?
            <MyNewLoader />
            :
            <div className='myContactUs__handler singleCompanyQuote__handler'>
                <MyMainHeroSec
                    heroSecContainerType='singleCompany__quote'
                    headText={t('ContactUsPage.header')}
                />
                <div className="myContactUs_form_handler container">
                    <div className="row justify-content-start">
                        <div className="col-md-12">
                            <div className="contactCompany__form my-5">
                                <form onSubmit={handleFormSubmit} className='p-3'>
                                    <div className="mb-4">
                                        <label htmlFor="name">
                                            {t('ContactUsPage.contactNameInput')}
                                        </label>
                                        <input name='name' type="text" className='w-100' 
                                        placeholder={t('ContactUsPage.contactNamePlaceholder')} 
                                        value={formData?.name}
                                        onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="phone">
                                            {t('ContactUsPage.contactPhoneInput')}
                                        </label>
                                        <input 
                                        name='phone'
                                        type="text" 
                                        className='w-100' 
                                        placeholder={t('ContactUsPage.contactPhonePlaceholder')}
                                        value={formData?.phone}
                                        onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email">
                                            {t('ContactUsPage.contactEmailInput')}
                                        </label>
                                        <input 
                                        name='email'
                                        type="text" 
                                        className='w-100' 
                                        placeholder={t('ContactUsPage.contactEmailPlaceholder')}
                                        value={formData?.email}
                                        onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="message">
                                            {t('ContactUsPage.contactMessageInput')}
                                        </label>
                                        <textarea 
                                        name="message"
                                        className='w-100' 
                                        placeholder={t('ContactUsPage.contactMessagePlaceholder')}
                                        value={formData?.message}
                                        onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    <div className="form__submit__button">
                                            <button type="submit" className="contactCompany__form-submitBtn">
                                                {t('ContactUsPage.contactBtn')}
                                            </button>
                                        </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        }
        </>
    )
}
