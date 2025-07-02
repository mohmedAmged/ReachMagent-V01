import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import toast from "react-hot-toast";
import { scrollToTop } from "../../functions/scrollToTop";
import MyLoader from "../../components/myLoaderSec/MyLoader";
import MyNewSidebarDash from "../../components/myNewSidebarDash/MyNewSidebarDash";
import MainContentHeader from "../../components/mainContentHeaderSec/MainContentHeader";
import ContentViewHeader from "../../components/contentViewHeaderSec/ContentViewHeader";
import MyNewLoader from "../../components/myNewLoaderSec/MyNewLoader";
import { Lang } from "../../functions/Token";
import { useTranslation } from "react-i18next";

export default function AddNewPrevWork({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currPrevWork, setCurrPrevWork] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        title_en: '',
        title_ar:'',
        description_en: '',
        description_ar:'',
        type_en: '',
        type_ar:'',
        image: '',
    });

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/show-pervious-work/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                    .then(response => {
                        setCurrPrevWork(response?.data?.data?.pervious_work);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    useEffect(() => {
        if (currPrevWork?.id && +currPrevWork?.id === +id) {
            setFormData({
                title_en: currPrevWork?.title || '',
                title_ar: currPrevWork?.title_ar || '',
                description_en: currPrevWork?.description || '',
                description_ar: currPrevWork?.description_ar || '',
                type_en: currPrevWork?.type || '',
                type_ar: currPrevWork?.type_ar || '',
                image: currPrevWork?.image || '',
            });

        };
    }, [currPrevWork, id]);

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
        const submissionData = new FormData();
        const toastId = toast.loading('Loading...');
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        try {
            const slugCompletion = id ? `update-pervious-work/${id}` : 'add-pervious-work';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/previous-work')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Previous Work updated successfully' : 'PrevWork added successfully'), {
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update the PrevWork' : 'Failed to add PrevWork', {
                    id: toastId,
                    duration: 2000
                });
            };
        } catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n');
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>, {
                    id: toastId,
                    duration: 2000
                });
            } else {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
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
                                <ContentViewHeader title={id ? `${t('DashboardNewPrevWorkItemPage.headerPageTextUpdate')}` : `${t('DashboardNewPrevWorkItemPage.headerPageTextAdd')}`} />
                                <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="title_en">{t('DashboardNewPrevWorkItemPage.newPreviousWorkEnFormInput')}<span className="requiredStar"> *</span>
                                                    <i title={t('DashboardNewPrevWorkItemPage.newPreviousWorkEnFormInputTitle')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title_en"
                                                    id="title_en"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPrevWorkItemPage.newPreviousWorkEnFormInputPlaceholder')}
                                                    value={formData?.title_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="title_ar">{t('DashboardNewPrevWorkItemPage.newPreviousWorkArFormInput')}<span className="requiredStar"> *</span>
                                                    <i title={t('DashboardNewPrevWorkItemPage.newPreviousWorkArFormInputTitle')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title_ar"
                                                    id="title_ar"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPrevWorkItemPage.newPreviousWorkEnFormInputPlaceholder')}
                                                    value={formData?.title_ar}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="type_en">{t('DashboardNewPrevWorkItemPage.typeofWorkEnFormInput')}<span className="requiredStar"> *</span>
                                                    
                                                </label>
                                                {/* <select
                                                    name="type_en"
                                                    id="type_en"
                                                    className="form-control custom-select"
                                                    value={formData?.type_en}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select Type of Work</option>
                                                    <option value="service">Service</option>
                                                    <option value="Catalog">Catalog</option>
                                                </select> */}
                                                <input
                                                    type="text"
                                                    name="type_en"
                                                    id="type_en"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPrevWorkItemPage.typeofWorkEnFormInput')}
                                                    value={formData?.type_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="type_ar">{t('DashboardNewPrevWorkItemPage.typeofWorkArFormInput')}<span className="requiredStar"> *</span>
                                                    
                                                </label>
                                                {/* <select
                                                    name="type_en"
                                                    id="type_en"
                                                    className="form-control custom-select"
                                                    value={formData?.type_en}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select Type of Work</option>
                                                    <option value="service">Service</option>
                                                    <option value="Catalog">Catalog</option>
                                                </select> */}
                                                <input
                                                    type="text"
                                                    name="type_ar"
                                                    id="type_ar"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPrevWorkItemPage.typeofWorkArFormInput')}
                                                    value={formData?.type_ar}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="description_en">{t('DashboardNewPrevWorkItemPage.workDescriptionEnFormInput')}<span className="requiredStar"> *</span>
                                                    
                                                </label>
                                                <textarea
                                                    type="text"
                                                    name="description_en"
                                                    id="description_en"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPrevWorkItemPage.workDescriptionEnFormInput')}
                                                    value={formData?.description_en}
                                                    onChange={handleInputChange}
                                                    cols={4}
                                                    rows={4}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="description_ar">{t('DashboardNewPrevWorkItemPage.workDescriptionArFormInput')}<span className="requiredStar"> *</span>
                                                    
                                                </label>
                                                <textarea
                                                    type="text"
                                                    name="description_ar"
                                                    id="description_ar"
                                                    className="form-control"
                                                    placeholder={t('DashboardNewPrevWorkItemPage.workDescriptionArFormInput')}
                                                    value={formData?.description_ar}
                                                    onChange={handleInputChange}
                                                    cols={4}
                                                    rows={4}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="upload__image__btn ">
                                        <label htmlFor="image" className='mb-2'>{t('DashboardNewPrevWorkItemPage.workCoverImageFormInput')}<span className="requiredStar"> *</span>
                                        <br />
                                        <span style={{color: 'gray', fontSize: '14px'}}>({t('DashboardNewServiceItemPage.AddImagesFormInputPlaceholder')})</span>
                                        </label>
                                        <input
                                            type="file"
                                            name="image"
                                            id='image'
                                            onChange={handleImageChange}
                                            className="form-control mt-2"
                                        />
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            {id ? `${t('DashboardNewPrevWorkItemPage.updatePrevWorkBtn')}` : `${t('DashboardNewPrevWorkItemPage.addPrevWorkBtn')}`}
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
