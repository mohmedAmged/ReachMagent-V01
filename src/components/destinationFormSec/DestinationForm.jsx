import React from 'react'

export default function DestinationForm() {
    return (
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
                        <textarea className="form-control" id="" rows="3" placeholder='Enter the address'></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
}
