import React, { useState } from 'react'
import './singleCompanyQuote.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import product1 from '../../assets/productImages/Rectangle 4705 (1).png'
import product2 from '../../assets/productImages/Rectangle 4705 (2).png'
import product3 from '../../assets/productImages/Rectangle 4705 (3).png'
import LastMinuteCard from '../../components/lastMinuteCardSec/LastMinuteCard';
export default function SingleCompanyQuote({ token }) {
    const { companyName } = useParams();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const productItems = [
        {
            id: 1,
            img: product1,
            title: 'Table Lamp',
            dealQuantity: 'Customizable'
        },
        {
            id: 2,
            img: product2,
            title: 'Ceiling Lamp ',
            dealQuantity: 'Customizable'
        },
        {
            id: 3,
            img: product3,
            title: 'Blue Wood Chair',
            dealQuantity: 'Customizable'
        },
        {
            id: 4,
            img: product1,
            title: 'Table Lamp',
            dealQuantity: 'Customizable'
        },
        {
            id: 5,
            img: product2,
            title: 'Ceiling Lamp ',
            dealQuantity: 'Customizable'
        },
        {
            id: 6,
            img: product3,
            title: 'Blue Wood Chair',
            dealQuantity: 'Customizable'
        },
    ]
    // add product to selected products
    const handleAddProduct = (product) => {
        setSelectedProducts([...selectedProducts, product]);
      };
    // remove product
    const handleRemoveProduct = (product) => {
        setSelectedProducts(selectedProducts.filter((p) => p !== product));
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
      };
    return (
        <div className='singleCompanyQuote__handler'>
            <MyMainHeroSec
                heroSecContainerType='singleCompany__quote'
                headText='Request an official Quote'
                paraPartOne='Save  thousands to millions of bucks by using tool great skills, be a cool React Developer'
            />
            <>
                <div className="singleCompanyQuote__contents">
                    <div className="container">
                        <div className="singleCompanyQuote__headText">
                            <h1>
                                Quote from <span>{companyName}</span>
                            </h1>
                            <p>
                                Request a Detailed {companyName} Quote
                            </p>
                        </div>
                        <div className="singleCompanyQuote__mainFrom">
                            <form action="" onSubmit={handleFormSubmit} className='row'>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Request Type
                                                </label>
                                                <select className='form-select' name="" id="">
                                                    <option value="">products</option>
                                                    <option value="">Catalog</option>
                                                    <option value="">Services</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-6">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="">
                                            Category
                                        </label>
                                        <select className='form-select' name="" id="">
                                            <option value="">products</option>
                                            <option value="">Catalog</option>
                                            <option value="">Services</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="singleQuoteInput">
                                        <label htmlFor="">
                                            Sub-category
                                        </label>
                                        <select className='form-select' name="" id="">
                                            <option value="">products</option>
                                            <option value="">Catalog</option>
                                            <option value="">Services</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="singleQuote__searchInput">
                                                <h3>
                                                    Want to add more products?
                                                </h3>
                                                <input className='form-control' type="text" placeholder='Search here' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="singleQuote__slideProducts ">

                                        <Swiper
                                            className='mySwiper'
                                            modules={[Autoplay]}
                                            autoplay={{
                                                delay: 2500,
                                                pauseOnMouseEnter: true,
                                                disableOnInteraction: false
                                            }}
                                            // loop
                                            breakpoints={{
                                                300: {
                                                    slidesPerView: 1.1,
                                                    spaceBetween: 10
                                                },
                                                426: {
                                                    slidesPerView: 1.2,
                                                    spaceBetween: 20
                                                },
                                                600: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                768: {
                                                    slidesPerView: 2.2,
                                                    spaceBetween: 15
                                                },
                                                995: {
                                                    slidesPerView: 3.2,
                                                    spaceBetween: 20
                                                },
                                            }}
                                        >
                                            {productItems.map((el, index) => {
                                               const isAdded = selectedProducts.some((selectedProduct) => selectedProduct.id === el.id);
                                                return (
                                                    <SwiperSlide className=' my-3' key={index}>
                                                        <LastMinuteCard
                                                            productImage={el.img}
                                                            productName={el.title}
                                                            dealQuantity={el.dealQuantity}
                                                            showCustomContent={true}
                                                            buttonLabel={isAdded ? "Added" : "Add"}
                                                            onAddClick={() => handleAddProduct(el)}
                                                            // Conditional border color
                                                            borderColor={isAdded ? 'rgba(7, 82, 154, 1)' : 'rgba(0, 0, 0, 0.5)'}
                                                        />
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                    </div>
                                </div>
                                {/* <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="selectedProducts__handler">
                                                <h3>
                                                    Selected Products
                                                </h3>
                                                <div className="selected__product__item">
                                                    <div className="selected__product__info">
                                                        <div className="prod__img">
                                                            <img src={product2} alt="" />
                                                        </div>
                                                        <div className="prod__text">
                                                            <h3>
                                                                MDF Wood TV Unit
                                                            </h3>
                                                            <p>
                                                                Add notes
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="selected__product__action">
                                                        <div className="delete__btn">
                                                            <i className="bi bi-trash-fill"></i>
                                                        </div>
                                                        <div className="quantity__btns">
                                                            <button className='decreaseBtn'>-</button>
                                                            <span>0</span>
                                                            <button className='increaseBtn'>+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="selectedProducts__handler">
                                                <h3>
                                                    Selected Products
                                                </h3>
                                                {selectedProducts.length === 0 ? (
                                                    <p>No products selected</p>
                                                ) : (
                                                    selectedProducts.map((product, index) => (
                                                        <div className="selected__product__item" key={index}>
                                                            <div className="selected__product__info">
                                                                <div className="prod__img">
                                                                    <img src={product.img} alt="" />
                                                                </div>
                                                                <div className="prod__text">
                                                                    <h3>{product.title}</h3>
                                                                    <p>Add notes</p>
                                                                </div>
                                                            </div>
                                                            <div className="selected__product__action">
                                                                <div className="delete__btn" onClick={() => handleRemoveProduct(product)}>
                                                                    <i className="bi bi-trash-fill"></i>
                                                                </div>
                                                                <div className="quantity__btns">
                                                                    <button className='decreaseBtn'>-</button>
                                                                    <span>0</span>
                                                                    <button className='increaseBtn'>+</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}
