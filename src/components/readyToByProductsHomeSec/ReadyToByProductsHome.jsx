import React, { useEffect, useState } from 'react'
import BorderedNavigationBar from '../borderedNavigationBarSec/BorderedNavigationBar'

import ProductCard from '../productCardSec/ProductCard'
import HeaderSec from '../myHeaderSec/HeaderSec'
import { baseURL } from '../../functions/baseUrl'
import axios from 'axios'
import toast from 'react-hot-toast'
export default function ReadyToByProductsHome({ secMAinTitle,token }) {

    const listedNavigationItem = [
        {
            item: 'Featured Products',
            itemStyle: 'active'
        },
        {
            item: 'Most Selling'
        },
        {
            item: 'Recent Items'
        },
        {
            item: 'Trending Products'
        },

    ]
    const [newData, setNewdata] = useState([])
    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/products?t=${new Date().getTime()}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.products?.products);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
        };
    };
    useEffect(() => {
        fetchAllProducts();
    }, []);

    return (
        <div className='readyToBuySec__handler'>
            <div className="container">
                <div className="allCategory__header text-center mb-4">
                    <HeaderSec title={secMAinTitle}
                    />
                </div>
                {/* <div className="readyToBuy__navigationBar none__on__small__screen">
                    <ul className="listedNavigate">
                        {
                            listedNavigationItem.map((el, index) => {
                                return (
                                    <BorderedNavigationBar itemStyle={el.itemStyle} key={index} listTitle={el.item} />
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="readyToBuy__selectBar display__on__small__screen">
                    <>
                        <select name="" id="">
                            {
                                listedNavigationItem.map((el, index) => {
                                    return (
                                        <option key={index}>{el.item}</option>
                                    )
                                })
                            }

                        </select>
                    </>
                </div> */}
                <div className="readyToBuy__products">
                    <div className="row">
                        {
                            (newData?.length > 3 ? newData.slice(0, 3) : newData)?.map((el, index) => {
                                return (
                                    <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                                        <ProductCard
                                        productCurrancy={el?.currency_symbol}
                                        token={token}
                                        getCurrentProducts={fetchAllProducts} product={el}
                                        itemType={'product'}  prodSlug={el?.slug} 
                                        productImage={el.productImages[0]?.image} productName={el.title} productPrice={el.price} productRate={el.rate} productRateNum={el.rateCount} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
