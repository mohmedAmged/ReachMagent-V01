import React from 'react'
import './newCatalogItemForm.css'
import ContentViewHeader from '../contentViewHeader/ContentViewHeader'
export default function NewCatalogItemForm() {
    return (
        <div className='newCatalogItem__form__handler'>
            <ContentViewHeader title={'Add Item to Catalog'} />
            <div className="catalog__form__items">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="catalog__new__input">
                            <label htmlFor="">
                                product Name
                            </label>
                            <input type="text" className='form-control' placeholder='enter your text'/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="catalog__new__input">
                            <label htmlFor="">
                                price
                            </label>
                            <div className="custom-input-container">
                                <input type="text" id="price" className="form-control custom-input" placeholder='enter your text'/>
                                <label htmlFor="" className='currency__label'>currency:</label>
                                <select id="currency" className="form-control custom-select">
                                    <option value="usd">USD</option>
                                    <option value="egp">EGP</option>
                                    <option value="eur">EUR</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="catalog__new__input">
                            <label htmlFor="">
                                Category
                            </label>
                            <select id="currency" className="form-control custom-select">
                                <option value="usd">products 1</option>
                                <option value="egp">products 2</option>
                                <option value="eur">products 3</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="catalog__new__input">
                            <label htmlFor="">
                                Sub Category
                            </label>
                            <select id="currency" className="form-control custom-select">
                                <option value="usd">products 1</option>
                                <option value="egp">products 2</option>
                                <option value="eur">products 3</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="catalog__new__input">
                            <label for="exampleFormControlTextarea1" className="form-label">Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="5"></textarea>
                        </div>
                    </div>
                </div>
                <div className="upload__image__btn">
                    <button>
                        Upload Images
                    </button>
                </div>
                <div className="catalog__check__points">
                    <div className="check__item">
                        <div className="form-check">
                            <input type="checkbox" id="check1" className="form-check-input" />
                            <label htmlFor="check1" className='form-check-label'>
                                Shippable item
                            </label>
                        </div>
                    </div>
                    <div className="check__item">
                        <div className="form-check">
                            <input type="checkbox" id="check1" className="form-check-input" />
                            <label htmlFor="check1" className='form-check-label'>
                                 door-to-door shipping
                            </label>
                        </div>
                    </div>
                    <div className="check__item">
                        <div className="form-check">
                            <input type="checkbox" id="check1" className="form-check-input" />
                            <label htmlFor="check1" className='form-check-label'>
                                Raw material
                            </label>
                        </div>
                    </div>
                    <div className="check__item">
                        <div className="form-check">
                            <input type="checkbox" id="check1" className="form-check-input" />
                            <label htmlFor="check1" className='form-check-label'>
                                Ready to be used
                            </label>
                        </div>
                    </div>
                    <div className="check__item">
                        <div className="form-check">
                            <input type="checkbox" id="check1" className="form-check-input" />
                            <label htmlFor="check1" className='form-check-label'>
                                Customization available
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
