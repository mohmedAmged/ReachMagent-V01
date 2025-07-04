import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function NewNetworkForm({token}) {
    const [activeTooltip, setActiveTooltip] = useState(null);
    const toggleTooltip = (key) => {
    setActiveTooltip(prev => (prev === key ? null : key));
    };
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currNetwork,setCurrNetwork] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        name: '',
        label: '',
        logo: '',
    });

    useEffect(()=>{
        if(id && loginType === 'employee') {
            (async ()=> {
                await axios.get(`${baseURL}/${loginType}/show-company-network/${id}?t=${new Date().getTime()}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                .then(response => {
                    setCurrNetwork(response?.data?.data?.network);
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Something went wrong!');
                });
            })();
        };
    },[id]);

    useEffect(()=>{
        if(currNetwork?.id && +currNetwork.id === +id){
            setFormData({
                name: currNetwork?.name || '',
                label: '',
                logo: currNetwork?.logo || '',
            });
            
        };
    },[currNetwork, id]);

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
            logo: files[0],
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        const toastId = toast.loading('Loading...');
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        try {
            const slugCompletion = id ? `update-company-network/${id}` : 'add-company-network';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {

                navigate('/profile/network')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'network updated successfully' : 'network added successfully'),{
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update the network' : 'Failed to add network',{
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
        }, 500);
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
                        <ContentViewHeader title={id ? `${t('DashboardNewNetworkItemPage.headerPageTextUpdate')}` : `${t('DashboardNewNetworkItemPage.headerPageTextAdd')}`} />
                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="name">{t('DashboardNewNetworkItemPage.addCompanyNameFormInput')}<span className="requiredStar"> *</span>
                                        <i title={t('DashboardNewNetworkItemPage.addCompanyNameFormInputTitle')} onClick={() => toggleTooltip('addComp')}className="bi bi-info-circle ms-1 cursorPointer"></i>
                                        {activeTooltip === 'addComp' && (
                                        <div className="custom-tooltip position-absolute">
                                        {t('DashboardNewNetworkItemPage.addCompanyNameFormInputTitle')}
                                        </div>
                                        )}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder={t('DashboardNewNetworkItemPage.addCompanyNameFormInputPlaceholder')}
                                            value={formData?.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="label">{t('DashboardNewNetworkItemPage.typeOfConnectionFormInput')}<span className="requiredStar"> *</span>
                                        <i title={t('DashboardNewNetworkItemPage.typeOfConnectionFormInputTitle')}
                                        onClick={() => toggleTooltip('typeConnect')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                        {activeTooltip === 'typeConnect' && (
                                        <div className="custom-tooltip position-absolute">
                                        {t('DashboardNewNetworkItemPage.typeOfConnectionFormInputTitle')}
                                        </div>
                                        )}
                                        </label>
                                        <select
                                            name="label"
                                            className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                            value={formData?.label}
                                            onChange={handleInputChange}
                                        >
                                            <option value="" disabled>{t('DashboardNewNetworkItemPage.typeOfConnectionFormInputPlaceholder')}</option>
                                            <option value="client">{t('DashboardNewNetworkItemPage.clientFormInput')}</option>
                                            <option value="partener">{t('DashboardNewNetworkItemPage.partnerFormInput')}</option>
                                            {/* <option value="agent">Agent</option> */}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="upload__image__btn ">
                                <label htmlFor="label" className='mb-2'>{t('DashboardNewNetworkItemPage.addLogoFormInput')}<span className="requiredStar"> *</span>
                                <br />
                                <span style={{color: 'gray', fontSize: '14px'}}>({t('DashboardNewServiceItemPage.AddImagesFormInputPlaceholder')})</span>
                                </label>
                                <input
                                    type="file"
                                    name="logo"
                                    onChange={handleImageChange}
                                    className="form-control mt-2"
                                />
                            </div>
                            <div className="form__submit__button">
                                <button type="submit" className="btn btn-primary">
                                    {id ? `${t('DashboardNewNetworkItemPage.updateNetworkBtn')}` : `${t('DashboardNewNetworkItemPage.addNetworkBtn')}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    }
</>
  )
}
