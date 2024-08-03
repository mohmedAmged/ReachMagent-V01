import React from 'react'
import './cartProduct.css'
export default function CartProduct({
    title,
    description,
    notes = 'Add notes', // Default value for notes
    imageSrc, // Optional image source
    showImage = true, // Flag to control image display
    onRemove,
    onDecreaseQuantity,
    onIncreaseQuantity,
    quantity
}) {
    return (
        // <div className="selectedProductItem__container">
        //     <div className="selectedProductItem__info">
        //         {showImage && imageSrc && (
        //             <div className="prod__img">
        //                 <img src={imageSrc} alt={title} />
        //             </div>
        //         )}
        //         <div className="selectedProductItem__text">
        //             <h3>{title}</h3>
        //             {description ? (
        //                 <div>
        //                     <strong>Description:</strong>
        //                     <p>{description}</p>
        //                 </div>
        //             ) : (
        //                 <p>{notes}</p>
        //             )}
        //         </div>
        //     </div>
        //     <div className="selectedProductItem__actions">
        //         <div className="delete__btn" onClick={onRemove}>
        //             <i className="bi bi-trash-fill"></i>
        //         </div>
        //         <div className="quantity__btns">
        //             <button className="decreaseBtn" onClick={onDecreaseQuantity}>-</button>
        //             <span>{quantity}</span>
        //             <button className="increaseBtn" onClick={onIncreaseQuantity}>+</button>
        //         </div>
        //     </div>
        // </div>
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
                <div className="delete__btn" onClick={onRemove}>
                    <i className="bi bi-trash-fill"></i>
                </div>
                <div className="quantity__btns">
                    <button className='decreaseBtn' onClick={onDecreaseQuantity}>-</button>
                    <span>{quantity}</span>
                    <button className='increaseBtn' onClick={onIncreaseQuantity}>+</button>
                </div>
            </div>
        </div>
    )
}
