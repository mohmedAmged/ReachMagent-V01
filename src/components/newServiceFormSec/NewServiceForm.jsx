import React, { useEffect, useState } from 'react'
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import { scrollToTop } from '../../functions/scrollToTop'
import MyLoader from '../myLoaderSec/MyLoader'
import Cookies from 'js-cookie';
import UnAuthSec from '../unAuthSection/UnAuthSec'
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories'
import MyNewLoader from '../myNewLoaderSec/MyNewLoader'
import { Lang } from '../../functions/Token'
import { useTranslation } from 'react-i18next'

export default function NewServiceForm({ token }) {
    const [activeTooltip, setActiveTooltip] = useState(null);

    const toggleTooltip = (key) => {
    setActiveTooltip(prev => (prev === key ? null : key));
    };
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const { id } = useParams();
   
    
    
    const [currSevice, setCurrService] = useState([]);
 console.log(id);
    console.log(currSevice);
    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const mainCategories = GetAllMainCategoriesStore((state) => state.mainCategories);

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        code: '',
        image: '',
        options: []
    });
    const handleAddOption = () => {
        setFormData(prevState => ({
            ...prevState,
            options: [...prevState.options, { attribute: '', values: [{ name: '', price: '' }] }]
        }));
    };

    const handleAddValue = (optionIndex) => {
        const updatedOptions = [...formData.options];
        updatedOptions[optionIndex].values.push({ name: '', price: '' });
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index][field] = value;
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleValueChange = (optionIndex, valueIndex, field, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[optionIndex].values[valueIndex][field] = value;
        setFormData({ ...formData, options: updatedOptions });
    };

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/show-service/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                    .then(response => {
                        setCurrService(response?.data?.data);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);
console.log(currentSubCategoriesInsideMainCategory);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (formData?.category_id) {
                setCurrentSubCategoriesInsideMainCategory([]);
                const selectedCategory = mainCategories.find(
                    (cat) => cat.mainCategoryId === +formData.category_id
                );
                if (selectedCategory) {
                    const slug = selectedCategory.mainCategorySlug;
                    try {
                        const timestamp = new Date().getTime(); // Cache-busting
                        const response = await axios.get(`${baseURL}/main-categories/${slug}?t=${timestamp}`, {
                            headers: {
                                "Locale": Lang
                            }
                        });
                        if (response.status === 200) {
                            setCurrentSubCategoriesInsideMainCategory(response.data.data.subCategories);
                        } else {
                            toast.error('Failed to fetch subcategories');
                        }
                    } catch (error) {
                        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                            setUnAuth(true);
                        };
                        toast.error('Error fetching subcategories.');
                    };
                };
            };
        };

        fetchSubCategories();
    }, [formData.category_id, mainCategories]);
console.log(mainCategories);

    useEffect(() => {
        if (currSevice?.slug_en && currSevice?.slug_en === id) {
            setFormData({
                title_ar: currSevice?.title_ar || '',
                title_en: currSevice?.title_en || '',
                description_ar: currSevice?.description_ar || '',
                description_en: currSevice?.description_en || '',
                category_id: mainCategories?.find(el => el?.mainCategoryName === currSevice?.category)?.mainCategoryId || '',
                sub_category_id: currentSubCategoriesInsideMainCategory?.find(el => el?.subCategoryName === currSevice.subCategory)?.subCategoryId || '',
                status: 'active',
                code: currSevice?.code || '',
                image: currSevice?.image || '',
                options: currSevice?.options?.map(el => el) || []
            })
        };
    }, [currSevice, id]);

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
            if (key !== 'options' && key === 'image' && formData[key] instanceof File) {
                submissionData.append(key, formData[key]);
            }
            else {
                submissionData.append(key, formData[key]);
            };
        });
        formData.options.forEach((option, optionIndex) => {
            submissionData.append(`options[${optionIndex}][attribute]`, option.attribute);
            option.values.forEach((value, valueIndex) => {
                submissionData.append(`options[${optionIndex}][values][${valueIndex}][name]`, value.name);
                submissionData.append(`options[${optionIndex}][values][${valueIndex}][price]`, value.price);
            });
        });
        try {
            const slugCompletion = id ? `update-service/${id}` : 'add-service';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/service');
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Service item Updated Successfully!' : 'service item added successfully!'), {
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update service item!' : 'Failed to add service item!', {
                    id: toastId,
                    duration: 2000
                });
            }
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
            };
        };
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
    <ContentViewHeader title={id ? `${t('DashboardNewServiceItemPage.headerPageTextUpdate')}` : `${t('DashboardNewServiceItemPage.headerPageTextAdd')}`} />
    <form className="catalog__form__items" onSubmit={handleFormSubmit}>
        <div className="row">
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="title_en">{t('DashboardNewServiceItemPage.titleENFormInput')}<span className="requiredStar"> *</span>
                        <i title={t('DashboardNewServiceItemPage.titleENFormInputTitle')} onClick={() => toggleTooltip('titleEn')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'titleEn' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewServiceItemPage.titleENFormInputTitle')} 
                        </div>
                        )}
                    </label>
                    <input
                        type="text"
                        name="title_en"
                        className="form-control"
                        placeholder={t('DashboardNewServiceItemPage.titleENFormInputPlaceholder')}
                        value={formData?.title_en}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="title_ar">{t('DashboardNewServiceItemPage.titleARFormInput')} <span className='optional'>({t('DashboardNewServiceItemPage.optionalText')})</span>
                        <i title={t('DashboardNewServiceItemPage.titleARFormInputTitle')} onClick={() => toggleTooltip('titleAr')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'titleAr' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewServiceItemPage.titleARFormInputTitle')} 
                        </div>
                        )}
                    </label>
                    <input
                        type="text"
                        name="title_ar"
                        className="form-control"
                        placeholder={t('DashboardNewServiceItemPage.titleENFormInputPlaceholder')}
                        value={formData?.title_ar}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="category_id">{t('DashboardNewServiceItemPage.categoryFormInput')} <span className="requiredStar"> *</span>
                        <i title={t('DashboardNewServiceItemPage.categoryFormInputTitle')} onClick={() => toggleTooltip('category')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'category' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewServiceItemPage.categoryFormInputTitle')} 
                        </div>
                        )}
                    </label>
                    <select
                        name="category_id"
                        className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                        value={formData?.category_id}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>{t('DashboardNewServiceItemPage.categoryFormInputPlaceholder')}</option>
                        {mainCategories?.map((cat) => (
                            <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>
                                {cat?.mainCategoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="sub_category_id">{t('DashboardNewServiceItemPage.subCategoryFormInput')}<span className="requiredStar"> *</span>
                        <i title={t('DashboardNewServiceItemPage.subCategoryFormInputTitle')} onClick={() => toggleTooltip('subCategory')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'subCategory' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewServiceItemPage.subCategoryFormInputTitle')} 
                        </div>
                        )}
                    </label>
                    <select
                        name="sub_category_id"
                        className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                        value={formData?.sub_category_id}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>{t('DashboardNewServiceItemPage.subCategoryFormInput')}</option>
                        {currentSubCategoriesInsideMainCategory?.map((subCat) => (
                            <option key={subCat?.subCategoryId} value={subCat?.subCategoryId}>
                                {subCat?.subCategoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-8">
                <div className="catalog__new__input">
                    <label htmlFor="code"> {t('DashboardNewServiceItemPage.productCodeFormInput')} <span className="requiredStar"> *</span>
                        <i title={t('DashboardNewServiceItemPage.productCodeFormInputTitle')} onClick={() => toggleTooltip('code')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'code' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewServiceItemPage.productCodeFormInputTitle')} 
                        </div>
                        )}
                    </label>
                    <input
                        type="text"
                        name="code"
                        className="form-control"
                        placeholder={t('DashboardNewServiceItemPage.titleENFormInputPlaceholder')}
                        value={formData?.code}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-lg-8">
                <div className="catalog__new__input">
                    <label htmlFor="description_en">{t('DashboardNewServiceItemPage.descriptionInEnglishFormInput')}<span className="requiredStar"> *</span>
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
                    <label htmlFor="description_ar">{t('DashboardNewServiceItemPage.descriptionInArabicFormInput')}<span className='optional'>({t('DashboardNewServiceItemPage.optionalText')})</span>
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
        <div className="upload__image__btn">
        <label htmlFor="tax">
                {t('DashboardNewServiceItemPage.AddImagesFormInput')}
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
        {!id &&
            <div className="row">
                <div className="col-lg-12">
                    <div style={{
                        marginTop: '30px',
                        borderTop: "1px solid #aaa"
                    }} className="catalog__new__input">
                        <label className="fw-bold my-3">{t('DashboardNewServiceItemPage.optionsAndVariationFormInput')}</label>
                        <button type="button" className="btn btn-link" onClick={handleAddOption}>{t('DashboardNewServiceItemPage.addOptionBtn')}</button>
                        {formData?.options?.map((option, index) => (
                            <div key={index} className="option-group my-3">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input
                                            style={{
                                                background: 'rgb(142 149 235 / 30%)'
                                            }}
                                            type="text"
                                            placeholder={t('DashboardNewServiceItemPage.optionsAndVariationFormInputPlaceholder')}
                                            value={option?.attribute}
                                            onChange={(e) => handleOptionChange(index, 'attribute', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                {option?.values?.map((value, valueIndex) => (
                                    <div key={valueIndex} className="row">
                                        <div className="col-lg-6">
                                            <input
                                                type="text"
                                                placeholder={t('DashboardNewServiceItemPage.optionsFormInputPlaceholder')}
                                                value={value?.name}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        index,
                                                        valueIndex,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <input
                                                type="text"
                                                placeholder={t('DashboardNewServiceItemPage.optPriceFormInputPlaceholder')}
                                                value={value?.price}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        index,
                                                        valueIndex,
                                                        'price',
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddValue(index)} className="btn btn-link">{t('DashboardNewServiceItemPage.addValueBtn')}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }
        {
            id &&
            <div className="row">
                <div className="col-lg-12">
                    <div style={{
                        marginTop: '30px',
                        borderTop: "1px solid #aaa"
                    }} className="catalog__new__input">
                        <label className="fw-bold my-3">{t('DashboardNewServiceItemPage.optionsAndVariationFormInput')}</label>
                        <div className='text-end'>
                            <NavLink to={`/profile/service/edit-item/${id}/edit-option`}>
                                <button className='btn btn-outline-primary text-capitalize'>
                                    {t('DashboardNewServiceItemPage.editOptionBtn')} <i className="bi bi-pencil-square"></i>
                                </button>
                            </NavLink>
                        </div>
                        {formData?.options?.map((option, index) => (
                            <div key={index} className="option-group my-3">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input
                                            style={{
                                                background: 'rgb(142 149 235 / 40%)'
                                            }}
                                            disabled
                                            type="text"
                                            placeholder={t('DashboardNewServiceItemPage.optionsAndVariationFormInputPlaceholder')}
                                            value={option?.attribute}
                                            onChange={(e) => handleOptionChange(index, 'attribute', e.target.value)}
                                            className="form-control"

                                        />
                                    </div>
                                </div>
                                {option?.values?.map((value, valueIndex) => (
                                    <div key={valueIndex} className="row">
                                        <div className="col-lg-6">
                                            <input
                                                disabled
                                                type="text"
                                                placeholder={t('DashboardNewServiceItemPage.optionsFormInputPlaceholder')}
                                                value={value?.name}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        index,
                                                        valueIndex,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <input
                                                disabled
                                                type="text"
                                                placeholder={t('DashboardNewServiceItemPage.optPriceFormInputPlaceholder')}
                                                value={value?.price}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        index,
                                                        valueIndex,
                                                        'price',
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }
        {/* <div className="row">
            <div className="col-lg-12">
                <div className="catalog__new__input">
                    <label>Options</label>
                    <button type="button" className="btn btn-link" onClick={handleAddOption}>Add Option</button>
                    {formData?.options?.map((option, index) => (
                        <div key={index} className="option-group">
                            <div className="row">
                                <div className="col-lg-6">
                                    <input
                                        type="text"
                                        placeholder="Attribute (e.g., Storage)"
                                        value={option?.attribute}
                                        onChange={(e) => handleOptionChange(index, 'attribute', e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            {
                                option?.values?.map((value, valueIndex) => (
                                    <div key={valueIndex} className="row">
                                        <div className="col-lg-6">
                                            <input
                                                type="text"
                                                placeholder="Option Name (e.g., 128 GB)"
                                                value={value?.name}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        index,
                                                        valueIndex,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <input
                                                type="text"
                                                placeholder="Price Impact"
                                                value={value?.price}
                                                onChange={(e) =>
                                                    handleValueChange(
                                                        index,
                                                        valueIndex,
                                                        'price',
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                            <button type="button" onClick={() => handleAddValue(index)} className="btn btn-link">Add Value</button>
                        </div>
                    ))}
                </div>
            </div>
        </div> */}
        <div className="form__submit__button">
            <button type="submit" className="btn btn-primary">
                {id ? `${t('DashboardNewServiceItemPage.updateCatalogBtn')}` : `${t('DashboardNewServiceItemPage.addCatalogBtn')}`}
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
