import React from 'react'
import './lastMinuteCard.css'
import timeImg from '../../assets/lastMinuteCardImgs/mdi_timer-sand.png'
export default function LastMinuteCard({
    productImage,
    productName,
    dealTimeDay,
    dealtimeHours,
    dealQuantity,
    showCustomContent, // Flag to determine which content to render
    buttonLabel = 'Know more', // Default button label
    onKnowMoreClick, // Handler for 'Know more' button click
    onAddClick // Handler for 'Add' button click
}) {
    // Function to handle button click based on buttonLabel
    const handleButtonClick = () => {
        if (buttonLabel === 'Know more' && onKnowMoreClick) {
            onKnowMoreClick();
        } else if (buttonLabel === 'Add' && onAddClick) {
            onAddClick();
        }
    };
    // Conditional styles
    const cardStyles = {
        background: 'var(--primary-white)',
        padding: '10px',
        borderRadius: '20px',
        border: showCustomContent && buttonLabel === 'Add' ? '1px solid rgba(0, 0, 0, 0.5)' : '2px solid rgba(148, 21, 21, 1)'
    };
    return (
        // <>
        //     <div className='lastMinuteCard__handler'>
        //         <div className="product__image">
        //             <img src={productImage} alt="product-imag" />
        //         </div>
        //         <div className="product__info">
        //             <div className="main__info">
        //                 <h3>
        //                     {productName}
        //                 </h3>
        //                 <div className="deal__time">
        //                     <img src={timeImg} alt="time" />
        //                     <div className="deal__time__day">
        //                         <p>
        //                             {dealTimeDay}
        //                         </p>
        //                         <p>
        //                             Day
        //                         </p>
        //                     </div>
        //                     <div className="deal__time__hour">
        //                         <p>
        //                             {dealtimeHours}
        //                         </p>
        //                         <p>
        //                             hours
        //                         </p>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="sub__info">
        //                 <p>
        //                     {dealQuantity}
        //                 </p>
        //                 <button className='pageMainBtnStyle'>
        //                     Know more
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </>
        <>
            <div className='lastMinuteCard__handler' style={cardStyles}>
                <div className="product__image">
                    <img src={productImage} alt="product-imag" />
                </div>
                <div className="product__info">
                    <div className="main__info">
                        <h3>{productName}</h3>
                        {showCustomContent ? (
                            <p>Price on Request</p>
                        ) : (
                            <div className="deal__time">
                                <img src={timeImg} alt="time" />
                                <div className="deal__time__day">
                                    <p>{dealTimeDay}</p>
                                    <p>Day</p>
                                </div>
                                <div className="deal__time__hour">
                                    <p>{dealtimeHours}</p>
                                    <p>hours</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="sub__info">
                        <p>{dealQuantity}</p>
                        <button className='pageMainBtnStyle' onClick={handleButtonClick}>
                            {buttonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
