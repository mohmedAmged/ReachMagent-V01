import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';

export default function DestinationForm({distinationData,setDistinationData,countries}) {
    const [currentCities,setCurrentCities] = useState([]);
    const [defaultCityValue,setdefaultCityValue] = useState('');
    const [currentAreas,setCurrentAreas] = useState([]);
    const [defaultAreaValue,setdefaultAreaValue] = useState('');

    const handleChangeInput = (e)=>{
        setDistinationData({...distinationData , [e.target.name]: e.target.value})
        if(e.target.name === 'country_id'){
            setCurrentCities([]);
            const chosenCountry = countries?.find(el => +el?.id === +e.target?.value);
            if(chosenCountry){
                setdefaultCityValue('');
                setdefaultAreaValue('');
                setDistinationData({...distinationData, 'country_id': e.target.value , 'city_id': '','area_id': ''});
                const toastId = toast.loading('Loading Cities , Please Wait !');
                const citiesInsideCurrentCountry = async () => {
                const response = await axios.get(`${baseURL}/countries/${chosenCountry?.code}?t=${new Date().getTime()}`);
                    setCurrentCities(response?.data?.data?.cities);
                };
                citiesInsideCurrentCountry();
                if(currentCities){
                    toast.success('Cities Loaded Successfully.',{
                        id: toastId,
                        duration: 2000
                    });
                }else {
                    toast.error('Somthing Went Wrong Please Choose Your Country Again!',{
                        id: toastId,
                        duration: 2000
                    });
                };
            };
        }if(e.target.name === 'city_id'){
            setdefaultCityValue(e.target.value);
            const currentCity = currentCities?.find(city => +city?.cityId === +e.target.value);
            if(currentCity){
                setCurrentAreas(currentCity?.areas);
                setdefaultAreaValue('');
            };
        }else if(e.target.name === 'area_id'){
            setdefaultAreaValue(e.target.value);
        };
    };

    return (
        <div className="destinationQuote__handler">
            <h3>
                Destination
            </h3>
            <form className="destinationQuote__form row">
                <div className="col-lg-4 col-md-4">
                    <div className="singleQuoteInput">
                        <label htmlFor="distinationCountry">
                            Country
                        </label>
                        <select
                            defaultValue={''}
                            className='form-select' 
                            id="distinationCountry"
                            name='country_id'
                            onChange={handleChangeInput}
                        >
                            <option value='' disabled>Choose your country</option>
                            {
                                countries?.map(country =>(
                                    <option key={country?.id} value={country?.id}>{country?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4">
                    <div className="singleQuoteInput">
                        <label htmlFor="distinationCity">
                            City
                        </label>
                        <select 
                            className='form-select'
                            name="city_id"
                            id="distinationCity"
                            value={defaultCityValue}
                            onChange={handleChangeInput}
                        >
                            <option value={''} disabled>Choose your city</option>
                            {
                                currentCities?.map(city =>(
                                    <option key={city?.cityId} value={city?.cityId}>{city?.cityName}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4">
                    <div className="singleQuoteInput">
                        <label
                            htmlFor='distinationArea'
                        >
                            Area
                        </label>
                        <select
                            className='form-select'
                            name='area_id'
                            id="distinationArea"
                            value={defaultAreaValue}
                            onChange={handleChangeInput}
                        >
                            <option value={''} disabled>Choose your area</option>
                            {
                                currentAreas?.map(area => (
                                    <option value={area?.areaId} key={area?.areaId}>{area?.areaName}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="singleQuoteInput">
                        <label htmlFor="distinationAddress">
                            Address
                        </label>
                        <textarea 
                            className="form-control" 
                            id="distinationAddress" 
                            rows="3" 
                            name={'address'}
                            onChange={handleChangeInput}
                            placeholder='Enter the address'
                        ></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
}
