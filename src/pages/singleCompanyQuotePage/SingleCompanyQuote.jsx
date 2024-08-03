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
import CartProduct from '../../components/cartProductSec/CartProduct';
export default function SingleCompanyQuote({ token }) {
    const { companyName } = useParams();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const productItems = [
        {
            id: 1,
            img: product1,
            title: 'Table Lamp',
            quantity: 0,
            dealQuantity: 'Customizable'
        },
        {
            id: 2,
            img: product2,
            title: 'Ceiling Lamp ',
            quantity: 0,
            dealQuantity: 'Customizable'
        },
        {
            id: 3,
            img: product3,
            title: 'Blue Wood Chair',
            quantity: 0,
            dealQuantity: 'Customizable'
        },
        {
            id: 4,
            img: product1,
            title: 'Table Lamp',
            quantity: 0,
            dealQuantity: 'Customizable'
        },
        {
            id: 5,
            img: product2,
            title: 'Ceiling Lamp ',
            quantity: 0,
            dealQuantity: 'Customizable'
        },
        {
            id: 6,
            img: product3,
            title: 'Blue Wood Chair',
            quantity: 0,
            dealQuantity: 'Customizable'
        },
    ]
    // add product to selected products
    const handleAddProduct = (product) => {
        setSelectedProducts([...selectedProducts, product]);
    };
    // remove product
    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter((product) => product.id !== productId));
    };

    const handleDecreaseQuantity = (productId) => {
        setSelectedProducts(selectedProducts.map(product =>
            product.id === productId ? { ...product, quantity: Math.max(product.quantity - 1, 0) } : product
        ));
    };

    const handleIncreaseQuantity = (productId) => {
        setSelectedProducts(selectedProducts.map(product =>
            product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
        ));
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
                                                        <CartProduct
                                                            key={index}
                                                            title={product.title}
                                                            description={product.description}
                                                            notes={product.notes}
                                                            imageSrc={product.img}
                                                            showImage={!!product.img} // Show image if imageSrc is provided
                                                            quantity={product.quantity}
                                                            onRemove={() => handleRemoveProduct(product.id)}
                                                            onDecreaseQuantity={() => handleDecreaseQuantity(product.id)}
                                                            onIncreaseQuantity={() => handleIncreaseQuantity(product.id)}
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="customizationQuote__handler">
                                        <h3>
                                            <span>{companyName}</span> Offers Customization
                                        </h3>
                                        <div className="customization__form row">
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Title
                                                    </label>
                                                    <input className='form-control' type="text" placeholder='L-Shape Sofa-Grey' />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Quantity
                                                    </label>
                                                    <input className='form-control' type="text" placeholder='5' />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Description
                                                    </label>
                                                    <textarea class="form-control" id="" rows="3" placeholder='The L-shaped sofa is the relax version of the long sofa. Its main feature is the extended terminal seat, which can be placed on the left or right side, on the basis of the living room design and the personal needs.'></textarea>
                                                </div>
                                            </div>
                                            <div className="col-lg-6"
                                            >
                                                <div className="customizationQuote__actions">
                                                    <button className='addedButtonStyle'>
                                                        Add files
                                                    </button>
                                                    <button className='pageMainBtnStyle'>
                                                        Add to Quotation
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="destinationQuote__handler">
                                        <h3>
                                            Destination
                                        </h3>
                                        <form className="destinationQuote__form row">
                                            <div className="col-lg-4 col-md-4">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Country
                                                    </label>
                                                    <select className='form-select' name="" id="" placeholder=''>
                                                        <option value disabled selected>Choose your country</option>
                                                        <option value="">2</option>
                                                        <option value="">3</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        City
                                                    </label>
                                                    <select className='form-select' name="" id="">
                                                        <option value disabled selected>Choose your city</option>
                                                        <option value="">2</option>
                                                        <option value="">3</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Area
                                                    </label>
                                                    <select className='form-select' name="" id="">
                                                        <option value disabled selected>Choose your area</option>
                                                        <option value="">2</option>
                                                        <option value="">3</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                            <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Description
                                                    </label>
                                                    <textarea class="form-control" id="" rows="3" placeholder='Enter the address'></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className='addedButtonStyle btnSubmitQuote mt-5'>
                                    Submit quotation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}