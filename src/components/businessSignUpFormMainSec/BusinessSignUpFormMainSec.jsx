import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessRegisterSchema } from '../../validation/BusinessRegisterSchema';
import BusinessSignUpPackages from '../businessSignUpPackages/BusinessSignUpPackages';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

let allTypes = [
  {
    id: 1,
    name: 'Selling Physical Products',
  },
  {
    id: 2,
    name: 'Manufacturing Products',
  },
  {
    id: 3,
    name: 'Selling Digital Products',
  },
  {
    id: 4,
    name: 'Service Provider',
  },
  {
    id: 5,
    name: 'Raw Material Supplier',
  },
];

export default function BusinessSignUpFormMainSec({countries,industries,mainCategories,mainActivities}) {
  const [showPassword,setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState:{errors , isSubmitting}
  } = useForm({
    defaultValues:{
      company_name: '',
      company_email: '',
      company_main_type: '',
      registeration_number: '',
      category_id: '',
      sub_category_id: '',
      activity_id: '',
      sub_activity_id: '',
      industry_id: '',
      documents: '',
      logo: '',

      company_country_id: '',
      company_city_id: '',
      company_full_address: '',

      employee_name: '',
      employee_email: '',
      employee_phone: '',
      employee_title: '',
      employee_country_id: '',
      employee_city_id: '',
      employee_full_address: '',
      employee_citizenship: '',
      official_id_or_passport: '',
      employee_password: '',
      comfirm_policies: false,
      is_benifical_owner: false,
    },
    resolver: zodResolver(BusinessRegisterSchema),
  });

  // BusinessTypes Logic
  const [currentBusinessTypes , setCurrentBusinessTypes] = useState([]);
  const [selectValue,setSelectValue] = useState('');
  const handleChangeBusinessType = (event) => {
    const toastId = toast.loading('Loading , Please Wait !');
    const chosenType = allTypes.find(el => el.id === +event?.target?.value);
    if(!currentBusinessTypes.find(el=> chosenType?.id === +el)){
      setCurrentBusinessTypes([...currentBusinessTypes,chosenType]);
      allTypes = allTypes.filter(el=>el.id !== +chosenType.id);
      setSelectValue('');
      toast.success(`( ${ chosenType.name } ) Added Successfully.`,{
        id: toastId,
        duration: 2000
      });
    }else {
      toast.success(`( ${ chosenType.name } ) Added Before.`,{
        id: toastId,
        duration: 2000
      });
    }
  };
  const handleDeleteBusinessType = (type) => {
    const toastId = toast.loading('Loading , Please Wait !');
    allTypes.push(type);
    setCurrentBusinessTypes(currentBusinessTypes?.filter(el=> +el?.id !== +type?.id ));
    toast.success(`( ${ type.name } ) Removed Successfully.`,{
      id: toastId,
      duration: 2000
    });
  };

  // getting SubCategory From MainCategory Logic
  const [currentSubCategoriesInsideMainCategory,setCurrentSubCategoriesInsideMainCategory] = useState([]);
  useEffect(()=>{
    setCurrentSubCategoriesInsideMainCategory([]);
    let currentCategoryId = watch('category_id');
    const currentCategory = mainCategories?.find(cat => cat?.mainCategoryId === +currentCategoryId);
    if(currentCategory){
      const toastId = toast.loading('Loading , Please Wait !');
      const subCatInsideCurrentMainCat = async () => {
        const response = await axios.get(`${baseURL}/main-categories/${currentCategory?.mainCategorySlug}`);
        if(response?.status === 200) {
          setCurrentSubCategoriesInsideMainCategory(response?.data?.data?.subCategories);
          toast.success(`( ${ response?.data?.data?.mainCategoryName } )Category Added Successfully.`,{
            id: toastId,
            duration: 2000
          });
        }else {
          toast.error(`${response?.data?.error[0]}`,{
            id: toastId,
            duration: 2000
          });
          currentCategoryId = '';
        }
      };
      subCatInsideCurrentMainCat();
      setValue('sub_category_id','');
    };
  },[watch('category_id')]);

  // getting SubActivities From MainActivities Logic
  const [allMainActivitiesChosen,setAllMainActivitiesChosen] = useState([]);
  const [allSubActsInsideMainActsChosen,setAllSubActsInsideMainActsChosen] = useState([]);
  const [chosenSubActivities,setChosenSubActivities] = useState([]);
  const handleChangeMainActivities = (event) => {
    const toastId = toast.loading('Loading Sub Categories , Please Wait !');
    const chosenActivity = mainActivities?.find(el => el?.mainActivityId === +event?.target?.value);
    if(!allMainActivitiesChosen?.find(el => chosenActivity?.mainActivityId === el.mainActivityId)){
      setAllMainActivitiesChosen([...allMainActivitiesChosen,chosenActivity]);
      const subActsInsideCurrentMainActs = async () => {
        const response = await axios.get(`${baseURL}/main-activities/${chosenActivity?.mainActivitySlug}`);
        if(response?.status === 200) { 
          setAllSubActsInsideMainActsChosen([...allSubActsInsideMainActsChosen ,response?.data?.data]);
          toast.success(`( ${chosenActivity?.mainActivityName} ) Sub Activities Loaded Successfully.`,{
            id: toastId,
            duration: 2000
          })
        }else{
          toast.error(`( ${chosenActivity?.mainActivityName} ) has already been selected`,{
            id: toastId,
            duration: 2000
          });
        };
      };
      subActsInsideCurrentMainActs();
      setSelectValue('');
    }else {
      toast.error(`( ${chosenActivity?.mainActivityName} ) has already been selected`,{
        id: toastId,
        duration: 2000
      });
    };
  };
  const handleDeleteMainActivity = (act) => {
    setAllMainActivitiesChosen(allMainActivitiesChosen.filter(el => +el?.mainActivityId !== +act?.mainActivityId));
    const deletedActivity = allMainActivitiesChosen.filter(el=> +el?.mainActivityId === +act?.mainActivityId);
    const subActsInsideDeletedActivity = async () => {
      const response = await axios.get(`${baseURL}/main-activities/${deletedActivity[0].mainActivitySlug}`);
      const subActivitiesInsideDeletedActivity = [...response?.data?.data?.subActivities];
      setChosenSubActivities(chosenSubActivities.filter((subAct) =>
        !subActivitiesInsideDeletedActivity.some(el => subAct.subActivityId === el.subActivityId)
      ));
    };
    subActsInsideDeletedActivity();
    setAllSubActsInsideMainActsChosen(
      allSubActsInsideMainActsChosen.filter(el=> +el?.mainActivityId !== +deletedActivity[0]?.mainActivityId)
    );
  };
  // getting SlectedArrOfSubActivities Logic
  const handleChangeSubActivity = (event) => {
    const toastId = toast.loading('Loading Sub Categories , Please Wait !');
    const chosenSubActivityArr = allSubActsInsideMainActsChosen?.map(el =>
      el?.subActivities?.find(subAct => +subAct?.subActivityId === +event?.target?.value));
    const chosenSubActivity = chosenSubActivityArr.find(el=> el && el);
    if(!chosenSubActivities?.find(el => chosenSubActivity?.subActivityId === +el?.subActivityId)){
      setChosenSubActivities([...chosenSubActivities,chosenSubActivity]);
      toast.success(`( ${chosenSubActivity?.subActivityName} ) Added Successfully`,{
        id: toastId,
        duration: 2000
      });
    }else {
      toast.error(`( ${chosenSubActivity?.subActivityName} ) were Added Before`,{
        id: toastId,
        duration: 2000
      });
    };
  };
  const handleDeleteSubActivity = (subAct) => {
    setChosenSubActivities(chosenSubActivities.filter(el=>+el?.subActivityId !== +subAct?.subActivityId));
  };

  // Getting DocumentsArray
  const [documents,setDocuments] = useState([]);
  const handleGettingFile = (event) => {
    setDocuments([...documents,event?.target?.files]);
    setValue('documents',...documents);
  };
  const handleDeleteFile = (doc) => {
    setDocuments(documents.filter(document => document[0].name !== doc[0].name));
    setValue('documents',...documents);
  };

  // getting Cities InsideCurrentChosenCountry
  const [currentCitiesInsideCountry,setCurrentCitiesInsideCountry] = useState([]);
  useEffect(()=>{
    setCurrentCitiesInsideCountry([]);
    let currentCountryId = watch('company_country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if(currentCountry){
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}`);
        setCurrentCitiesInsideCountry(response?.data?.data?.cities);
      };
      citiesInsideCurrentCountry();
      if(currentCitiesInsideCountry){
        toast.success('Cities Loaded Successfully.',{
          id: toastId,
          duration: 2000
        });
      }else {
        toast.error('Somthing Went Wrong Please Choose Your Country Again!',{
          id: toastId,
          duration: 2000
        });
        currentCountryId = ''
      }
    };
  },[watch('company_country_id')]);

  // getting Cities InsideCurrentChosenCountry For Employee
  const [currentEmployeeCitiesInsideCountry,setCurrentEmployeeCitiesInsideCountry] = useState([]);
  useEffect(()=>{
    setCurrentEmployeeCitiesInsideCountry([]);
    let currentCountryId = watch('employee_country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if(currentCountry){
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}`);
        if(response?.status === 200){
          setCurrentEmployeeCitiesInsideCountry(response?.data?.data?.cities);
          toast.success('Cities Loaded Successfully.',{
            id: toastId,
            duration: 2000
          });
        }else {
          toast.error('Somthing Went Wrong Please Choose Your Country Again!',{
            id: toastId,
            duration: 2000
          });
          currentCountryId = ''
        };
      };
      citiesInsideCurrentCountry();
    };
  },[watch('employee_country_id')]);

  useEffect(()=>{
    setValue('documents',documents);
    setValue('sub_activity_id',chosenSubActivities.map(el=> el?.subActivityId));
    setValue('activity_id',allMainActivitiesChosen.map(el=> el?.mainActivityId));
    setValue('company_main_type',currentBusinessTypes?.map(el=> el?.name));
  },[documents, chosenSubActivities,allMainActivitiesChosen,currentBusinessTypes]);

  const onSubmit = async (data) => {
    console.log(data);
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== 'logo' && key !== 'official_id_or_passport' && !Array.isArray(data[key])) {
        formData.append(key, data[key]);
      }else if(Array.isArray(data[key])){
        data[key].forEach((item) => {
          formData.append(`${key}[]`, item);
        });
      };
    });
    formData.append('logo', data.logo[0]);
    formData.append('official_id_or_passport', data.official_id_or_passport[0]);
    for (let [key, value] of formData.entries()) {
      console.log(key + ': ' + value);
    }
    await axios.post(`${baseURL}/company-registeration`, formData, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
      },
      }).then(response => {
        toast.success(response?.data?.message,{
          id: toastId,
          duration: 2000
        });
        navigate('/SignIn');
        reset();
      })
      .catch(error => {
        Object.keys(error?.response?.data?.errors).forEach((key) => {
          setError(key, {message: error?.response?.data?.errors[key][0]});
        });
        window.scrollTo({top: 550});
        toast.error(error?.response?.data?.message,{
          id: toastId,
          duration: 2000
        });
      });
  };



  return (
    <div className='signUpForm__mainSec py-5 mb-5'>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="signUpForm__mainContent">
              <div className="row">

                <h3 className="col-12 text-center py-5 signUpForm__head">
                  Business Information 
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className='row'>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpcompany_name">
                      Company Name <span className="requiredStar">*</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpcompany_name'
                      placeholder='Company’s Name'
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
                    <label htmlFor="signUpcompany_email">
                      E-mail Address <span className="requiredStar">*</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpcompany_email'
                      placeholder='ex: admin@gmail.com'
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
                    <label htmlFor="signUpCompany_main_types">
                      Type of Business 
                      <span className="requiredStar"> * </span>
                      <span className="optional">(MultiChoice)</span> 
                    </label>
                    <select
                      onChange={handleChangeBusinessType}
                      id="signUpCompany_main_types"
                      value={selectValue}
                      className={`form-select signUpInput ${errors.company_main_type ? 'inputError' : ''}`}
                    >
                      <option value="" disabled>
                        Select Type Of Business
                      </option>
                      {allTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <div>
                      {currentBusinessTypes.map((type) => (
                        <span className='chosen__choice' key={type.id}>
                          {type.name} 
                          <i 
                            onClick={()=>handleDeleteBusinessType(type)}
                            className="bi bi-trash chosen__choice-delete"
                          ></i>
                        </span>
                      ))}
                    </div>
                    {
                      errors.company_main_type 
                      &&
                      (<span className='errorMessage'>{errors.company_main_type.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpregisteration_number">
                      Business Registration Number 
                      <span className="requiredStar"> *</span>
                    </label>
                    <input 
                      type='number'
                      id='signUpregisteration_number'
                      placeholder="Company's Registeration Number"
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
                    <label htmlFor="signUpcategory_id">
                      Main Business Category 
                      <span className="requiredStar">*</span>
                    </label>
                    <select
                    id="signUpcategory_id" 
                    defaultValue={''}
                    className={`form-select signUpInput ${errors.category_id ? 'inputError' : ''}`}
                    {...register('category_id')} >
                      <option value="" disabled>
                        Select a Category
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
                      (<span className='errorMessage'>{errors.category_id.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpsub_category_id">
                      Business Sub-Category 
                      <span className="requiredStar">*</span>
                    </label>
                    <div className="position-relative">
                      <select
                      defaultValue={''}
                      id="signUpsub_category_id" 
                      className={`form-select signUpInput ${errors.sub_category_id ? 'inputError' : ''}`}
                      {...register('sub_category_id')} >
                        <option value="" disabled>
                          Select a Sub-Category
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
                      (<span className='errorMessage'>{errors.sub_category_id.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpactivity_id">
                      Main Business Activity
                      <span className="requiredStar"> * </span>
                      <span className="optional">(MultiChoice)</span> 
                    </label>
                    <select
                    id="signUpactivity_id" 
                    value={selectValue}
                    className={`form-select signUpInput ${errors.activity_id ? 'inputError' : ''}`}
                    onChange={handleChangeMainActivities}
                    >
                      <option value="" disabled>
                        Select a Activity
                      </option>
                      {mainActivities?.map((activity) => (
                        <option key={activity?.mainActivityId} value={activity?.mainActivityId}>
                          {activity?.mainActivityName}
                        </option>
                      ))}
                    </select>
                    <div>
                      {allMainActivitiesChosen.map((act) => (
                        <span className='chosen__choice' key={act?.mainActivityId}>
                          {act.mainActivityName} 
                          <i 
                            onClick={() => {
                              handleDeleteMainActivity(act);
                            }}
                            className="bi bi-trash chosen__choice-delete"
                          ></i>
                        </span>
                      ))}
                    </div>
                    {
                      errors.activity_id 
                      &&
                      (<span className='errorMessage'>{errors.activity_id.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpsub_activity_id">
                      Business Sub-Activity
                      <span className="requiredStar"> * </span>
                      <span className="optional">(MultiChoice)</span> 
                    </label>
                    <select
                      onChange={handleChangeSubActivity}
                      value={selectValue}
                      id="signUpsub_activity_id" 
                      className={`form-select signUpInput ${errors.sub_activity_id ? 'inputError' : ''}`}
                    >
                      <option value="" disabled>
                        Select a Sub-Category
                      </option>
                      {allSubActsInsideMainActsChosen?.map(activity=> activity?.subActivities?.map((subAct) =>
                            <option key={subAct?.subActivityId} value={subAct?.subActivityId}>
                              {subAct?.subActivityName}
                            </option>
                          ))}
                    </select>
                    <div>
                      {chosenSubActivities?.map((subAct) => (
                        <span className='chosen__choice' key={subAct?.subActivityId}>
                          {subAct.subActivityName} 
                          <i 
                            onClick={() => {
                              handleDeleteSubActivity(subAct);
                            }}
                            className="bi bi-trash chosen__choice-delete"
                          ></i>
                        </span>
                      ))}
                    </div>
                    {
                      errors.sub_activity_id 
                      &&
                      (<span className='errorMessage'>{errors.sub_activity_id.message }</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                      <label htmlFor="signUpindustry_id">
                        Industry <span className="requiredStar">*</span>
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
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpBusinessdocuments" className='singUp__upLoadBtn'>
                      Company's Doucuments <span className='fs-6'>( MultiChoice )</span>
                    </label>
                    <input 
                      onChange={handleGettingFile}
                      type='file'
                      id='signUpBusinessdocuments'
                      className={`signUpInput ${errors.documents ? 'inputError' : ''}`}
                    />
                    <div>
                      {documents?.map((doc,idx) => (
                        <span className='chosen__choice' key={doc[0]?.lastModified} title={doc[0]?.name}>
                          {(doc[0]?.name)?.slice(0,20)} 
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
                  <div className="col-lg-6 mb-4 position-relative text-center">
                    <label htmlFor="signUpLogo" className='singUp__upLoadBtn'>
                      Company's Logo
                    </label>
                    <input 
                      type='file'
                      id='signUpLogo'
                      className={`signUpInput ${errors.logo ? 'inputError' : ''}`}
                      {...register('logo')}
                    />
                    {
                      errors.logo
                      &&
                      (<p className='errorMessage'>{errors.logo.message}</p>)
                    }
                  </div>

                  <div className="signUpForm__head col-12 mt-5 mb-3 pt-4">
                    <h4>
                      Business Registered Address
                    </h4>
                  </div>
                  <div className="col-lg-6 mb-4">
                      <label htmlFor="signUpcompany_country_id">
                        Country / Region <span className="requiredStar">*</span>
                      </label>
                      <div className="position-relative">
                        <select
                        id="signUpcompany_country_id" 
                        className={`form-select signUpInput ${errors.company_country_id ? 'inputError' : ''}`}
                        {...register('company_country_id')} >
                          <option value="" disabled>
                            Select a Country
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
                      City <span className="requiredStar">*</span>
                    </label>
                    <select
                      id="signUpcompany_city_id" 
                      className={`form-select signUpInput ${errors.company_city_id ? 'inputError' : ''}`}
                      {...register('company_city_id')} >
                        <option value="" disabled>
                          Select a City
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
                    <label htmlFor="signUpcompany_full_address">
                      Company Full Address  <span className="requiredStar">*</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpcompany_full_address'
                      placeholder='Street name, City , Zip Code ...'
                      {...register('company_full_address')}
                      className={`form-control signUpInput ${errors.company_full_address ? 'inputError' : ''}`}
                    />
                    {
                      errors.company_full_address 
                      &&
                      (<span className='errorMessage'>{errors.company_full_address.message}</span>)
                    }
                  </div>

                  <div className="col-lg-12 my-5">
                    <h3 className='signUpForm__head mt-5 text-center'>
                      Employee Information
                    </h3>
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpemployee_name">
                      Employee's Name <span className="requiredStar">*</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpemployee_name'
                      placeholder='Employee Name'
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
                      Employee's E-mail <span className="requiredStar">*</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpemployee_email'
                      placeholder='ex: employee@gmail.com'
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
                      Employee's Mobile Number <span className="requiredStar"> * </span>
                    </label>
                    <div className="row">
                      <div className="col-3">
                        <input 
                          type='text'
                          value={`+962`}
                          className={`form-control signUpInput`}
                          disabled
                        />
                      </div>
                      <div className="col-9">
                        <input 
                          type='number'
                          id='signUpemployee_phone'
                          placeholder='Enter Employee phone number'
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
                      Employee's Title <span className="requiredStar"> *</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpemployee_title'
                      placeholder="Employee's title in the company"
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
                        Employee's <span className='fs-6'>(Country / Region)</span> <span className="requiredStar">*</span>
                      </label>
                      <div className="position-relative">
                        <select
                        id="signUpemployee_country_id" 
                        className={`form-select signUpInput ${errors.employee_country_id ? 'inputError' : ''}`}
                        {...register('employee_country_id')} >
                          <option value="" disabled>
                            Select a Country
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
                      Employee's City <span className="requiredStar">*</span>
                    </label>
                    <select
                      id="signUpemployee_city_id" 
                      className={`form-select signUpInput ${errors.employee_city_id ? 'inputError' : ''}`}
                      {...register('employee_city_id')} >
                        <option value="" disabled>
                          Select a City
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
                      Employee's Full Address  <span className="requiredStar">*</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpemployee_full_address'
                      placeholder='Street name, City , Zip Code ...'
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
                    <label htmlFor="signUpemployee_citizenship">
                      Employee's Citizenship <span className="requiredStar"> *</span>
                    </label>
                    <input 
                      type='text'
                      id='signUpemployee_citizenship'
                      placeholder="Enter Employee's CitizenShip"
                      {...register('employee_citizenship')}
                      className={`form-control signUpInput ${errors.employee_citizenship ? 'inputError' : ''}`}
                    />
                    {
                      errors.employee_citizenship 
                      &&
                      (<span className='errorMessage'>{errors.employee_citizenship.message}</span>)
                    }
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="signUpemployee_password">
                      Employee's Password <span className="requiredStar"> *</span>
                    </label>
                    <div className="position-relative">
                      <input 
                        type={`${showPassword ? 'text' : 'password'}`}
                        id='signUpemployee_password'
                        placeholder='Enter 8-digit password'
                        {...register('employee_password')}
                        className={`form-control signUpInput ${errors.employee_password ? 'inputError' : ''}`}
                      />
                      <div className="leftShowPasssord" onClick={()=>setShowPassword(!showPassword)}>
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
                  <div className='col-lg-6 text-center'>
                    <label htmlFor="signUpofficial_id_or_passport" className='singUp__upLoadBtn'>
                      Employee's <span className="fs-6">(Official-Id / Passport)</span>
                    </label>
                    <input 
                      type='file'
                      id='signUpofficial_id_or_passport'
                      {...register('official_id_or_passport')}
                      className={`signUpInput ${errors.official_id_or_passport ? 'inputError' : ''}`}
                    />
                    {
                      errors.official_id_or_passport
                      &&
                      (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                    }
                  </div>
                  <div className="col-lg-8 mb-4">
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
                        I confirm of acting on own behalf or on behalf of registered business, and I commit to updating the beneficial ownership information whenever a change has been made
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
                        Owner of the Company
                      </p>
                    </label>
                    {errors.is_benifical_owner && <p className='errorMessage'>{errors.is_benifical_owner.message}</p>}
                  </div>


                  <div className="col-lg-12">
                    <BusinessSignUpPackages />
                  </div>

                  <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                    <input disabled={isSubmitting} type="submit" value={'Submit For Review'} />
                  </div>
                </form>
                <div className="col-lg-12 signUpOtherWays text-center pe-4">
                  <div className="serviceTerms">
                    <p className='businessPrivacy'>
                      Once you submit for review our Team will start reviewing all the details, you will be notified through your E-mail within 5-7 business days.
                    </p>
                    <p>
                      By continuing, you agree to ReachMagnet's<br />  Terms of Service and acknowledge that you've read our Privacy Policy. 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
