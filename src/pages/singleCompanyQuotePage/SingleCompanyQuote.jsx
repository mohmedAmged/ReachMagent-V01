import React from 'react'
import './singleCompanyQuote.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import { useParams } from 'react-router-dom';
import product1 from '../../assets/productImages/Rectangle 4705 (1).png'
import product2 from '../../assets/productImages/Rectangle 4705 (2).png'
import product3 from '../../assets/productImages/Rectangle 4705 (3).png'
import LastMinuteCard from '../../components/lastMinuteCardSec/LastMinuteCard';
export default function SingleCompanyQuote({ token }) {
    const { companyName } = useParams();

    const productItems = [
        {
            img: product1,
            title: 'Table Lamp',
            dealQuantity: 'Customizable'
        },
        {
            img: product2,
            title: 'Ceiling Lamp ',
            dealQuantity: 'Customizable'
        },
        {
            img: product3,
            title: 'Blue Wood Chair',
            dealQuantity: 'Customizable'
        },
    ]
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
                            <form action="" className='row'>
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
                                    <div className="singleQuote__slideProducts row">
                                        {
                                            productItems?.map((el, index) => (
                                                <div key={index} className="col-lg-4 d-flex justify-content-center mb-4">
                                                    <LastMinuteCard
                                                        productImage={el.img}
                                                        productName={el.title}
                                                        dealQuantity={el.dealQuantity}
                                                        showCustomContent={true}
                                                        buttonLabel="Add"
                                                        onAddClick={() => alert('Add button clicked')}
                                                    />
                                                </div>
                                            ))
                                        }

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
