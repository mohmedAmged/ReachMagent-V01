import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import './myFaqs.css'
import MyLoader from '../../components/myLoaderSec/MyLoader';
export default function MyFaqs({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);
    const fetchAllFaqs = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-faqs?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.faqs);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchAllFaqs();
    }, [loginType, token]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handleDeleteThisFaq = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-faq/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchAllFaqs()
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler allFaqsDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader />
                            <div className='content__view__handler'>
                                <ContentViewHeader title={'FAQs'} />
                                <div className="content__card__list">
                                    {
                                        newData?.length !== 0 ?
                                            <div className="row">
                                                {
                                                    newData?.map((el) => {
                                                        return (
                                                            <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                                                <div className='singleCompany__rectangleSec-slide'>
                                                                    <div className='deleteFaq__btn'>
                                                                        <i className="bi bi-x-circle" onClick={() => handleDeleteThisFaq(el?.id)}></i>
                                                                    </div>
                                                                    <h4>{el?.question}</h4>
                                                                    <p>{el?.answer}</p>


                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                            :
                                            <div className='row'>
                                                <div className="col-12 text-danger fs-5">
                                                    No Faqs Items Yet
                                                </div>
                                            </div>
                                    }

                                </div>
                                <div className='addNewItem__btn'>
                                    <NavLink
                                        onClick={() => {
                                            scrollToTop();
                                        }}
                                        to='/profile/faqs/addNewItem' className='nav-link'>
                                        <button >
                                            Add New Item
                                        </button>
                                    </NavLink>

                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
