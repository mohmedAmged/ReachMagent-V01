import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function MyService({ token }) {
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])


    const fetchServices = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-services?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.services);
        } catch (error) {
            setNewdata(error?.response?.data.message);
        }
    };
    useEffect(() => {
        fetchServices();
    }, [loginType, token]);

    const handleDeleteThisService = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-service/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            // Optionally update the state to remove the deleted item from the UI
            await fetchServices()
            // setNewdata(newData?.filter(item => item?.id !== id));
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };
    return (
        <>
            <div className='dashboard__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader />
                    <div className='content__view__handler'>
                        <ContentViewHeader title={'Services'} />
                        <div className="content__card__list">
                            {
                                newData?.length !== 0 ?
                                    <div className="row">
                                        {
                                            newData?.map((el) => {
                                                return (
                                                    <div className='col-lg-6 d-flex justify-content-center mb-3' key={el?.id}>
                                                        <div className="card__item">
                                                            <div className="card__image">
                                                                <img src={el?.image} alt={el?.title} />
                                                            </div>
                                                            <div className="card__name">
                                                                <h3>
                                                                    {el?.title}
                                                                </h3>
                                                            </div>
                                                            <div className="card__btns d-flex">
                                                                <>
                                                                    <button
                                                                        onClick={() => handleDeleteThisService(el?.id)}
                                                                        className='btn__D'>
                                                                        Delete
                                                                    </button>
                                                                </>
                                                                <>
                                                                    <button className='btn__E'>
                                                                        Edit
                                                                    </button>
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <div className='row'>
                                        <div className="col-12 text-danger fs-5">
                                            No Service Items Yet
                                        </div>
                                    </div>
                            }

                        </div>
                        <div className='addNewItem__btn'>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }}
                                to='/profile/service/addNewItem' className='nav-link'>
                                <button >
                                    Add New Item
                                </button>
                            </NavLink>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
