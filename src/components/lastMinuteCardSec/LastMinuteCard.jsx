import React, { useState } from 'react'
import './lastMinuteCard.css'
import timeImg from '../../assets/lastMinuteCardImgs/mdi_timer-sand.png'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
export default function LastMinuteCard({
    productImage,
    productName,
    dealTimeDay,
    // dealTotPrice,
    productLink,
    // dealQuantity,
    showCustomContent,
    buttonLabel = 'Know more',
    onKnowMoreClick,
    onAddClick,
    borderColor = 'rgba(148, 21, 21, 1)',
    showMoreDetails= false,
    productCatgeory,
    productCompany,
    productCompanySlug,
    data,
    setSelectedPreferences,
    selectedPreferences, 
    onDublicateItem,
    renderdublicate,
    renderOptionData = false,
    showOption,
    setShowOption,
    handleCloseOption,
    handleShowOption

}) {
    const handleButtonClick = () => {
        if (buttonLabel === 'Know more' && onKnowMoreClick) {
            onKnowMoreClick();
        } else if (buttonLabel === 'Add' && onAddClick) {
            onAddClick();
        };
    };

     const handleModalSubmit = () => {
        const allSelected = data.options.every(
            option => selectedPreferences[option.attribute_id]
        );

        if (!allSelected) {
            toast.error('Please select all options before submitting.');
            return;
        }

        toast.success('options added successufully')
        console.log('Selected preferences:', selectedPreferences);

        handleCloseOption();
    };

    const cardStyles = {
        background: 'var(--primary-white)',
        padding: '10px',
        borderRadius: '20px',
        border: `2px solid ${borderColor}`
    };
    const buttonClass = buttonLabel === 'Added' ? 'addedButtonStyle' : 'addButtonStyle';
console.log(data);
    return (
        <>
            <div className='lastMinuteCard__handler' style={cardStyles} >
                <div className="product__image">
                    <img src={productImage} alt="product-imag" />
                </div>
                <div className="product__info align-items-center">
                    <div className="main__info">
                        <NavLink target="_blank" className={'nav-link'} to={productLink ? productLink : ''} onClick={() => {
                            scrollToTop();
                        }}>
                            <h3 className='text-capitalize' title={productName}> 
                                {productName.length > 20 ? `${productName.slice(0, 25)}...` : productName}
                                {/* {productName} */}
                            </h3>

                        </NavLink>
                        {showCustomContent ? (
                            <>
                                <p>Price on Request</p>
                            </>
                            
                            
                        ) : (
                            <div className="deal__time">
                                <img src={timeImg} alt="time" />
                                <div className="deal__time__day">
                                    <p>Limit Date</p>
                                    <p>{dealTimeDay}</p>
                                </div>
                            </div>
                        )}
                        {
                            renderOptionData && data?.options?.length > 0 &&
                            (<>
                            
                                <button
                                type='button'
                                onClick={handleShowOption}
                                className='btnColoredBlue addMoreOptionsBtn terquase mt-3'
                            >
                               Choose options
                            </button>
                             <Modal show={showOption} onHide={handleCloseOption}>
                                    <div className='container'>
                                        <form  className="row bookAppointMentForm">
                                            <Modal.Header closeButton>
                                                <Modal.Title>Select Options</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                            {data.options.map((option, index) => (
                                <div key={option.attribute_id}>
                                    <div className=''>
                                        <label className='text-capitalize my-2'>{option.attribute}</label>
                                        <select
                                        className='form-select w-80'
                                        onChange={(e) =>
                                            setSelectedPreferences(prev => ({
                                            ...prev,
                                            [option.attribute_id]: e.target.value
                                            }))
                                        }
                                        value={selectedPreferences[option.attribute_id] || ''}
                                        >
                                        <option value="" disabled>Select one option</option>
                                        {option.values.map(val => (
                                            <option key={val.id} value={val.id}>
                                            {val.name}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    
                                </div>
                            ))}
                                            </Modal.Body>
                                            <Modal.Footer className='d-flex justify-content-center'>
                                                <Button variant="outline-danger" className='py-2' onClick={handleCloseOption}>
                                                    Cancel
                                                </Button>
                                                <button
                                                    type="button"
                                                    className='contactCompany__form-submitBtn m-auto w-auto fs-5 fw-light px-2 py-1'
                                                    onClick={handleModalSubmit}
                                                >
                                                    Submit
                                                </button>
                                            </Modal.Footer>
                                        </form>
                                    </div>
                            </Modal>
                            </>)
                        }
                        { showMoreDetails === true && 
                            <h4 style={{fontSize:'18px', color:'#412794', textTransform:'capitalize'}}>
                                 <NavLink target='_blank' className='nav-link'  to={`/${productCompanySlug}`}>
                                            {productCompany}
                                        </NavLink>
                            </h4>
                        }
                    </div>
                    <div className="sub__info">
                        {/* <p>{dealQuantity}</p> */}
                        <NavLink target="_blank" to={productLink ? productLink : ''} className="pageMainBtnStyle terquase mb-2">More Info <i class="bi bi-box-arrow-up-right"></i>
                        </NavLink>
                        <span className={`pageMainBtnStyle d-flex justify-content-center ${buttonClass}`} onClick={handleButtonClick}>
                            {buttonLabel}
                        </span>
                         {renderdublicate && data?.options?.length > 0 &&
                            <button type='button' className={`pageMainBtnStyle d-flex justify-content-center mt-3`} onClick={onDublicateItem}>
                            Add More 
                        </button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
