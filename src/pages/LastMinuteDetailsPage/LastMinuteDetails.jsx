import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import ProductDetailsSec from '../../components/productDetailsSecc/ProductDetailsSec';
import ProductDetailsDescriptionContent from '../../components/productDetailsDescriptionContentSec/ProductDetailsDescriptionContent';

export default function LastMinuteDetails({ token }) {
    const { singleDeal } = useParams();
    const [newSingleData, setNewSingledata] = useState([])

    const fetchLastMinuteDealsSingle = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/show-last-minute-deal/${singleDeal}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewSingledata(response?.data?.data?.last_minute_deal);
        } catch (error) {
            setNewSingledata(error?.response?.data.message);
        }
    };
    useEffect(() => {
        fetchLastMinuteDealsSingle();
    }, []);

    return (
        <div className='productDetailsPage'>
            <ProductDetailsSec itemType={'lastMinuteDeal'} product={newSingleData} token={token} />
            <ProductDetailsDescriptionContent product={newSingleData} />
        </div>
    )
}
