import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';

export default function NewPostForm({ token }) {
    const loginType = localStorage.getItem('loginType')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        type: ''  /* news || discount || announcement */
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
        const submissionData = new FormData();
        ;

        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });


        try {
            const response = await axios.post(`${baseURL}/${loginType}/add-post`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);

            if (response.status === 200) {

                navigate('/profile/posts')
                scrollToTop()
                toast.success('post added successfully');
                // Reset form if needed
            } else {
                toast.error('Failed to add post');
            }
        } catch (error) {
            console.error("Error: ", error.response || error.message);
            toast.error('Error adding post..');
        }
    };
    return (
        <>
            <div className='dashboard__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader />
                    <div className='newCatalogItem__form__handler'>
                        <ContentViewHeader title={'Add post to posts'} />
                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="title_en">Post Title in English</label>
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
                                        <label htmlFor="title_ar">Post Title in Arabic</label>
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
                                        <label htmlFor="type">Post Type</label>
                                        <select
                                            name="type"
                                            className="form-control custom-select"
                                            value={formData?.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select post type</option>
                                            <option value="news">News</option>
                                            <option value="discount">Discount</option>
                                            <option value="announcement">Announcement</option>
                                        </select>
                                    </div>
                                </div>
                            </div>    
                            <div className="form__submit__button">
                                <button type="submit" className="btn btn-primary">
                                    Add Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
