import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';

export default function NewShippingCostForm({token, countries}) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
  

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        country_id: '',
        city_id: '',
        cost: '',
    });
console.log(formData);

const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;
    const selectedCountry = countries.find(country => country.id === parseInt(selectedCountryId));

    setSelectedCountry(selectedCountry.code);
    setFormData({ ...formData, country_id: selectedCountryId, city_id: '' });

    // Fetch cities for the selected country
    axios.get(`${baseURL}/countries/${selectedCountry.code}`)
      .then(response => {
        setCities(response.data.data.cities);
      })
      .catch(error => {
        console.error("Error fetching cities:", error);
        toast.error('Error fetching cities.');
      });
  };

      const handleCityChange = (e) => {
        const cityId = e.target.value;
        setFormData({ ...formData, city_id: cityId });
      };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        ;

        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        try {
            const response = await axios.post(`${baseURL}/${loginType}/shipping-costs`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {

                navigate('/profile/shipping-costs')
                scrollToTop()
                toast.success('Cost added successfully');
            } else {
                toast.error('Failed to add Cost');
            }
        } catch (error) {
            console.log(error?.response);
            
            toast.error('Error adding cost..');
        };
    };
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    
  return (
    <>
    {
        loading ?
            <MyLoader />
            :
            <div className='dashboard__handler d-flex'>
                <MyNewSidebarDash />
                <div className='main__content container'>
                    <MainContentHeader currentUserLogin={currentUserLogin} />
                    <div className='newCatalogItem__form__handler'>
                        <ContentViewHeader title={'Add post to posts'} />
                        <form className="catalog__form__items" 
                        onSubmit={handleFormSubmit}
                        
                        >
                            <div className="row">
                            <div className="col-lg-6">
                                <div className="catalog__new__input">
                                <label htmlFor="country">Country</label>
                                <select
                                    name="country"
                                    className="form-control custom-select"
                                    value={formData.country_id}
                                    onChange={handleCountryChange}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="catalog__new__input">
                                <label htmlFor="city">City</label>
                                <select
                                    name="city"
                                    className="form-control custom-select"
                                    value={formData.city_id}
                                    onChange={handleCityChange}
                                    disabled={!selectedCountry}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                    <option key={city.cityId} value={city.cityId}>
                                        {city.cityName}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                    <label htmlFor="cost">Shipping Cost</label>
                                    <input
                                        type="text"
                                        name="cost"
                                        className="form-control"
                                        placeholder="Enter your text"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className="form__submit__button">
                                <button type="submit" className="btn btn-primary">
                                    Add New Shipping Cost
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    }
</>
  )
}
