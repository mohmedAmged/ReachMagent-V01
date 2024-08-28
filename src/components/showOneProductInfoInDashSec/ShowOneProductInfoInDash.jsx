import React, { useEffect, useState } from 'react';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import './showOneProductInfoInDash.css';
import MyLoader from '../myLoaderSec/MyLoader';
import toast from 'react-hot-toast';

export default function ShowOneProductInfoInDash({ token }) {
    const [loading, setLoading] = useState(true);
    const { prodInfoId } = useParams();
    const loginType = localStorage.getItem('loginType');

    const [newData, setNewdata] = useState([]);
    const fetchProductInfo = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/show-product/${prodInfoId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    useEffect(() => {
        fetchProductInfo();
    }, [loginType, token]);

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
            <div className='dashboard__handler showOneProductInDash__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
                <MainContentHeader />
                <div className='content__view__handler'>
                    <ContentViewHeader title={`${newData?.title} main Details`} />
                    <div className="content__card__list">
                        <div className="row">
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                    {newData?.title} media
                                </h5>
                                <div className="showProdImagesInDash__handler">
                                    {
                                        newData?.productImages?.map((el) => {
                                            return (
                                                <div key={el?.id}>
                                                    <div className="prod__image__item">
                                                        <img src={el?.image} alt={`prod-img-${prodInfoId}`} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                    {newData?.title} Description
                                </h5>
                                <p>
                                    {newData?.description}
                                </p>
                            </div>
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                {newData?.title} Price Information
                                </h5>
                                <div className="row">
                                    <div className="col-6">
                                        <h6>
                                            price
                                        </h6>
                                        <p>
                                            {newData?.price}
                                        </p>
                                    </div>
                                    {
                                        newData?.discountPrice &&
                                        <div className="col-6">
                                            <h6>
                                            Discount Price
                                            </h6>
                                            <p>
                                                {newData?.discountPrice}
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                {newData?.title} Category
                                </h5>
                                <div className="row">
                                    <div className="col-6">
                                        <h6>
                                            Category
                                        </h6>
                                        <p>
                                        {newData?.category}
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <h6>
                                            Sub-Category
                                        </h6>
                                        <p>
                                        {newData?.subCategory}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {
                                newData?.productAttribute !== 'N/A' && 
                                <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                {newData?.title} Attributes
                                </h5>
                                <div className="row">
                                    {
                                        newData?.productAttributeValues?.map((att)=>{
                                            return(
                                                <div key={att?.id} className="col-lg-6">
                                                    <p>
                                                        value: <span>{att?.value}</span>
                                                    </p>
                                                    <p>
                                                        stock: <span>{att?.stock}</span>
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            }
                            
                            <div className="col-12 showOneProductDash__item mb-5">
                                <h5>
                                {newData?.title} total Stock
                                </h5>
                                <p>
                                {newData?.totalStock}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        }
        </>
    );
};
