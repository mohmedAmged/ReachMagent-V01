import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';

export default function NewFaqForm({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        question_ar: '',
        question_en: '',
        answer_ar: '',
        answer_en: '',
        status: 'active',
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
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });
        try {
            const response = await axios.post(`${baseURL}/${loginType}/add-faq`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/profile/faqs')
                scrollToTop()
                toast.success('Faq added successfully');
            } else {
                toast.error('Failed to add Faq item');
            }
        } catch (error) {
            toast.error('Error adding Faq item.');
        };
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
                    <MyLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            <div className='newCatalogItem__form__handler'>
                                <ContentViewHeader title={'Add New Faq to FAQS'} />
                                <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="question_en">Faq Question in English</label>
                                                <input
                                                    type="text"
                                                    name="question_en"
                                                    className="form-control"
                                                    placeholder="Enter your text"
                                                    value={formData?.question_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="question_ar">Faq Question in Arabic</label>
                                                <input
                                                    type="text"
                                                    name="question_ar"
                                                    className="form-control"
                                                    placeholder="Enter your text"
                                                    value={formData?.question_ar}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="answer_en">Asnwer in English</label>
                                                <textarea
                                                    name="answer_en"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.answer_en}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="answer_ar">Answer in Arabic</label>
                                                <textarea
                                                    name="answer_ar"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.answer_ar}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            Add New FAQ
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
