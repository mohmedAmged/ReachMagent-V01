import React, { useEffect, useState } from 'react';
import './newCatalogItemForm.css';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import {  useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';

export default function NewCatalogItemForm({ mainCategories, token }) {
    const loginType = localStorage.getItem('loginType')
    const navigate = useNavigate()
    const allTypes = [
        {
            id: 1,
            name: 'Company provides door-to-door shipping for this item',
        },
        {
            id: 2,
            name: 'Shippable item',
        },
        
        {
            id: 3,
            name: 'Raw material',
        },
        {
            id: 4,
            name: 'Ready to be used',
        },
        {
            id: 5,
            name: 'Customization available',
        }
    ];

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        price: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        type: [],
        image: [],
    });

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
                        const timestamp = new Date().getTime(); // Cache-busting
                        const response = await axios.get(`${baseURL}/main-categories/${slug}?t=${timestamp}`);
                        if (response.status === 200) {
                            setCurrentSubCategoriesInsideMainCategory(response.data.data.subCategories);
                        } else {
                            toast.error('Failed to fetch subcategories');
                        }
                    } catch (error) {
                        toast.error('Error fetching subcategories.');
                    }
                }
            }
        };

        fetchSubCategories();
    }, [formData.category_id, mainCategories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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
        setFormData((prevState) => ({
            ...prevState,
            image: files,
        }));
    };

    //     e.preventDefault();
    //     try {
    //         const formDataToSend = {
    //             ...formData,
    //             images: formData.images, // Assuming images are handled correctly
    //         };
    //         const response = await axios.post(`${baseURL}/employee/add-catalog`, formDataToSend, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         if (response.status === 200) {
    //             toast.success('Catalog item added successfully');
    //             // Reset form if needed
    //         } else {
    //             toast.error('Failed to add catalog item');
    //         }
    //     } catch (error) {
    //         toast.error('Error adding catalog item.');
    //     }
    // };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        ;

        Object.keys(formData).forEach((key) => {
            if (key !== 'image' && !Array.isArray(formData[key])) {
                submissionData.append(key, formData[key]);
            }
        });
        formData.type.forEach((type, index)=>{
            submissionData.append(`type[${index}]`, type);
        })
        formData.image.forEach((image, index) => {
            submissionData.append(`image[${index}]`, image);
        })
        try {
            const response = await axios.post(`${baseURL}/${loginType}/add-catalog`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/profile/catalog')
                scrollToTop()
                toast.success('Catalog item added successfully');
                // Reset form if needed
            } else {
                toast.error('Failed to add catalog item');
            }
        } catch (error) {
            console.error("Error: ", error.response || error.message);
            toast.error('Error adding catalog item.');
        }
    };
    return (
        <>
            <div className='dashboard__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader />
                    <div className='newCatalogItem__form__handler'>
                        <ContentViewHeader title={'Add Item to Catalog'} />
                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="title_en">Product Name in English</label>
                                        <input
                                            type="text"
                                            name="title_en"
                                            className="form-control"
                                            placeholder="Enter your text"
                                            value={formData?.title_en}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="title_ar">Product Name in Arabic</label>
                                        <input
                                            type="text"
                                            name="title_ar"
                                            className="form-control"
                                            placeholder="Enter your text"
                                            value={formData?.title_ar}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="category_id">Category</label>
                                        <select
                                            name="category_id"
                                            className="form-control custom-select"
                                            value={formData?.category_id}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Category</option>
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
                                        <label htmlFor="sub_category_id">Sub Category</label>
                                        <select
                                            name="sub_category_id"
                                            className="form-control custom-select"
                                            value={formData?.sub_category_id}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Sub Category</option>
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
                                        <label htmlFor="description_en">Description in English</label>
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
                                        <label htmlFor="description_ar">Description in Arabic</label>
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
                                        <label htmlFor="price">Price</label>
                                        <div className="custom-input-container">
                                            <input
                                                type="text"
                                                id="price"
                                                name="price"
                                                className="form-control custom-input"
                                                placeholder="Enter your text"
                                                value={formData?.price}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="currency" className="currency__label">Currency:</label>
                                            <select
                                                name="currency"
                                                className="form-control custom-select"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="EGP">EGP</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="upload__image__btn">
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleImageChange}
                                    className="form-control"
                                />
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
                                                {type?.name}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="form__submit__button">
                                <button type="submit" className="btn btn-primary">
                                    Add Catalog Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

