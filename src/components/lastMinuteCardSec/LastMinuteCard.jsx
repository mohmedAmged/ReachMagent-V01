import React from 'react'
import './lastMinuteCard.css'
import timeImg from '../../assets/lastMinuteCardImgs/mdi_timer-sand.png'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
export default function LastMinuteCard({
    productImage,
    productName,
    dealTimeDay,
    dealTotPrice,
    productLink,
    dealQuantity,
    showCustomContent,
    buttonLabel = 'Know more',
    onKnowMoreClick,
    onAddClick,
    borderColor = 'rgba(148, 21, 21, 1)'
}) {
    const handleButtonClick = () => {
        if (buttonLabel === 'Know more' && onKnowMoreClick) {
            onKnowMoreClick();
        } else if (buttonLabel === 'Add' && onAddClick) {
            onAddClick();
        };
    };

    // Conditional styles
    const cardStyles = {
        background: 'var(--primary-white)',
        padding: '10px',
        borderRadius: '20px',
        border: `2px solid ${borderColor}`
    };
    const buttonClass = buttonLabel === 'Added' ? 'addedButtonStyle' : 'addButtonStyle';
    return (
        <>
            <div className='lastMinuteCard__handler' style={cardStyles} >
                <div className="product__image">
                    <img src={productImage} alt="product-imag" />
                </div>
                <div className="product__info">
                    <div className="main__info">
                        <NavLink className={'nav-link'} to={productLink ? productLink : ''} onClick={() => {
                                    scrollToTop();
                                }}>
                            <h3>{productName}</h3>

                        </NavLink>
                        {showCustomContent ? (
                            <p>Price on Request</p>
                        ) : (
                            <div className="deal__time">
                                <img src={timeImg} alt="time" />
                                <div className="deal__time__day">
                                    <p>Limit Date</p>
                                    <p>{dealTimeDay}</p>
                                </div>
                                {/* <div className="deal__time__hour">
                                    <p>{dealtimeHours}</p>
                                    <p>hours</p>
                                </div> */}
                            </div>
                        )}
                    </div>
                    <div className="sub__info">
                        <p>{dealQuantity}</p>
                        {/* <p>{dealTotPrice}</p> */}
                        <span className={`pageMainBtnStyle ${buttonClass}`} onClick={handleButtonClick}>
                            {buttonLabel}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
