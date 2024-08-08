import React from 'react'
import './cartProduct.css'
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
export default function CartProduct({
    title,
    description,
    notes = 'Add notes', 
    imageSrc,
    showImage = true,
    cartId,
    quantity,
    companyIdWantedToHaveQuoteWith,
    setCart,
    token
}) {
    const loginType = localStorage.getItem('loginType');
    const handleRemoveProduct = (id) => {
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/${loginType}/delete-item-from-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
            {
                quotation_cart_id: `${id}`,
            }
            ,{
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setCart(response?.data?.data?.cart);
                toast.success(`${response?.data?.message || 'Added Successfully!'}`,{
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(error=>{
                console.log(error);
                toast.error(`${error?.response?.data?.message || 'Error!'}`,{
                    id: toastId,
                    duration: 1000
                });
            })
        })();
    };

    const handleDecreaseOrIncrease = (id,type) => {
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/${loginType}/control-quantity-for-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
            {
                quotation_cart_id: `${id}`,
                quantity_type: `${type}`,
            }
            ,{
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setCart(response?.data?.data?.cart);
                toast.success(`${response?.data?.message || 'Added Successfully!'}`,{
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(error=>{
                console.log(error);
                toast.error(`${error?.response?.data?.message || 'Error!'}`,{
                    id: toastId,
                    duration: 1000
                });
            })
        })();
    };

    return (
        <div className="selected__product__item" >
            <div className="selected__product__info">
                {showImage && imageSrc && (
                    <div className="prod__img">
                        <img src={imageSrc} alt={title} />
                    </div>
                )}
                <div className="prod__text">
                    <h3>{title}</h3>
                    {description ? (
                        <div>
                            <strong>Description:</strong>
                            <p>{description}</p>
                        </div>
                    ) : (
                        <p>{notes}</p>
                    )}
                </div>
            </div>
            <div className="selected__product__action">
                <div className="delete__btn" onClick={()=> handleRemoveProduct(cartId)}>
                    <i className="bi bi-trash-fill"></i>
                </div>
                <div className="quantity__btns">
                    <p className='decreaseBtn' onClick={()=> handleDecreaseOrIncrease(cartId,'decrease')}>-</p>
                    <span>{quantity}</span>
                    <p  className='increaseBtn' onClick={()=> handleDecreaseOrIncrease(cartId,'increase')}>+</p>
                </div>
            </div>
        </div>
    )
}
