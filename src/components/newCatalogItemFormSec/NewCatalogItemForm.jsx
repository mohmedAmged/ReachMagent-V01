import React, { useEffect, useState } from 'react';
import './newCatalogItemForm.css';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie'
import UnAuthSec from '../unAuthSection/UnAuthSec';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function NewCatalogItemForm({ token }) {
    const [activeTooltip, setActiveTooltip] = useState(null);
    
    const toggleTooltip = (key) => {
    setActiveTooltip(prev => (prev === key ? null : key));
    };
    const { t } = useTranslation();
    const [unAuth, setUnAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [previewImages, setPreviewImages] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [currCatalog, setCurrCatalog] = useState(null);
    const allTypes = [
        {
            id: 1,
            name: 'Company provides door-to-door shipping for this item',
            renderName: `${t('DashboardNewCatalogItemPage.doorTodoorType')}`,
            tooltipText: `${t('DashboardNewCatalogItemPage.doorTodoorTypeTitle')}`
        },
        {
            id: 2,
            name: 'Shippable item',
            renderName: `${t('DashboardNewCatalogItemPage.shippableItemType')}`,
            tooltipText: `${t('DashboardNewCatalogItemPage.shippableItemTypeTitle')}`
        },
        {
            id: 3,
            name: 'Raw material',
            renderName: `${t('DashboardNewCatalogItemPage.rawMaterialType')}`,
            tooltipText: `${t('DashboardNewCatalogItemPage.rawMaterialTypeTitle')}`
        },
        {
            id: 4,
            name: 'Ready to be used',
            renderName: `${t('DashboardNewCatalogItemPage.readyType')}`,
            tooltipText: `${t('DashboardNewCatalogItemPage.readyTypeTitle')}`
        },
        {
            id: 5,
            name: 'Customization available',
            renderName: `${t('DashboardNewCatalogItemPage.customizationType')}`,
            tooltipText: `${t('DashboardNewCatalogItemPage.customizationTypeTitle')}`
        },
    ];

    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [allUnitsOfMeasure, setAllUnitsOfMeasure] = useState([]);

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
        price: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        code: '',
        unit_of_measure_id: '',
        tax: '',
        type: [],
        image: [],
        options: [],
        details: [{ label: '', value: '' }],
    });

    const handleAddOption = () => {
        setFormData(prevState => ({
            ...prevState,
            options: [...prevState.options, { attribute: '', values: [{ name: '', price: '' }] }]
        }));
    };

    const handleAddDetails = () => {
        setFormData(prevState => ({
            ...prevState,
            details: [...prevState.details, { label: '', value: '' }]
        }));
    };

    const handleDeleteDetail = (idx) => {
        setFormData(prevState => ({
            ...prevState,
            details: prevState?.details?.filter((el, i) => idx !== i && el)
        }));
    };

    const handleChangeDetailsInputs = (e, idx) => {
        setFormData(prevState => ({
            ...prevState,
            details: prevState.details.map((detail, i) =>
                i === idx ? { ...detail, [e.target.name]: e.target.value } : detail
            )
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

    const fetchUnitsOfMeasure = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/units-of-measure?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                }
            });
            setAllUnitsOfMeasure(response?.data?.data?.units_of_measure);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchUnitsOfMeasure();
    }, [loginType, token]);

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/show-catalog/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                })
                    .then(response => {
                        setCurrCatalog(response?.data?.data);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (formData.category_id) {
                setCurrentSubCategoriesInsideMainCategory([]);
                const selectedCategory = mainCategories.find(
                    (cat) => cat.mainCategoryId === +formData.category_id
                );
                if (selectedCategory) {
                    const slug = selectedCategory.mainCategorySlug;
                    try {
                        const timestamp = new Date().getTime();
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

    useEffect(() => {
        if (currCatalog?.slug && currCatalog?.slug === id) {
            setFormData({
                title_ar: currCatalog?.title_ar || '',
                title_en: currCatalog?.title_en || '',
                description_ar: currCatalog?.description_ar || '',
                description_en: currCatalog?.description_en || '',
                price: currCatalog?.price || '',
                category_id: mainCategories?.find(el => el?.mainCategoryName === currCatalog?.category)?.mainCategoryId || '',
                sub_category_id: currentSubCategoriesInsideMainCategory?.find(el => el?.subCategoryName === currCatalog?.subCategory)?.subCategoryId || '',
                status: currCatalog?.status,
                code: currCatalog?.code || '',
                unit_of_measure_id: +currCatalog?.unit_of_measure_id || '',
                tax: currCatalog?.tax || '',
                type: currCatalog?.catalogTypes?.map(el => el?.type) || [],
                image: currCatalog?.media?.map(el => el?.image) || [],
                options: currCatalog?.options?.map(el => el) || [],
                details: currCatalog?.details?.map(el => el) || [],
            })
        };
    }, [currCatalog]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tax' && value < 0) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: 0,
            }));
        } else if (name === 'tax' && value >= 100) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: 100,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleCheckboxChange = (id, name) => {
        setFormData((prevState) => {
            const updatedTypes = prevState.type.includes(name)
                ? prevState.type.filter((type) => type !== name)
                : [...prevState.type, name];
            return {
                ...prevState,
                type: updatedTypes,
            };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Update previews
        const newPreviews = files.map((file, index) => ({
            id: `${file.name}-${index}-${Date.now()}`,
            preview: URL.createObjectURL(file),
        }));

        // Update formData with raw file objects
        setFormData((prevState) => ({
            ...prevState,
            image: [...prevState.image, ...files],
        }));

        // Update previewImages state
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const handleImageDelete = (id) => {
        const imageToRemove = previewImages.find((img) => img.id === id);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
        };
        setPreviewImages((prev) => prev.filter((img) => img.id !== id));
        setFormData((prevState) => ({
            ...prevState,
            image: prevState.image.filter((_, index) =>
                previewImages.findIndex((img) => img.id === id) !== index
            ),
        }));
    };

    const handleBookmarkClick = (id) => {
        const clickedIndex = previewImages.findIndex((img) => img.id === id);

        if (clickedIndex === 0) return;

        const updatedPreviews = [
            previewImages[clickedIndex],
            ...previewImages.filter((_, index) => index !== clickedIndex),
        ];

        const updatedImages = [
            formData.image[clickedIndex],
            ...formData.image.filter((_, index) => index !== clickedIndex),
        ];

        setPreviewImages(updatedPreviews);
        setFormData((prevState) => ({
            ...prevState,
            image: updatedImages,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key !== 'options' && key !== 'image') {
                submissionData.append(key, formData[key]);
            };
        });
        formData.type.forEach((type, index) => {
            submissionData.append(`type[${index}]`, type);
        });
        formData.options.forEach((option, optionIndex) => {
            submissionData.append(`options[${optionIndex}][attribute]`, option.attribute);
            option.values.forEach((value, valueIndex) => {
                submissionData.append(`options[${optionIndex}][values][${valueIndex}][name]`, value.name);
                submissionData.append(`options[${optionIndex}][values][${valueIndex}][price]`, value.price);
            });
        });
        formData.details.forEach((detail, optionIndex) => {
            submissionData.append(`details[${optionIndex}][label]`, detail.label);
            submissionData.append(`details[${optionIndex}][value]`, detail.value);
        });

        formData.image.forEach((file, index) => {
            submissionData.append(`image[${index}]`, file);
        });

        const toastId = toast.loading('Submitting...');
        try {
            const url = id
                ? `${baseURL}/employee/update-catalog/${id}`
                : `${baseURL}/employee/add-catalog`;
            await axios.post(url, submissionData, {
                headers: 
                { 
                    Authorization: `Bearer ${token}`, 
                'Content-Type': 'multipart/form-data' 
            },
            });

            toast.success('Catalog saved successfully!', { id: toastId });
            navigate('/profile/catalog');
            scrollToTop();
        } catch (error) {
            toast.error('Failed to save catalog.', { id: toastId });

            if (error.response && error.response.data) {
                const errors = error.response.data.errors;

                if (errors) {
                    const allErrors = Object.values(errors).flat().join(', ');
                    toast.error(`Validation Errors: ${allErrors}`, { id: toastId });
                };
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
                            <div className='newCatalogItem__form__handler'>
                                <ContentViewHeader title={id ? `${t('DashboardNewCatalogItemPage.headerPageTextUpdate')}` : `${t('DashboardNewCatalogItemPage.headerPageTextAdd')}`} />
                                {
                                    unAuth ?
                                        <UnAuthSec />
                                        :
    <form className="catalog__form__items" onSubmit={handleFormSubmit}>
        <div className="row">
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="title_en">{t('DashboardNewCatalogItemPage.titleENFormInput')} <span className="requiredStar"> *</span>
                        <i title={t('DashboardNewCatalogItemPage.titleENFormInputTitle')} onClick={() => toggleTooltip('titleEn')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'titleEn' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewCatalogItemPage.titleENFormInputTitle')}
                        </div>
                        )}
                    </label>
                    <input
                        type="text"
                        name="title_en"
                        className="form-control"
                        placeholder={t('DashboardNewCatalogItemPage.titleENFormInputPlaceholder')}
                        value={formData?.title_en}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="title_ar">{t('DashboardNewCatalogItemPage.titleARFormInput')} <span className='optional'>({t('DashboardNewCatalogItemPage.optionalText')})</span>
                        <i title={t('DashboardNewCatalogItemPage.titleARFormInputTitle')} onClick={() => toggleTooltip('titleAr')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'titleAr' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewCatalogItemPage.titleARFormInputTitle')}
                        </div>
                        )}
                    </label>
                    <input
                        type="text"
                        name="title_ar"
                        className="form-control"
                        placeholder={t('DashboardNewCatalogItemPage.titleENFormInputPlaceholder')}
                        value={formData?.title_ar}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="category_id">{t('DashboardNewCatalogItemPage.categoryFormInput')} <span className="requiredStar"> *</span>
                        <i title={t('DashboardNewCatalogItemPage.categoryFormInputTitle')} onClick={() => toggleTooltip('category')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'category' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewCatalogItemPage.categoryFormInputTitle')}
                        </div>
                        )}
                    </label>
                    <select
                        name="category_id"
                        className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                        value={formData?.category_id}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>{t('DashboardNewCatalogItemPage.categoryFormInputPlaceholder')}</option>
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
                    <label htmlFor="sub_category_id">{t('DashboardNewCatalogItemPage.subCategoryFormInput')} <span className="requiredStar"> *</span>
                        <i title={t('DashboardNewCatalogItemPage.subCategoryFormInputTitle')} onClick={() => toggleTooltip('subCategory')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'subCategory' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewCatalogItemPage.subCategoryFormInputTitle')}
                        </div>
                        )}
                    </label>
                    <select
                        name="sub_category_id"
                        className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                        value={formData?.sub_category_id}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>{t('DashboardNewCatalogItemPage.subCategoryFormInputPlaceholder')}</option>
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
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="unit_of_measure_id">
                        {t('DashboardNewCatalogItemPage.unitOfMeasureFormInput')} <span className="requiredStar"> *</span>
                        <i title={t('DashboardNewCatalogItemPage.unitOfMeasureFormInputTitle')} onClick={() => toggleTooltip('unitMeasure')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'unitMeasure' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewCatalogItemPage.unitOfMeasureFormInputTitle')}
                        </div>
                        )}
                    </label>
                    <select
                        name="unit_of_measure_id"
                        className={`form-control custom-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                        value={formData?.unit_of_measure_id}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>{t('DashboardNewCatalogItemPage.unitOfMeasureFormInputPlaceholder')}</option>
                        {allUnitsOfMeasure?.map((unit) => (
                            <option key={unit?.id} value={unit?.id}>
                                {unit?.unit}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="catalog__new__input">
                    <label htmlFor="code">{t('DashboardNewCatalogItemPage.productCodeFormInput')} <span className='optional'>({t('DashboardNewCatalogItemPage.optionalText')})</span>
                        <i title={t('DashboardNewCatalogItemPage.productCodeFormInputTitle')} onClick={() => toggleTooltip('code')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                        {activeTooltip === 'code' && (
                        <div className="custom-tooltip position-absolute">
                        {t('DashboardNewCatalogItemPage.productCodeFormInputTitle')}
                        </div>
                        )}
                    </label>
                    <input
                        type="text"
                        name="code"
                        className="form-control"
                        placeholder={t('DashboardNewCatalogItemPage.titleENFormInputPlaceholder')}
                        value={formData?.code}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-8">
                <div className="catalog__new__input">
                    <label htmlFor="description_en">{t('DashboardNewCatalogItemPage.descriptionInEnglishFormInput')} <span className="requiredStar"> *</span>
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
                    <label htmlFor="description_ar">{t('DashboardNewCatalogItemPage.descriptionInArabicFormInput')} <span className='optional'>({t('DashboardNewCatalogItemPage.optionalText')})</span>
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
            <div className="col-lg-8">
                <div className="catalog__new__input">
                    <label htmlFor="price">{t('DashboardNewCatalogItemPage.priceFormInput')} <span className='optional'>({t('DashboardNewCatalogItemPage.optionalText')})</span>
                    </label>
                    <div className="custom-input-container">
                        <input
                            type="text"
                            id="price"
                            name="price"
                            className="form-control custom-input"
                            placeholder={t('DashboardNewCatalogItemPage.titleENFormInputPlaceholder')}
                            value={formData?.price}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="catalog__new__input">
                    <label htmlFor="tax">{t('DashboardNewCatalogItemPage.TaxFormInput')} % <span className='optional'>({t('DashboardNewCatalogItemPage.optionalText')})</span>
                    </label>
                    <div className="custom-input-container">
                        <input
                            type="number"
                            id="cata-tax"
                            name="tax"
                            min={0}
                            max={100}
                            className="form-control custom-input"
                            placeholder={t('DashboardNewCatalogItemPage.TaxFormInputPlaceholder')}
                            value={formData?.tax}
                            onChange={handleInputChange}
                        />

                    </div>
                </div>
            </div>
        </div>
        <div className="upload__image__btn">
            <label htmlFor="tax">
                {t('DashboardNewCatalogItemPage.AddImagesFormInput')}
                <br />
                <span style={{color: 'gray', fontSize: '14px'}}>({t('DashboardNewCatalogItemPage.AddImagesFormInputPlaceholder')})</span>
            </label>
            <input
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="form-control mt-2"
            />
            <div className="image-preview mt-4">
                {previewImages.map((image, index) => (
                    <div key={image.id} className="position-relative d-inline-block me-4">
                        <img
                            src={image.preview}
                            alt="Selected"
                            className="img-thumbnail"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <i
                            className={`bi bi-bookmark-star-fill ${index === 0 ? "text-warning" : "text-secondary"
                                } position-absolute bottom-0 start-0 cursor-pointer`}
                            style={{ fontSize: "1.5rem", transform: "translate(-50%, 50%)" }}
                            onClick={() => handleBookmarkClick(image.id)}
                            title={t('DashboardNewCatalogItemPage.setMainImgFormInput')}
                        ></i>
                        <i
                            className="bi bi-x-circle text-danger position-absolute top-0 end-0 cursor-pointer"
                            style={{ fontSize: "1.5rem", transform: "translate(50%, -50%)" }}
                            onClick={() => handleImageDelete(image.id)}
                            title={t('DashboardNewCatalogItemPage.removeImgFormInput')}
                        ></i>
                    </div>
                ))}
            </div>

        </div>
        <div className="catalog__check__points">
            {allTypes?.map((type) => (
                <div key={type?.id} className="check__item">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id={`type-${type?.id}`}
                            className="form-check-input"
                            checked={formData?.type?.includes(type?.name)}
                            onChange={() => handleCheckboxChange(type?.id, type?.name)}
                        />
                        <label htmlFor={`type-${type?.id}`} className="form-check-label">
                            {type?.renderName}
                            <i title={type?.tooltipText} onClick={() => toggleTooltip('type')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                            {activeTooltip === 'type' && (
                            <div className="custom-tooltip position-absolute">
                                {type?.tooltipText}
                            </div>
                            )}
                        </label>
                    </div>
                </div>
            ))}
        </div>
        <div style={{
            marginTop: '30px',
            borderTop: "1px solid #aaa"
        }} className="catalog__new__input">
            <h4 className='my-3'>
                {t('DashboardNewCatalogItemPage.productDetailsTit')}
                {
                    currCatalog ?
                        <>
                        </>
                        :
                        <span className="ms-3 btn btn-link" onClick={handleAddDetails}>{t('DashboardNewCatalogItemPage.addMoreDetailsBtn')}</span>
                }</h4>
            {
                currCatalog ?
                    currCatalog?.details?.map((input, idx) => (
                        <div key={idx} className="row">
                            <div className='col-md-6'>
                                <label htmlFor="labelInput">{t('DashboardNewCatalogItemPage.productLabelFormInput')}</label>
                                <input
                                    id='labelInput'
                                    style={{
                                        background: 'rgb(142 149 235 / 40%)'
                                    }}
                                    type="text"
                                    placeholder={t('DashboardNewCatalogItemPage.productLabelFormInput')}
                                    value={input?.label}
                                    name='label'
                                    disabled
                                    onChange={(e) => handleChangeDetailsInputs(e, idx)}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="valueInput">{t('DashboardNewCatalogItemPage.productValueFormInput')}</label>
                                <input
                                    id='valueInput'
                                    style={{
                                        background: '#f9f9f9'
                                    }}
                                    disabled
                                    type="text"
                                    placeholder={t('DashboardNewCatalogItemPage.productValueFormInput')}
                                    value={input?.value}
                                    name='value'
                                    onChange={(e) => handleChangeDetailsInputs(e, idx)}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    ))
                    :
                    formData?.details?.map((input, idx) => (
                        <div key={idx} className="row">
                            <div className='col-md-5'>
                                <label htmlFor="labelInput">{t('DashboardNewCatalogItemPage.productLabelFormInput')}</label>
                                <input
                                    id='labelInput'
                                    style={{
                                        background: 'rgb(142 149 235 / 20%)'
                                    }}
                                    type="text"
                                    placeholder={t('DashboardNewCatalogItemPage.productLabelFormInput')}
                                    value={input?.label}
                                    name='label'
                                    onChange={(e) => handleChangeDetailsInputs(e, idx)}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-5">
                                <label htmlFor="valueInput">{t('DashboardNewCatalogItemPage.productValueFormInput')}</label>
                                <input
                                    id='valueInput'
                                    style={{
                                        background: '#f9f9f9'
                                    }}
                                    type="text"
                                    placeholder={t('DashboardNewCatalogItemPage.productValueFormInput')}
                                    value={input?.value}
                                    name='value'
                                    onChange={(e) => handleChangeDetailsInputs(e, idx)}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-2 d-flex justify-content-center align-items-center">
                                <i className="bi bi-trash-fill fs-4 text-danger cursorPointer mt-3" onClick={() => handleDeleteDetail(idx)}></i>
                            </div>
                        </div>
                    ))
            }
        </div>
        {!id &&
            <div className="row">
                <div className="col-lg-12">
                    <div style={{
                        marginTop: '30px',
                        borderTop: "1px solid #aaa"
                    }} className="catalog__new__input">
                        <label className="fw-bold my-3">{t('DashboardNewCatalogItemPage.optionsAndVariationFormInput')}</label>
                        <button type="button" className="btn btn-link" onClick={handleAddOption}>{t('DashboardNewCatalogItemPage.addOptionBtn')}</button>
                        {formData?.options?.map((option, index) => (
                            <div key={index} className="option-group my-3">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input
                                            style={{
                                                background: 'rgb(142 149 235 / 30%)'
                                            }}
                                            type="text"
                                            placeholder={t('DashboardNewCatalogItemPage.optionsAndVariationFormInputPlaceholder')}
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
                                                placeholder={t('DashboardNewCatalogItemPage.optionsFormInputPlaceholder')}
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
                                                placeholder={t('DashboardNewCatalogItemPage.optPriceFormInputPlaceholder')}
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
                                <button type="button" onClick={() => handleAddValue(index)} className="btn btn-link">{t('DashboardNewCatalogItemPage.addValueBtn')}</button>
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
                        <label className="fw-bold my-3">{t('DashboardNewCatalogItemPage.optionsAndVariationFormInput')}</label>
                        <div className='text-end'>
                            <NavLink to={`/profile/catalog/edit-item/${id}/edit-option`}>
                                <button className='btn btn-outline-primary text-capitalize'>
                                    {t('DashboardNewCatalogItemPage.editOptionBtn')} <i className="bi bi-pencil-square"></i>
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
                                            placeholder={t('DashboardNewCatalogItemPage.optionsAndVariationFormInputPlaceholder')}
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
                                                placeholder={t('DashboardNewCatalogItemPage.optionsFormInputPlaceholder')}
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
                                                placeholder={t('DashboardNewCatalogItemPage.optPriceFormInputPlaceholder')}
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
        <div className="form__submit__button">
            <button type="submit" className="btn btn-primary">
                {id ? `${t('DashboardNewCatalogItemPage.updateCatalogBtn')}` : `${t('DashboardNewCatalogItemPage.addCatalogBtn')}`}
            </button>
        </div>
    </form>
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

