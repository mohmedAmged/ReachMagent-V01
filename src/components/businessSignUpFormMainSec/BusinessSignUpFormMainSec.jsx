import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessRegisterSchema } from '../../validation/BusinessRegisterSchema';
import BusinessSignUpPackages from '../businessSignUpPackages/BusinessSignUpPackages';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import CustomDropdown from '../customeDropdownSelectSec/CustomeDropdownSelect';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';



const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setLocation, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.setView(initialPosition, 16);
    }
  }, [initialPosition, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
};

export default function BusinessSignUpFormMainSec({ countries, citizenships, industries, mainCategories, mainActivities }) {
    const [activeTooltip, setActiveTooltip] = useState(null);
    const toggleTooltip = (key) => {
    setActiveTooltip(prev => (prev === key ? null : key));
    };
    const { t } = useTranslation();
    let allTypes = [
    {
      id: 1,
      name: 'Selling Physical Products',
      renderNam: `${t('BuisnessSignUpPage.typeSellingPhysical')}`
    },
    {
      id: 2,
      name: 'Manufacturing Products',
      renderNam: `${t('BuisnessSignUpPage.typeManufacturing')}`
    },
    {
      id: 3,
      name: 'Selling Digital Products',
      renderNam: `${t('BuisnessSignUpPage.typeSellingDigital')}`

    },
    {
      id: 4,
      name: 'Service Provider',
      renderNam: `${t('BuisnessSignUpPage.typeServiceProvider')}`

    },
    {
      id: 5,
      name: 'Raw Material Supplier',
      renderNam: `${t('BuisnessSignUpPage.typeRowMaterial')}`

    },
    {
      id: 6,
      name: 'Company Offers Customizations',
      renderNam: `${t('BuisnessSignUpPage.typeCustomizations')}`

    },
    ];
  const loginType = localStorage.getItem('loginType')
  const [initialPosition, setInitialPosition] = useState([0, 0]);
  const [location, setLocation] = useState({ lat: initialPosition[0], lng: initialPosition[1] });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(Cookies.get('currentStep') ? Cookies.get('currentStep') : 'One');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      company_name: '',
      company_name_ar:'',
      company_email: '',
      phone_one: '',
      phone_one_code: '',
      phone_two: '',
      phone_two_code: '',
      referral_code: '',
      company_main_type: '',
      registeration_number: '',
      category_id: '',
      sub_category_id: '',
      activity_id: [],
      sub_activity_id: [],
      industry_id: '',
      website_link: '',
      documents: '',
      logo: '',

      company_country_id: '',
      company_city_id: '',
      company_area_id: '',
      company_full_address: '',
      longitude: '',
      latitude: '',

      employee_name: '',
      employee_email: '',
      employee_phone: '',
      employee_phone_code: '',
      employee_title: '',
      employee_country_id: '',
      employee_city_id: '',
      employee_full_address: '',
      employee_citizenship_id: '',
      official_id_or_passport: '',
      employee_password: '',
      employee_password_confirmation: '',
      comfirm_policies: false,
      is_benifical_owner: false,

      prefered_package_id: ''
    },
    resolver: zodResolver(BusinessRegisterSchema),
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialPosition([latitude, longitude]);
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          toast.error(`${error}`);
        }
      );
    }
  }, []);

  // BusinessTypes Logic
  const [currentBusinessTypes, setCurrentBusinessTypes] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const handleChangeBusinessType = (event) => {
    const toastId = toast.loading('Loading , Please Wait !');
    const chosenType = allTypes.find(el => el.id === +event?.target?.value);
    if (!currentBusinessTypes.find(el => chosenType?.id === +el)) {
      setCurrentBusinessTypes([...currentBusinessTypes, chosenType]);
      allTypes = allTypes.filter(el => el.id !== +chosenType.id);
      setSelectValue('');
      toast.success(`( ${chosenType.name} ) Added Successfully.`, {
        id: toastId,
        duration: 2000
      });
    } else {
      toast.success(`( ${chosenType.name} ) Added Before.`, {
        id: toastId,
        duration: 2000
      });
    }
  };

  const handleDeleteBusinessType = (type) => {
    const toastId = toast.loading('Loading , Please Wait !');
    allTypes.push(type);
    setCurrentBusinessTypes(currentBusinessTypes?.filter(el => +el?.id !== +type?.id));
    toast.success(`( ${type.name} ) Removed Successfully.`, {
      id: toastId,
      duration: 2000
    });
  };

  // getting SubCategory From MainCategory Logic
  const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);
  useEffect(() => {
    setCurrentSubCategoriesInsideMainCategory([]);
    let currentCategoryId = watch('category_id');
    const currentCategory = mainCategories?.find(cat => cat?.mainCategoryId === +currentCategoryId);
    if (currentCategory) {
      setValue('sub_category_id', '');
      const toastId = toast.loading('Loading , Please Wait !');
      const subCatInsideCurrentMainCat = async () => {
        const response = await axios.get(`${baseURL}/main-categories/${currentCategory?.mainCategorySlug}`,  {
                    headers: {
                        "Locale" : Lang
                    }
                });
        if (response?.status === 200) {
          setCurrentSubCategoriesInsideMainCategory(response?.data?.data?.subCategories);
          toast.success(`( ${response?.data?.data?.mainCategoryName} )Activity Added Successfully.`, {
            id: toastId,
            duration: 2000
          });
        } else {
          toast.error(`${response?.data?.error[0]}`, {
            id: toastId,
            duration: 2000
          });
          currentCategoryId = '';
        }
      };
      subCatInsideCurrentMainCat();
    };
  }, [watch('category_id')]);
 



  const [currentSubActivitiesInsideMainActivity, setcurrentSubActivitiesInsideMainActivity] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
const [selectedSubActivities, setSelectedSubActivities] = useState([]);
const [subActivitiesForSelected, setSubActivitiesForSelected] = useState([]);
  useEffect(() => {
    setcurrentSubActivitiesInsideMainActivity([]);
    let currentActivityId = watch('activity_id');
    const currentActivity = mainActivities?.find(Act => Act?.mainActivityId === +currentActivityId);
    if (currentActivity) {
      setValue('sub_activity_id', []);
      const toastId = toast.loading('Loading , Please Wait !');
      const subActInsideCurrentMainAct = async () => {
        const response = await axios.get(`${baseURL}/main-activities/${currentActivity?.mainActivitySlug}`, {
                    headers: {
                        "Locale" : Lang
                    }
                });
        if (response?.status === 200) {
          setcurrentSubActivitiesInsideMainActivity(response?.data?.data?.subActivities);
          toast.success(`( ${response?.data?.data?.mainActivityName} )Activity Added Successfully.`, {
            id: toastId,
            duration: 2000
          });
        } else {
          toast.error(`${response?.data?.error[0]}`, {
            id: toastId,
            duration: 2000
          });
          currentActivityId = '';
        }
      };
      subActInsideCurrentMainAct();
    };
  }, [watch('activity_id')]);

  const handleAddActivity = () => {
    setSelectedActivities((prev) => [...prev, '']);
    setSelectedSubActivities((prev) => [...prev, '']);
    setSubActivitiesForSelected((prev) => [...prev, []]);
  };
  // const handleAddActivity = () => {
  //   setSelectedActivities((prev) => [...prev, '']);
  //   setSelectedSubActivities((prev) => [...prev, '']);
  // };
  const handleRemoveActivity = (index) => {
    if (selectedActivities.length > 0) { // Ensure at least one row is left
      const updatedActivities = selectedActivities.filter((_, i) => i !== index);
      const updatedSubActivities = selectedSubActivities.filter((_, i) => i !== index);
      const updatedSubActivitiesList = subActivitiesForSelected.filter((_, i) => i !== index);
  
      setSelectedActivities(updatedActivities);
      setSelectedSubActivities(updatedSubActivities);
      setSubActivitiesForSelected(updatedSubActivitiesList);
    }
  };
  // const handleRemoveActivity = (index) => {
  //   const updatedActivities = selectedActivities.filter((_, i) => i !== index);
  //   const updatedSubActivities = selectedSubActivities.filter((_, i) => i !== index);
    
  //   setSelectedActivities(updatedActivities);
  //   setSelectedSubActivities(updatedSubActivities);
  // };

  // const handleActivityChange = (e, index) => {
  //   const activityId = e.target.value;
  //   const activitySlug = mainActivities.find(act => act.mainActivityId === parseInt(activityId))?.mainActivitySlug;
  
  //   // Update selected activity (store activity_id)
  //   const updatedActivities = [...selectedActivities];
  //   updatedActivities[index] = activityId;
  //   setSelectedActivities(updatedActivities);
  
  //   // Fetch sub-activities for the selected activity slug
  //   const fetchSubActivities = async () => {
  //     try {
  //       const response = await axios.get(`${baseURL}/main-activities/${activitySlug}`);
  //       if (response?.status === 200) {
  //         const newSubActivities = response?.data?.data?.subActivities;
  //         // Update sub-activities for the selected activity
  //         const updatedSubActivities = [...subActivitiesForSelected];
  //         updatedSubActivities[index] = newSubActivities;
  //         setSubActivitiesForSelected(updatedSubActivities);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching sub-activities:', error);
  //     }
  //   };
  
  //   if (activitySlug) {
  //     fetchSubActivities();
  //   }
  // };
  
  const handleActivityChange = (e, index) => {
    const activityId = e.target.value;
    const activitySlug = mainActivities.find(act => act.mainActivityId === parseInt(activityId))?.mainActivitySlug;
  
    // Update selected activity (store activity_id)
    const updatedActivities = [...selectedActivities];
    updatedActivities[index] = activityId;
    setSelectedActivities(updatedActivities);
  
    // Fetch sub-activities for the selected activity slug
    const fetchSubActivities = async () => {
      try {
        const response = await axios.get(`${baseURL}/main-activities/${activitySlug}`, {
                    headers: {
                        "Locale" : Lang
                    }
                });
        if (response?.status === 200) {
          const newSubActivities = response?.data?.data?.subActivities;
          // Update sub-activities for the selected activity
          const updatedSubActivities = [...subActivitiesForSelected];
          updatedSubActivities[index] = newSubActivities;
          setSubActivitiesForSelected(updatedSubActivities);
        }
      } catch (error) {
        console.error('Error fetching sub-activities:', error);
      }
    };
  
    if (activitySlug) {
      fetchSubActivities();
    }
  };
  // const handleSubActivityChange = (e, index) => {
  //   const subActivityId = e.target.value;
  
  //   // Update selected sub-activity
  //   const updatedSubActivities = [...selectedSubActivities];
  //   updatedSubActivities[index] = subActivityId;
  //   setSelectedSubActivities(updatedSubActivities);
  // };
  
  const handleSubActivityChange = (e, index) => {
    const subActivityId = e.target.value;
    // Update selected sub-activity
    const updatedSubActivities = [...selectedSubActivities];
    updatedSubActivities[index] = subActivityId;
    setSelectedSubActivities(updatedSubActivities);
  };
  
//try-end

  // Getting DocumentsArray
  const [documents, setDocuments] = useState([]);
  const handleGettingFile = (event) => {
    setDocuments([...documents, ...event?.target?.files]);
    setValue('documents', ...documents);
  };
  const handleDeleteFile = (doc) => {
    setDocuments(documents.filter(document => document.name !== doc.name));
    setValue('documents', ...documents);
  };

  // getting Cities InsideCurrentChosenCountry
  const [currentCitiesInsideCountry, setCurrentCitiesInsideCountry] = useState([]);
  useEffect(() => {
    setCurrentCitiesInsideCountry([]);
    let currentCountryId = watch('company_country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if (currentCountry) {
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}`, {
                    headers: {
                        "Locale" : Lang
                    }
                });
        setCurrentCitiesInsideCountry(response?.data?.data?.cities);
      };
      citiesInsideCurrentCountry();
      if (currentCitiesInsideCountry) {
        toast.success('Cities Loaded Successfully.', {
          id: toastId,
          duration: 2000
        });
      } else {
        toast.error('Somthing Went Wrong Please Choose Your Country Again!', {
          id: toastId,
          duration: 2000
        });
        currentCountryId = '';
      }
    };
    setValue('company_city_id', '');
  }, [watch('company_country_id')]);

  // getting Areas InsideCurrentChosenCity
  const [currentAreasInsideCities, setCurrentAreasInsideCities] = useState([]);
  useEffect(() => {
    setCurrentAreasInsideCities([]);
    let currentCityId = +watch('company_city_id');
    if (currentCityId) {
      const toastId = toast.loading('Loading Areas , Please Wait !');
      const AreasInsideCurrentCities = async () => {
        const response = await axios.get(`${baseURL}/cities/${currentCityId}`, {
                    headers: {
                        "Locale" : Lang
                    }
                });
        setCurrentAreasInsideCities(response?.data?.data?.areas);
      };
      AreasInsideCurrentCities();
      if (currentAreasInsideCities) {
        toast.success('Areas Loaded Successfully.', {
          id: toastId,
          duration: 2000
        });
      } else {
        toast.error('Somthing Went Wrong Please Choose Your City Again!', {
          id: toastId,
          duration: 2000
        });
        currentCityId = '';
      }
    };
    setValue('company_area_id', '');
  }, [watch('company_city_id')]);

  // getting Cities InsideCurrentChosenCountry For Employee
  const [currentEmployeeCitiesInsideCountry, setCurrentEmployeeCitiesInsideCountry] = useState([]);
  useEffect(() => {
    setCurrentEmployeeCitiesInsideCountry([]);
    let currentCountryId = watch('employee_country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if (currentCountry) {
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}`, {
                    headers: {
                        "Locale" : Lang
                    }
                });
        if (response?.status === 200) {
          setCurrentEmployeeCitiesInsideCountry(response?.data?.data?.cities);
          toast.success('Cities Loaded Successfully.', {
            id: toastId,
            duration: 2000
          });
        } else {
          toast.error('Somthing Went Wrong Please Choose Your Country Again!', {
            id: toastId,
            duration: 2000
          });
          currentCountryId = ''
        };
      };
      citiesInsideCurrentCountry();
    };
  }, [watch('employee_country_id')]);

  useEffect(() => {
    setValue('longitude', location.lng);
    setValue('latitude', location.lat);
    setValue('documents', documents);
    setValue('company_main_type', currentBusinessTypes?.map(el => el?.name));
    if (watch('comfirm_policies') === true) {
      setValue('comfirm_policies', 1);
    } else if (watch('comfirm_policies') === false) {
      setValue('comfirm_policies', 0);
    };
    if (watch('is_benifical_owner') === true) {
      setValue('is_benifical_owner', 1);
    } else if (watch('is_benifical_owner') === false) {
      setValue('is_benifical_owner', 0);
    };
  }, [documents,
    currentBusinessTypes,
    watch('comfirm_policies'),
    watch('is_benifical_owner')
  ]);

  const onSubmit = async (data) => {
    // setLoading(true);
    // const toastId = toast.loading('Please Wait...');
    // const formData = new FormData();
    // Object.keys(data).forEach((key) => {
    //   if (key !== 'logo' && key !== 'official_id_or_passport' && key !== 'documents' && !Array.isArray(data[key])) {
    //     formData.append(key, data[key]);
    //   } else if (Array.isArray(data[key]) && key !== 'documents') {
    //     data[key].forEach((item, index) => {
    //       formData.append(`${key}[${index}]`, item);
    //     });
    //   } else if (key === 'documents') {
    //     data[key].forEach((file, index) => {
    //       formData.append(`documents[${index}]`, file[0]);
    //     });
    //   }
    // });
    // if (data.logo) {
    //   formData.append('logo', data.logo[0]);
    // }
    // if (data.official_id_or_passport) {
    //   formData.append('official_id_or_passport', data.official_id_or_passport[0]);
    // }
    // await axios.post(`${baseURL}/company-registeration`, formData, {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //   },
    // }).then(response => {
    //   toast.success(`${response?.data?.message}`, {
    //     id: toastId,
    //     duration: 2000
    //   });
    //   companyId = response?.data?.data?.companyId;
    //   scrollToTop();
    // }).catch(error => {
    //     setCurrentStep('One');
    //     Object.keys(error?.response?.data?.errors).forEach((key) => {
    //       setError(key, { message: error?.response?.data?.errors[key][0] });
    //     });
    //     window.scrollTo({ top: 400 });
    //     toast.error(error?.response?.data?.message, {
    //       id: toastId,
    //       duration: 2000
    //     });
    //   });
    // setLoading(false);
  };

  const handleChangeStep = (type) => {
    if (currentStep === 'One') {
      (async () => {
        const toastId = toast.loading('Please Wait...');
        const data = {
          company_name: watch('company_name'),
          company_name_ar: watch('company_name_ar'),
          company_email: watch('company_email'),
          phone_one: watch('phone_one'),
          phone_one_code: watch('phone_one_code'),
          phone_two: watch('phone_two'),
          phone_two_code: watch('phone_two_code'),
          referral_code: watch('referral_code'),
          company_main_type: watch('company_main_type'),
          registeration_number: watch('registeration_number'),
          category_id: watch('category_id'),
          sub_category_id: watch('sub_category_id'),
          activity_id: selectedActivities,
          sub_activity_id: selectedSubActivities,
          industry_id: watch('industry_id'),
          website_link: watch('website_link'),
          documents: watch('documents'),
          logo: watch('logo'),
        };
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key !== 'logo' && key !== 'documents' && !Array.isArray(data[key])) {
            formData.append(key, data[key]);
          } else if (Array.isArray(data[key]) && key !== 'documents') {
            data[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (key === 'documents') {
            data[key].forEach((file, index) => {
              formData.append(`documents[${index}]`, file);
            });
          };
        });
        if (data.logo) {
          formData.append('logo', data.logo);
        }
        await axios.post(`${baseURL}/company-registeration-step-one`, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }).then(response => {
          Cookies.set('companyRegId', response?.data?.data?.companyId);
          toast.success(`${response?.data?.message}`, {
            id: toastId,
            duration: 1000
          });
          scrollToTop();
          setCurrentStep('Two');
        }).catch(error => {
          setCurrentStep('One');
          if (error?.response?.data?.errors) {
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
          }
          window.scrollTo({ top: 400 });
          toast.error(error?.response?.data?.message, {
            id: toastId,
            duration: 1000
          });
        });
      })();
    } else if (currentStep === 'Two') {
      type === 'nextStep' ?
        (async () => {
          const toastId = toast.loading('Please Wait...');
          const data = {
            company_id: Cookies.get('companyRegId'),
            longitude: watch('longitude'),
            latitude: watch('latitude'),
            company_full_address: watch('company_full_address'),
            company_area_id: watch('company_area_id'),
            company_city_id: watch('company_city_id'),
            company_country_id: watch('company_country_id'),
          };
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key !== 'logo' && key !== 'documents' && !Array.isArray(data[key])) {
              formData.append(key, data[key]);
            } else if (Array.isArray(data[key]) && key !== 'documents') {
              data[key].forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            };
          });
          await axios.post(`${baseURL}/company-registeration-step-two`, formData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }).then(response => {
            toast.success(`${response?.data?.message}`, {
              id: toastId,
              duration: 1000
            });
            scrollToTop();
            setCurrentStep('Three');
          }).catch(error => {
            setCurrentStep('Two');
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
            window.scrollTo({ top: 400 });
            toast.error(error?.response?.data?.message, {
              id: toastId,
              duration: 1000
            });
          })
        })()
        :
        setCurrentStep('One');
    } else if (currentStep === 'Three') {
      type === 'nextStep' ?
        (async () => {
          const toastId = toast.loading('Please Wait...');
          const data = {
            company_id: Cookies.get('companyRegId'),
            employee_name: watch('employee_name'),
            employee_email: watch('employee_email'),
            employee_phone: watch('employee_phone'),
            employee_phone_code: watch('employee_phone_code'),
            employee_title: watch('employee_title'),
            employee_country_id: watch('employee_country_id'),
            employee_city_id: watch('employee_city_id'),
            employee_full_address: watch('employee_full_address'),
            employee_citizenship_id: watch('employee_citizenship_id'),
            official_id_or_passport: watch('official_id_or_passport'),
            employee_password: watch('employee_password'),
            employee_password_confirmation: watch('employee_password_confirmation'),
            comfirm_policies: watch('comfirm_policies'),
            is_benifical_owner: watch('is_benifical_owner'),
          };
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key !== 'official_id_or_passport') {
              formData.append(key, data[key]);
            }
          });
          if (data.official_id_or_passport) {
            formData.append('official_id_or_passport', data.official_id_or_passport[0]);
          };
          await axios.post(`${baseURL}/company-registeration-step-three`, formData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }).then(response => {
            toast.success(`${response?.data?.message}`, {
              id: toastId,
              duration: 1000
            });
            // Cookies.remove('currentStep');
            scrollToTop();
            // navigate('/');
            setCurrentStep('Four');

          }).catch(error => {
            setCurrentStep('Three');
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
            window.scrollTo({ top: 400 });
            toast.error(error?.response?.data?.message, {
              id: toastId,
              duration: 1000
            });
          });
        })()
        :
        setCurrentStep('Two');
    } else if (currentStep === 'Four') {
      type === 'nextStep' ?
        (async () => {
          const toastId = toast.loading('Please Wait...');
          const data = {
            company_id: Cookies.get('companyRegId'),
            prefered_package_id: watch('prefered_package_id')?.toString() || '',
          };
          // const formData = new FormData();
          
          await axios.post(`${baseURL}/company-registeration-step-four`, data, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }).then(response => {
            toast.success(`${response?.data?.message}`, {
              id: toastId,
              duration: 1000
            });
            Cookies.remove('currentStep');

            scrollToTop();
            navigate('/');

            // setCurrentStep('Completed');
          }).catch(error => {
            setCurrentStep('Four');
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
            window.scrollTo({ top: 400 });
            toast.error(error?.response?.data?.message, {
              id: toastId,
              duration: 1000
            });
          })
        })()
        :
        setCurrentStep('Three');
    };
  };

  // image preview
  const [imagePreviews, setImagePreviews] = useState({});

  const handleImageChange = (e) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      setValue('logo',files[0]);
      setImagePreviews((prevState) => ({
        ...prevState,
        [id]: URL.createObjectURL(files[0])
      }));
    }
  };

  useEffect(() => {
    if (watch('password') !== watch('password_confirmation')) {
      setError('password_confirmation', { message: 'Passwords do not match' });
    } else if (watch('password_confirmation') === watch('password')) {
      clearErrors("password_confirmation");
    };
  }, [watch('password_confirmation')]);

  useEffect(() => {
    if (watch('employee_password') !== watch('employee_password_confirmation')) {
      setError('employee_password_confirmation', { message: 'Passwords do not match' });
    } else if (watch('employee_password_confirmation') === watch('employee_password')) {
      clearErrors("employee_password_confirmation");
    };
  }, [watch('employee_password_confirmation')]);
console.log(currentSubActivitiesInsideMainActivity);

  return (
    <>
      {
        loading ?
          <MyLoader />
          :
          <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <ul className='row loginToggler'>
                    <li className={`col-md-3 cursorPointer`} onClick={() => navigate('/personalsignUp')}>
                      {t('PersonalSignUpPage.userTitFilterItem')}
                    </li>
                    <li className={`col-md-3 cursorPointer active`} onClick={() => navigate('/business-signUp')}>
                       {t('PersonalSignUpPage.businessTitFilterItem')}
                    </li>
                  </ul>
                  <div className="signUpForm__mainContent">
                    <div className="row">

                      {
                        currentStep === 'One' &&
                        <h3 className="col-12 text-center py-5 signUpForm__head">
                          {t('BuisnessSignUpPage.stepOneTitle')}
                        </h3>
                      }
                      <form onSubmit={handleSubmit(onSubmit)} className='row'>
                        {/* Step One */}
                        {
                          currentStep === 'One' &&
                          <>
                          {/* <div className="col-12 mb-4">
                            <h3 className="text-center">
                              Step 1 of 4
                            </h3>
                          </div> */}
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_name">
                                {t('BuisnessSignUpPage.companyNameFormInput')} <span className="requiredStar">*</span> 
                                <i title={t('BuisnessSignUpPage.companyNameFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_name'
                                placeholder={t('BuisnessSignUpPage.companyNameFormInput')}
                                {...register('company_name')}
                                className={`form-control signUpInput ${errors.company_name ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_name
                                &&
                                (<span className='errorMessage'>{errors.company_name.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_name_ar">
                                {t('BuisnessSignUpPage.companyNameArFormInput')} <span className="requiredStar">*</span> 
                                <i title={t('BuisnessSignUpPage.companyNameArFormInput')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_name_ar'
                                placeholder={t('BuisnessSignUpPage.companyNameArFormInput')}
                                {...register('company_name_ar')}
                                className={`form-control signUpInput ${errors.company_name_ar ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_name_ar
                                &&
                                (<span className='errorMessage'>{errors.company_name_ar.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_email">
                                {t('PersonalSignUpPage.emailAddressFormInput')} <span className="requiredStar">*</span>
                                <i title={t('BuisnessSignUpPage.emailAddressFormInputTitle')} onClick={() => toggleTooltip('emailFirst')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                 {activeTooltip === 'emailFirst' && (
                                        <div className="custom-tooltip position-absolute">
                                        {t('BuisnessSignUpPage.emailAddressFormInputTitle')} 
                                        </div>
                                  )}
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_email'
                                placeholder={t('PersonalSignUpPage.emailAddressFormInputPlaceholder')} 
                                {...register('company_email')}
                                className={`form-control signUpInput ${errors.company_email ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_email
                                &&
                                (<span className='errorMessage'>{errors.company_email.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpPhone_numberOne">
                                {t('BuisnessSignUpPage.firstPhoneNumFormInput')} 
                                <span className="requiredStar"> *</span>
                                
                              </label>
                              <div className="row align-items-center">
                                <div className="col-md-5 col-sm-12">
                                  <CustomDropdown
                                  optionsData={countries}
                                  setValue={setValue}
                                  value={watch("phone_one_code")}
                                  errors={errors}
                                  inputName="phone_one_code"
                                  placeholder={t('PersonalSignUpPage.countryFormInputPlaceholder')}
                                  isFlagDropdown={true}
                                />
                                </div>
                                <div className="col-md-7 col-sm-12">
                                  <input
                                    type='number'
                                    id='signUpPhone_numberOne'
                                    placeholder={t('BuisnessSignUpPage.firstPhoneNumFormInput')}
                                    {...register('phone_one')}
                                    className={`form-control signUpInput ${errors.phone_one ? 'inputError' : ''}`}
                                  />
                                  {
                                    errors.phone_one
                                    &&
                                    (<span className='errorMessage'>{errors.phone_one.message}</span>)
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpPhone_numberTwo">
                                {t('BuisnessSignUpPage.secondPhoneNumFormInput')}
                                <span className="optional">({t('PersonalSignUpPage.optionalText')})</span>
                              </label>
                              <div className="row">
                                <div className="col-md-5 col-sm-12">
                                   <CustomDropdown
                                  optionsData={countries}
                                  setValue={setValue}
                                  value={watch("phone_two_code")}
                                  errors={errors}
                                  inputName="phone_two_code"
                                  placeholder={t('PersonalSignUpPage.countryFormInputPlaceholder')}
                                  isFlagDropdown={true}
                                />
                                </div>
                                <div className="col-md-7 col-sm-12">
                                  <input
                                    type='number'
                                    id='signUpPhone_numberTwo'
                                    placeholder={t('BuisnessSignUpPage.secondPhoneNumFormInput')}
                                    {...register('phone_two')}
                                    className={`form-control signUpInput ${errors.phone_two ? 'inputError' : ''}`}
                                  />
                                  {
                                    errors.phone_two
                                    &&
                                    (<span className='errorMessage'>{errors.phone_two.message}</span>)
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpregisteration_number">
                                {t('BuisnessSignUpPage.registrationNumberFormInput')}
                                <span className="requiredStar"> *</span>
                                <i title={t('BuisnessSignUpPage.registrationNumberFormInputTitle')} onClick={() => toggleTooltip('registerNum')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                {activeTooltip === 'registerNum' && (
                                    <div className="custom-tooltip position-absolute">
                                    {t('BuisnessSignUpPage.registrationNumberFormInputTitle')}
                                    </div>
                                  )}
                              </label>
                              <input
                                type='text'
                                id='signUpregisteration_number'
                                placeholder={t('BuisnessSignUpPage.registrationNumberFormInput')}
                                {...register('registeration_number')}
                                className={`form-control signUpInput ${errors.registeration_number ? 'inputError' : ''}`}
                              />
                              {
                                errors.registeration_number
                                &&
                                (<span className='errorMessage'>{errors.registeration_number.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpreferral_code">
                                {t('BuisnessSignUpPage.referralCodeFormInput')}
                                <span className="optional"> ({t('PersonalSignUpPage.optionalText')})</span>
                                <i title={t('BuisnessSignUpPage.referralCodeFormInputTitle')} onClick={() => toggleTooltip('referralCode')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                {activeTooltip === 'referralCode' && (
                                    <div className="custom-tooltip position-absolute">
                                    {t('BuisnessSignUpPage.referralCodeFormInputTitle')} 
                                    </div>
                                )}
                              </label>
                              <input
                                type='text'
                                id='signUpreferral_code'
                                placeholder={t('BuisnessSignUpPage.referralCodeFormInput')}
                                {...register('referral_code')}
                                className={`form-control signUpInput ${errors.referral_code ? 'inputError' : ''}`}
                              />
                              {
                                errors.referral_code
                                &&
                                (<span className='errorMessage'>{errors.referral_code.message}</span>)
                              }
                            </div>
                            {/* <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpindustry_id">
                                Industry <span className="requiredStar">*</span>
                                <i title="industry" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id="signUpindustry_id"
                                className={`form-select signUpInput ${errors.industry_id ? 'inputError' : ''}`}
                                {...register('industry_id')} >
                                <option value="" disabled>
                                  Select an industry
                                </option>
                                {industries?.map((industry) => (
                                  <option key={industry?.id} value={industry?.id}>
                                    {industry?.name}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.industry_id &&
                                <span className="errorMessage">{errors.industry_id.message}</span>
                              }
                            </div> */}
                            <div className="col-lg-12">
                              <div className="row">
                              <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpCompany_main_types">
                                {t('BuisnessSignUpPage.businessTypesFormInput')}
                                <span className="requiredStar"> * </span>
                                <span className="optional">({t('BuisnessSignUpPage.businessTypesFormInputMulti')})</span>
                                
                              </label>
                              <select
                                onChange={handleChangeBusinessType}
                                id="signUpCompany_main_types"
                                value={selectValue}
                                className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.company_main_type ? 'inputError' : ''}`}
                              >
                                <option value="" disabled>
                                  {t('BuisnessSignUpPage.businessTypesFormInputPlaceholder')}
                                </option>
                                {allTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.renderNam}
                                  </option>
                                ))}
                              </select>
                              <div>
                                {currentBusinessTypes.map((type) => (
                                  <span className='chosen__choice' key={type.id}>
                                    {type.renderNam}
                                    <i
                                      onClick={() => handleDeleteBusinessType(type)}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.company_main_type
                                &&
                                (<span className='errorMessage'>{errors.company_main_type.message}</span>)
                              }
                            </div>
                              </div>
                            </div>
                            
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcategory_id">
                                {t('BuisnessSignUpPage.businessActivityFormInput')}
                                <span className="requiredStar"> *</span>
                                <i title={t('BuisnessSignUpPage.businessActivityFormInputTitle')} onClick={() => toggleTooltip('activity')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                 {activeTooltip === 'activity' && (
                                      <div className="custom-tooltip position-absolute">
                                      {t('BuisnessSignUpPage.businessActivityFormInputTitle')} 
                                      </div>
                                  )}
                              </label>
                              <select
                                id="signUpcategory_id"
                                defaultValue={''}
                                className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.category_id ? 'inputError' : ''}`}
                                {...register('category_id')} >
                                <option value="" disabled>
                                  {t('BuisnessSignUpPage.businessActivityFormInputPlaceholder')}
                                </option>
                                {mainCategories?.map((cat) => (
                                  <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>
                                    {cat?.mainCategoryName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.category_id
                                &&
                                (<span className='errorMessage'>{errors.category_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpsub_category_id">
                                {t('BuisnessSignUpPage.businessSubActivityFormInput')}
                                <span className="requiredStar"> *</span>
                                <i title={t('BuisnessSignUpPage.businessSubActivityFormInputTitle')}  onClick={() => toggleTooltip('subActivity')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                {activeTooltip === 'subActivity' && (
                                    <div className="custom-tooltip position-absolute">
                                    {t('BuisnessSignUpPage.businessSubActivityFormInputTitle')} 
                                    </div>
                                )}
                              </label>
                              <div className="position-relative">
                                <select
                                  id="signUpsub_category_id"
                                  className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.sub_category_id ? 'inputError' : ''}`}
                                  {...register('sub_category_id')} >
                                  <option value="" disabled>
                                    {t('BuisnessSignUpPage.businessSubActivityFormInputPlaceholder')}
                                  </option>
                                  {currentSubCategoriesInsideMainCategory?.map((subCat) => (
                                    <option key={subCat?.subCategoryId} value={subCat?.subCategoryId}>
                                      {subCat?.subCategoryName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {
                                errors.sub_category_id
                                &&
                                (<span className='errorMessage'>{errors.sub_category_id.message}</span>)
                              }
                            </div>                           
                            <div className="col-lg-12">
                              <div className=''>
                                <button style={{background: '#412794'}} type="button" onClick={handleAddActivity} className="btn btn-primary btn__Activity my-3">
                                     {t('BuisnessSignUpPage.addMoreActsAndSubBtn')}
                                  </button>
                              </div>
                              {selectedActivities.map((_, index) => (
                                <div key={index} className="row">
                                  
                                  <div className="col-lg-6 mb-4">
                                    <label htmlFor={`activity_id_${index}`}>
                                      {t('BuisnessSignUpPage.moreActsFormInput')}
                                      <span className="requiredStar"> *</span>
                                    </label>
                                    <select
                                      id={`activity_id_${index}`}
                                      className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''}`}
                                      value={selectedActivities[index]}
                                      onChange={(e) => handleActivityChange(e, index)}
                                    >
                                      <option value="" disabled>{t('BuisnessSignUpPage.businessActivityFormInputPlaceholder')}</option>
                                      {mainActivities?.map((act) => (
                                        <option key={act?.mainActivityId} value={act?.mainActivityId}>
                                          {act?.mainActivityName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="col-lg-6 mb-4">
                                    <label htmlFor={`sub_activity_id_${index}`}>
                                      {t('BuisnessSignUpPage.moreSubActsFormInput')}
                                      <span className="requiredStar"> *</span>
                                    </label>
                                    <select
                                      id={`sub_activity_id_${index}`}
                                      className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''}`}
                                      value={selectedSubActivities[index]}
                                      onChange={(e) => handleSubActivityChange(e, index)}
                                    >
                                      <option value="" disabled>{t('BuisnessSignUpPage.businessSubActivityFormInputPlaceholder')}</option>
                                      {subActivitiesForSelected[index]?.map((subCat) => (
                                        <option key={subCat?.subActivityId} value={subCat?.subActivityId}>
                                          {subCat?.subActivityName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-lg-12 mb-2 d-flex justify-content-center">
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveActivity(index)}
                                  >
                                    {t('BuisnessSignUpPage.DeleteBtn')}
                                  </button>
                                  </div>
                                  
                                </div>
                              ))}
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpwebsite_link">
                               {t('BuisnessSignUpPage.websiteLinkFormInput')}
                                <span className="requiredStar"> *</span>
                        
                              </label>
                              <input
                                type='text'
                                id='signUpwebsite_link'
                                placeholder={t('BuisnessSignUpPage.websiteLinkFormInput')}
                                {...register('website_link')}
                                className={`form-control signUpInput ${errors.website_link ? 'inputError' : ''}`}
                              />
                              {
                                errors.website_link
                                &&
                                (<span className='errorMessage'>{errors.website_link.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpBusinessdocuments">
                                {t('BuisnessSignUpPage.companyDocumentsFormInput')} <span className="requiredStar"> * </span>
                                <span className="optional">({t('BuisnessSignUpPage.businessTypesFormInputMulti')})</span>
                                <i title={t('BuisnessSignUpPage.companyDocumentsFormInputTitle')} onClick={() => toggleTooltip('documents')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                {activeTooltip === 'documents' && (
                                    <div className="custom-tooltip position-absolute">
                                    {t('BuisnessSignUpPage.companyDocumentsFormInputTitle')}
                                    </div>
                                )}
                              </label>
                              <input
                                onChange={handleGettingFile}
                                type='file'
                                multiple
                                id='signUpBusinessdocuments'
                                className={`form-control newUploadBtn ${errors.documents ? 'inputError' : ''}`}
                              />
                              <div>

                                {documents?.map((doc, idx) => (
                                  <span className='chosen__choice' key={doc?.lastModified} title={doc?.name}>
                                    {(doc?.name)?.slice(0, 20)}
                                    <i
                                      onClick={() => {
                                        handleDeleteFile(doc);
                                      }}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.documents
                                &&
                                (<p className='errorMessage'>{errors.documents.message}</p>)
                              }
                            </div>
                            <div className="col-lg-12 mb-4 position-relative">
                              <label htmlFor="compnayLogo" className=''>
                                {t('BuisnessSignUpPage.CompanyLogoFormInput')} <span className="requiredStar"> * </span>
                                
                                <br/>
                                <span style={{color:'gray', fontSize:'14px'}} >
                                  ({t('BuisnessSignUpPage.CompanyLogoFormInputrecomedned')})
                                </span>
                              </label>
                              <input
                                type='file'
                                id='compnayLogo'
                                placeholder=''
                                className={`form-control newUploadBtn ${errors.logo ? 'inputError' : ''}`}
                                onChange={handleImageChange}
                                required
                              />

                              {
                                errors.logo
                                &&
                                (<p className='errorMessage'>{errors.logo.message}</p>)
                              }
                              {imagePreviews['compnayLogo'] && (
                                <div className='image-preview'>
                                  <img src={imagePreviews['compnayLogo']} alt="Selected profile" style={{ maxWidth: '100px', height: '100px', marginTop: '10px', borderRadius: '12px' }} />
                                </div>
                              )}
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='nextStep__btn' onClick={() => handleChangeStep('nextStep')}>
                                {t('BuisnessSignUpPage.nextStepBtn')} <i className={`bi ${Lang ==='ar' ? 'bi-arrow-left-circle' : 'bi-arrow-right-circle'} `}></i>
                              </button>
                            </div>
                          </>
                        }

                        {/* Step Two */}
                        {
                          currentStep === 'Two' &&
                          <>
                           {/* <div className="col-12 mb-4">
                            <h3 className="text-center">
                              step 2 of 4
                            </h3>
                          </div> */}
                            <div className="signUpForm__head col-12 mt-5 mb-3 pt-4">
                              <h4>
                                {t('BuisnessSignUpPage.stepTwoTitle')}
                              </h4>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_country_id">
                                {t('PersonalSignUpPage.countryRegionFormInput')} <span className="requiredStar">*</span>
                               
                              </label>
                              <div className="position-relative">
                                <select
                                  id="signUpcompany_country_id"
                                  className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.company_country_id ? 'inputError' : ''}`}
                                  {...register('company_country_id')} >
                                  <option value="" disabled>
                                    {t('PersonalSignUpPage.countryFormInputPlaceholder')}
                                  </option>
                                  {countries?.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>

                              </div>
                              {
                                errors.company_country_id
                                &&
                                (<span className='errorMessage'>{errors.company_country_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_city_id">
                                {t('PersonalSignUpPage.cityFormInput')} <span className="requiredStar">*</span>
                                
                              </label>
                              <select
                                id="signUpcompany_city_id"
                                className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.company_city_id ? 'inputError' : ''}`}
                                {...register('company_city_id')} >
                                <option value="" disabled>
                                  {t('PersonalSignUpPage.cityFormInputPlaceholder')}
                                </option>
                                {currentCitiesInsideCountry?.map((city) => (
                                  <option key={city.cityId} value={city.cityId}>
                                    {city.cityName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.company_city_id &&
                                <span className="errorMessage">{errors.company_city_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_area_id">
                                {t('BuisnessSignUpPage.areaFormInput')} <span className="requiredStar">*</span>
                                
                              </label>
                              <select
                                id="signUpcompany_area_id"
                                className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.company_area_id ? 'inputError' : ''}`}
                                {...register('company_area_id')} >
                                <option value="" disabled>
                                  {t('BuisnessSignUpPage.areaFormInputPlaceholder')}
                                </option>
                                {currentAreasInsideCities?.map((area) => (
                                  <option key={area.areaId} value={area.areaId}>
                                    {area.areaName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.company_city_id &&
                                <span className="errorMessage">{errors.company_city_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_full_address">
                                {t('BuisnessSignUpPage.companyFullAddressFormInput')}  <span className="requiredStar">*</span>
                                
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_full_address'
                                placeholder={t('BuisnessSignUpPage.companyFullAddressFormInputPlaceholder')}
                                {...register('company_full_address')}
                                className={`form-control signUpInput ${errors.company_full_address ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_full_address
                                &&
                                (<span className='errorMessage'>{errors.company_full_address.message}</span>)
                              }
                            </div>
                            <div className="col-lg-12 mb-4">
                              <ul className='d-flex align-items-center gap-3 flex-wrap'>
                                <li className='d-flex gap-2 flex-wrap'>
                                  <label className='mapLabel'>{t('BuisnessSignUpPage.latitudeFormInput')}:</label>
                                  <input
                                    type="text"
                                    value={location.lat || ''}
                                    readOnly={true}
                                    className='signUpInput input-readOnly'
                                  />
                                  {
                                    errors.latitude
                                    &&
                                    (<span className='errorMessage'>{errors.latitude.message}</span>)
                                  }
                                </li>
                                <li className='d-flex gap-2 flex-wrap'>
                                  <label className='mapLabel'>{t('BuisnessSignUpPage.longitudeFormInput')}:</label>
                                  <input
                                    type="text"
                                    value={location.lng || ''}
                                    readOnly={true}
                                    className='signUpInput input-readOnly'
                                  />
                                  {
                                    errors.longitude
                                    &&
                                    (<span className='errorMessage'>{errors.longitude.message}</span>)
                                  }
                                </li>
                              </ul>
                              <MapContainer center={initialPosition} zoom={0} style={{ height: '400px', width: '100%', zIndex: '1' }}>
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker setLocation={setLocation} initialPosition={initialPosition} />
                              </MapContainer>
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className={`bi ${Lang ==='ar' ? 'bi-arrow-right-circle' : 'bi-arrow-left-circle'} `}></i> {t('BuisnessSignUpPage.prevStepBtn')}
                              </button>
                              <button type="button" className='nextStep__btn' onClick={() => handleChangeStep('nextStep')}>
                                {t('BuisnessSignUpPage.nextStepBtn')} <i className={`bi ${Lang ==='ar' ? 'bi-arrow-left-circle' : 'bi-arrow-right-circle'} `}></i>
                              </button>
                            </div>
                          </>
                        }

                        {/* Step Three */}
                        {
                          currentStep === 'Three' &&
                          <>
                            <div className="col-lg-12 my-5">
                              <h3 className='signUpForm__head mt-5 text-center'>
                                {t('BuisnessSignUpPage.stepThreeTitle')}
                              </h3>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_name">
                                {t('BuisnessSignUpPage.ownerNameFormInput')} <span className="requiredStar">*</span>
                                
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_name'
                                placeholder={t('BuisnessSignUpPage.ownerNameFormInputPlacholder')}
                                {...register('employee_name')}
                                className={`form-control signUpInput ${errors.employee_name ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_name
                                &&
                                (<span className='errorMessage'>{errors.employee_name.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_email">
                               {t('PersonalSignUpPage.emailAddressFormInput')} <span className="requiredStar">*</span>
                                
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_email'
                                placeholder={t('PersonalSignUpPage.emailAddressFormInputPlaceholder')}
                                {...register('employee_email')}
                                className={`form-control signUpInput ${errors.employee_email ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_email
                                &&
                                (<span className='errorMessage'>{errors.employee_email.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_phone">
                                {t('PersonalSignUpPage.mobileNumberFormInput')} <span className="requiredStar"> * </span>
                               
                              </label>
                              <div className="row">
                                <div className="col-md-5 col-sm-12">
                              <CustomDropdown
                                  optionsData={countries}
                                  setValue={setValue}
                                  value={watch("employee_phone_code")}
                                  errors={errors}
                                  inputName="employee_phone_code"
                                  placeholder={t('PersonalSignUpPage.countryFormInputPlaceholder')}
                                  isFlagDropdown={true}
                                />
                                </div>
                                <div className="col-md-7 col-sm-12">
                                  <input
                                    type='number'
                                    id='signUpemployee_phone'
                                    placeholder={t('BuisnessSignUpPage.mobileFormInputPlaceholder')}
                                    {...register('employee_phone')}
                                    className={`form-control signUpInput ${errors.employee_phone ? 'inputError' : ''}`}
                                  />
                                  {
                                    errors.employee_phone
                                    &&
                                    (<span className='errorMessage'>{errors.employee_phone.message}</span>)
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_title">
                                {t('BuisnessSignUpPage.titleFormInput')} <span className="requiredStar"> *</span>
                                <i title={t('BuisnessSignUpPage.titleFormInputTitle')} onClick={() => toggleTooltip('title')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                 {activeTooltip === 'title' && (
                                                                                                                  <div className="custom-tooltip position-absolute">
                                                                                                                  {t('BuisnessSignUpPage.titleFormInputTitle')} 
                                                                                                                  </div>
                                                                                                              )}
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_title'
                                placeholder={t('BuisnessSignUpPage.titleFormInputPlaceholder')}
                                {...register('employee_title')}
                                className={`form-control signUpInput ${errors.employee_title ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_title
                                &&
                                (<span className='errorMessage'>{errors.employee_title.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_country_id">
                                <span className='fs-6'>({t('PersonalSignUpPage.countryRegionFormInput')})</span> <span className="requiredStar">*</span>
                                <i title={t('BuisnessSignUpPage.countryRegionFormInputTit')} onClick={() => toggleTooltip('country')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                {activeTooltip === 'country' && (
                                                    <div className="custom-tooltip position-absolute">
                                                    {t('BuisnessSignUpPage.countryRegionFormInputTit')} 
                                                    </div>
                                                )}
                              </label>
                              <div className="position-relative">
                                <select
                                  id="signUpemployee_country_id"
                                  className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.employee_country_id ? 'inputError' : ''}`}
                                  {...register('employee_country_id')} >
                                  <option value="" disabled>
                                    {t('PersonalSignUpPage.countryFormInputPlaceholder')}
                                  </option>
                                  {countries?.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {
                                errors.employee_country_id
                                &&
                                (<span className='errorMessage'>{errors.employee_country_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_city_id">
                                {t('PersonalSignUpPage.cityFormInput')} <span className="requiredStar">*</span>
                                <i title={t('BuisnessSignUpPage.cityFormInputTitle')} onClick={() => toggleTooltip('city')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                                {activeTooltip === 'city' && (
                                                                                    <div className="custom-tooltip position-absolute">
                                                                                    {t('BuisnessSignUpPage.cityFormInputTitle')} 
                                                                                    </div>
                                                                                )}
                              </label>
                              <select
                                id="signUpemployee_city_id"
                                className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.employee_city_id ? 'inputError' : ''}`}
                                {...register('employee_city_id')} >
                                <option value="" disabled>
                                  {t('PersonalSignUpPage.cityFormInputPlaceholder')}
                                </option>
                                {currentEmployeeCitiesInsideCountry?.map((city) => (
                                  <option key={city.cityId} value={city.cityId}>
                                    {city.cityName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.employee_city_id &&
                                <span className="errorMessage">{errors.employee_city_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_full_address">
                                {t('PersonalSignUpPage.fullAddressFormInput')}  <span className="requiredStar">*</span>
                                <i title={t('BuisnessSignUpPage.fullAddressFormInputDes')} className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_full_address'
                                placeholder={t('PersonalSignUpPage.addressLine1FormInputPlaceholder')}
                                {...register('employee_full_address')}
                                className={`form-control signUpInput ${errors.employee_full_address ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_full_address
                                &&
                                (<span className='errorMessage'>{errors.employee_full_address.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_citizenship_id">
                                {t('PersonalSignUpPage.citizenshipFormInput')} <span className="requiredStar"> *</span>
                                
                              </label>
                              <select
                                id='signUpemployee_citizenship_id'
                                defaultValue={''}
                                {...register('employee_citizenship_id')}
                                className={`form-select signUpInput ${Lang === 'ar' ? 'formSelect_RTL' :''} ${errors.employee_citizenship_id ? 'inputError' : ''}`}
                              >
                                <option value='' disabled>{t('PersonalSignUpPage.citizenshipFormInputPlaceholder')}</option>
                                {
                                  citizenships?.map(el => (
                                    <option key={el?.id} value={el?.id}>
                                      {el?.name}
                                    </option>
                                  ))
                                }
                              </select>
                              {
                                errors.employee_citizenship_id
                                &&
                                (<span className='errorMessage'>{errors.employee_citizenship_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_password">
                                {t('PersonalSignUpPage.passwordFormInput')} <span className="requiredStar"> *</span>
                                
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`${showPassword ? 'text' : 'password'}`}
                                  id='signUpemployee_password'
                                  placeholder={t('PersonalSignUpPage.passwordFormInputPlaceholder')}
                                  {...register('employee_password')}
                                  className={`form-control signUpInput ${errors.employee_password ? 'inputError' : ''}`}
                                />
                                <div className={`${Lang === 'ar' ? 'leftShowPasssord_RTL' : 'leftShowPasssord'}`}  onClick={() => setShowPassword(!showPassword)}>
                                  {
                                    showPassword ?
                                      <i className="bi bi-eye-slash"></i>
                                      :
                                      <i className="bi bi-eye-fill"></i>
                                  }
                                </div>
                              </div>
                              {
                                errors.employee_password
                                &&
                                (<span className='errorMessage'>{errors.employee_password.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_password_confirmation">
                                {t('PersonalSignUpPage.ConfirmPasswordFormInput')} <span className="requiredStar"> *</span>
                                
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`${showConfirmPassword ? 'text' : 'password'}`}
                                  id='signUpemployee_password_confirmation'
                                  placeholder={t('PersonalSignUpPage.ConfirmPasswordFormInput')}
                                  {...register('employee_password_confirmation')}
                                  className={`form-control signUpInput ${errors.employee_password_confirmation ? 'inputError' : ''}`}
                                />
                                <div className={`${Lang === 'ar' ? 'leftShowPasssord_RTL' : 'leftShowPasssord'}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                  {
                                    showConfirmPassword ?
                                      <i className="bi bi-eye-slash"></i>
                                      :
                                      <i className="bi bi-eye-fill"></i>
                                  }
                                </div>
                              </div>
                              {
                                errors.employee_password_confirmation
                                &&
                                (<span className='errorMessage'>{errors.employee_password_confirmation.message}</span>)
                              }
                            </div>
                            <div className='col-lg-6'>
                              <label htmlFor="signUpofficial_id_or_passport">
                                {t('BuisnessSignUpPage.ownerIdFormInput')}<span className="optional">({t('BuisnessSignUpPage.ownerIdFormInputDes')})</span><span className="requiredStar"> *</span>
                                
                              </label>
                              <input
                                type='file'
                                id='signUpofficial_id_or_passport'
                                {...register('official_id_or_passport')}
                                className={`form-control newUploadBtn ${errors.official_id_or_passport ? 'inputError' : ''}`}
                              />
                              {
                                errors.official_id_or_passport
                                &&
                                (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                              }

                            </div>
                            <div className="col-lg-8 my-4">
                              <label
                                htmlFor="singUpcomfirm_policies"
                                className='row justify-content-start align-items-start'>
                                <p className="signUpCostom-checkBox col-md-1 col-sm-2 mt-1">
                                  <input
                                    type="checkbox"
                                    id="singUpcomfirm_policies"
                                    {...register('comfirm_policies')}
                                    className='signUpCheckBox'
                                  />
                                  <span className="checkmark"></span>
                                </p>
                                <p className="col-md-11 p-0 col-sm-10 checkBox-text">
                                 {t('BuisnessSignUpPage.checkConfirmFormInput')}
                                </p>
                              </label>
                              {errors.comfirm_policies && <p className='errorMessage'>{errors.comfirm_policies.message}</p>}
                            </div>
                            <div className="col-lg-8 mb-4">
                              <label
                                htmlFor="singUpis_benifical_owner"
                                className='row justify-content-start align-items-start'>
                                <p className="signUpCostom-checkBox col-md-1 col-sm-2 mt-1">
                                  <input
                                    type="checkbox"
                                    id="singUpis_benifical_owner"
                                    {...register('is_benifical_owner')}
                                    className='signUpCheckBox'
                                  />
                                  <span className="checkmark mt-1"></span>
                                </p>
                                <p className="col-md-11 p-0 pt-2 col-sm-10 is_benifical_owner checkBox-text">
                                  {t('BuisnessSignUpPage.checkOwner')}
                                </p>
                              </label>
                              {errors.is_benifical_owner && <p className='errorMessage'>{errors.is_benifical_owner.message}</p>}
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className={`bi ${Lang ==='ar' ? 'bi-arrow-right-circle' : 'bi-arrow-left-circle'} `}></i> {t('BuisnessSignUpPage.prevStepBtn')}
                              </button>
                              <button type="button" className='nextStep__btn' onClick={() => handleChangeStep('nextStep')}>
                                {t('BuisnessSignUpPage.nextStepBtn')} <i className={`bi ${Lang ==='ar' ? 'bi-arrow-left-circle' : 'bi-arrow-right-circle'} `}></i>
                              </button>
                            </div>
                            {/* <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className="bi bi-arrow-left-circle"></i> Prev Step
                              </button>
                            </div> */}
                          </>
                        }

                        {/* Step Four */}
                        {
                          currentStep === 'Four' &&
                          <div className="col-lg-12">
                            <BusinessSignUpPackages setValue={setValue} watch={watch}/>
                          </div>
                        }

                        {
                          currentStep === 'Four' &&
                          <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                            <input disabled={isSubmitting} type="button" value={t('BuisnessSignUpPage.submitForReviewBtn')} onClick={() => handleChangeStep('nextStep')} />
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className={`bi ${Lang ==='ar' ? 'bi-arrow-right-circle' : 'bi-arrow-left-circle'} `}></i> {t('BuisnessSignUpPage.prevStepBtn')}
                              </button>
                            </div>
                          </div>
                        }
                      </form>
                      <div className="col-lg-12 signUpOtherWays text-center pe-4">
                        <div className="serviceTerms">
                          <p className='businessPrivacy'>
                            {t('BuisnessSignUpPage.submitText')}
                          </p>
                          <p>
                            {t('BuisnessSignUpPage.subSubmitText')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
};