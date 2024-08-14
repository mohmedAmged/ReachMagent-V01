import React, { useEffect, useState } from 'react'
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'

export default function ShowOneProductInfoInDash({ token }) {
    const { prodInfoId } = useParams()
    const loginType = localStorage.getItem('loginType')

    const [newData, setNewdata] = useState([])
    const fetchProductInfo = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/show-product/${prodInfoId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data);
        } catch (error) {
            setNewdata(error?.response?.data.message);
        }
    };
    useEffect(() => {
        fetchProductInfo();
    }, [loginType, token]);
    console.log(newData);

    return (
        <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader />
                <div className='content__view__handler'>
                    <ContentViewHeader title={'product Details'} />
                    <div className="content__card__list">
                        <div className="row">
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
