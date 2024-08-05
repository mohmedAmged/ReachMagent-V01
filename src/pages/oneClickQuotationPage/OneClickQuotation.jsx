import React, { useState } from 'react'
import './oneClickQuotation.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import CartProduct from '../../components/cartProductSec/CartProduct'
import DestinationForm from '../../components/destinationFormSec/DestinationForm';
export default function OneClickQuotation() {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [includeShipping, setIncludeShipping] = useState(false);
    const [customProduct, setCustomProduct] = useState({
        title: '',
        quantity: 0,
        description: '',
    });
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

    const handleCheckboxChange = (e) => {
        setIncludeShipping(e.target.checked);
    };

    const handleCustomProductChange = (e) => {
        const { name, value } = e.target;
        setCustomProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleAddCustomProduct = () => {
        if (customProduct.title && customProduct.quantity > 0) {
            setSelectedProducts([...selectedProducts, {
                ...customProduct,
                id: Date.now(), // Generate a unique ID
                img: '', // No image for custom products
            }]);
            // Clear the form
            setCustomProduct({
                title: '',
                quantity: 0,
                description: '',
            });
        }
    };
    return (
        <div className='oneClickQuotation__handler'>
            <MyMainHeroSec
                heroSecContainerType='singleCompany__quote'
                headText='Explore all options'
                paraPartOne='Save  thousands to millions of bucks by using tool great skills, be a cool React Developer'
            />
            <>
                <div className="singleCompanyQuote__contents">
                    <div className="container">
                        <div className="singleCompanyQuote__headText">
                            <h1>
                                One-click quotation
                            </h1>
                            <p>
                                Get an Instant Quote with One Click
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
                                        <div className="col-lg-6">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Choose your region
                                                </label>
                                                <select className='form-select' name="" id="">
                                                    <option value="">region 1</option>
                                                    <option value="">region 2</option>
                                                    <option value="">region 3</option>
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
                                        <div className="customization__form row">
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="customTitle">
                                                        Title
                                                    </label>
                                                    <input
                                                        id="customTitle"
                                                        name="title"
                                                        className='form-control'
                                                        type="text"
                                                        placeholder='L-Shape Sofa-Grey'
                                                        value={customProduct.title}
                                                        onChange={handleCustomProductChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="customQuantity">
                                                        Quantity
                                                    </label>
                                                    <input
                                                        id="customQuantity"
                                                        name="quantity"
                                                        className='form-control'
                                                        type="number"
                                                        placeholder='5'
                                                        value={customProduct.quantity}
                                                        onChange={handleCustomProductChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="customDescription"
                                                        name="description"
                                                        className="form-control"
                                                        rows="3"
                                                        placeholder='The L-shaped sofa is the relax version of the long sofa. Its main feature is the extended terminal seat, which can be placed on the left or right side, on the basis of the living room design and the personal needs.'
                                                        value={customProduct.description}
                                                        onChange={handleCustomProductChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6"
                                            >
                                                <div className="customizationQuote__actions">
                                                    <button className='addedButtonStyle'>
                                                        Add files
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className='pageMainBtnStyle'
                                                        onClick={handleAddCustomProduct}
                                                    >
                                                        Add to Quotation
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="quotaionCheckInputs__handler mt-5">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                value=""
                                                checked={includeShipping}
                                                onChange={handleCheckboxChange}
                                                id="flexCheckDefault" />
                                            <label className="form-check-label" for="flexCheckDefault">
                                                Include Shipping
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault2" />
                                            <label className="form-check-label" for="flexCheckDefault2">
                                                Include Insurance
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {includeShipping && (
                                    <div className="col-12">
                                        <DestinationForm />
                                    </div>
                                )}
                                <div className="col-12">
                                    <div className="quotaionCheckInputs__handler mt-5">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                value=""
                                                id="flexCheckDefault3" />
                                            <label className="form-check-label" for="flexCheckDefault3">
                                                Hire ReachMagnet to inspect the items (50$/visit)
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault4" />
                                            <label className="form-check-label" for="flexCheckDefault4">
                                                Get insurance quotes
                                            </label>
                                        </div>
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
