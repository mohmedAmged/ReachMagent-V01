import React, { useEffect, useState } from 'react';
import './CompanyEditForm.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import Cookies from 'js-cookie';

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
  {
    id: 6,
    name: 'Company Offers Customizations',
  },
];

export default function CompanySettingsForm({token,mainCategories,imgChanged,currnetImageUpdateFile,setCurrentImageUpdateError,setCurrentImage,company,setProfileUpdateStatus,profileUpdateStatus,countries}) {
  const loginType =localStorage.getItem('loginType');
  const [subCategories,setSubCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors , isSubmitting}
} = useForm({
    defaultValues: {
        email: company?.email,
        full_address: company?.full_address,
        category_id: '',
        sub_category_id: '',
        about_us: company?.about_us,
        logo: '',
        main_type: company?.companyTypes,
        city_id: '',
        address_one: '',
        address_two: '',
    },
    resolver: zodResolver(),
  });

  const [currentBusinessTypes , setCurrentBusinessTypes] = useState([]);
  const [selectValue,setSelectValue] = useState('');
  const handleChangeBusinessType = (event) => {
    const toastId = toast.loading('Loading , Please Wait !');
    const chosenType = allTypes.find(el => el.id === +event?.target?.value);
    if(!currentBusinessTypes.find(el=> chosenType?.id === +el)){
      setCurrentBusinessTypes([...currentBusinessTypes,chosenType]);
      allTypes = allTypes.filter(el=>el.id !== +chosenType.id);
      toast.success(`( ${ chosenType.name } ) Added Successfully.`,{
        id: toastId,
        duration: 2000
      });
      setSelectValue('');
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




  useEffect( ()=>{
    setValue('email',company?.email);
    setValue('full_address',company?.full_address);
    setValue('about_us',company?.about_us);
    setValue('main_type',company?.companyTypes?.map(el => el?.type));
    setValue('category_id', mainCategories?.find(cat => cat?.mainCategoryName === company?.category )?.mainCategoryId);
    setValue('sub_category_id',subCategories?.find(cat => cat?.subCategoryName === company?.sub_category )?.subCategoryId);
    setCurrentBusinessTypes(allTypes.filter(type => watch('main_type')?.includes(type.name)));
    allTypes = allTypes.filter(type => !watch('main_type')?.includes(type.name));
  },[company]);

  console.log(company);

  useEffect(()=>{
    setValue('logo',currnetImageUpdateFile);
  },[currnetImageUpdateFile]);

  useEffect(() => {
    const currentChosenCategory = mainCategories?.find(cat => +cat?.mainCategoryId === +watch('category_id'));
    if(currentChosenCategory){
      (async () => { 
        try {
          const response = await axios.get(`${baseURL}/main-categories/${currentChosenCategory?.mainCategorySlug}`);
          setSubCategories(response?.data?.data?.subCategories);
        } catch(error) {
          toast.error(`${error?.response?.data?.message || 'Please try again !'}`);
        }
      })();
    }
  },[watch('category_id')]);

  const onSubmit = async (data) => {
    console.log(data);
  // const toastId = toast.loading('Please Wait...');
  // const formData = new FormData();
  // Object.keys(data).forEach((key) => {
  //     if (key !== 'image' && key !== 'official_id_or_passport') {
  //         formData.append(key, data[key]);
  //     };
  // });
  // if(imgChanged && data.image[0]){
  //     formData.append('image', data.image[0]);
  // };
  // await axios.post(`${baseURL}/${loginType}/update-profile`, formData, {
  //     headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${token}`,
  //     },
  //     }).then(response => {
  //         toast.success(`${response?.data?.message}.`,{
  //             id: toastId,
  //             duration: 1000,
  //         });
  //         loginType === 'employee' ?
  //             Cookies.set('currentLoginedData',JSON.stringify(response?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
  //         :
  //             Cookies.set('currentLoginedData',JSON.stringify(response?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })

  //         localStorage.setItem('updatingProfile','notUpdating');
  //         window.location.reload();
  //     })
  //     .catch(error => {
  //         Object.keys(error?.response?.data?.errors).forEach((key) => {
  //             setError(key, {message: error?.response?.data?.errors[key][0]});
  //         });
  //         if(error?.response?.data?.errors.image){
  //         };
  //         toast.error(error?.response?.data?.message,{
  //             id: toastId,
  //             duration: 2000
  //         });
  //     });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4'>
      <div className="mt-2 profileFormInputItem">
        <label htmlFor="dashboardCompanyEmail">Company E-Mail</label>
        <input
          id='dashboardCompanyEmail'
          className={`form-control signUpInput mt-2 ${errors?.email ? 'inputError' : ''}`}
          {...register('email')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.email
          &&
          (<span className='errorMessage'>{errors?.email?.message}</span>)
        }
      </div>
      <div className="mt-2 profileFormInputItem">
        <label htmlFor="dashboardCompanyFullAddress">Company FullAddress</label>
        <input
          id='dashboardCompanyFullAddress'
          className={`form-control signUpInput mt-2 ${errors?.full_address ? 'inputError' : ''}`}
          {...register('full_address')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.full_address
          &&
          (<span className='errorMessage'>{errors?.full_address?.message}</span>)
        }
      </div>
      <div className="mt-2 profileFormInputItem">
        <label htmlFor="dashboardCompanyMainCategory">Main Category</label>
        {
          (profileUpdateStatus === 'notUpdating') ?
              <input
                  id='dashboardCompanyMainCategory'
                  className='form-control signUpInput mt-2'
                  value={company?.category}
                  type="text"
                  disabled={true}
              />
              :
              <>
              <select
                className={`form-select signUpInput mt-2 ${errors?.category_id ? 'inputError' : ''}`}
                defaultValue={watch('category_id')}
                {...register('category_id')}
                id="dashboardCompanyMainCategory"
              >
                <option disabled value="">Select Your Country</option>
                {
                  mainCategories?.map(cat => (
                      <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>{cat?.mainCategoryName}</option>
                  ))
                }
              </select>
              {
                errors?.category_id
                &&
                (<span className='errorMessage'>{errors?.category_id?.message}</span>)
              }
              </>
            }
      </div>
      <div className="mt-2 profileFormInputItem">
        <label htmlFor="dashboardCompanySubCategory">Sub-Category</label>
        {
          (profileUpdateStatus === 'notUpdating') ?
              <input
                  id='dashboardCompanySubCategory'
                  className='form-control signUpInput mt-2'
                  value={company?.sub_category}
                  type="text"
                  disabled={true}
              />
              :
              <>
              <select
                className={`form-select signUpInput mt-2 ${errors?.sub_category_id ? 'inputError' : ''}`}
                defaultValue={watch('sub_category_id')}
                {...register('sub_category_id')}
                id="dashboardCompanySubCategory"
              >
                <option disabled value="">Select Your Country</option>
                {
                  mainCategories?.map(cat => (
                      <option key={cat?.subCategoryId} value={cat?.subCategoryId}>{cat?.subCategoryName}</option>
                  ))
                }
              </select>
              {
                errors?.sub_category_id
                &&
                (<span className='errorMessage'>{errors?.sub_category_id?.message}</span>)
              }
              </>
            }
      </div>
      <div className="mt-2 profileFormInputItem">
        <label htmlFor="dashboardCompanyabout_us">About Company</label>
        <input
          id='dashboardCompanyabout_us'
          className={`form-control signUpInput mt-2 ${errors?.about_us ? 'inputError' : ''}`}
          {...register('about_us')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.about_us
          &&
          (<span className='errorMessage'>{errors?.about_us?.message}</span>)
        }
      </div>
      <div className={`mt-2 profileFormInputItem w-100 ${profileUpdateStatus === 'notUpdating' && 'ps-3'}`}>
        <label htmlFor="dashboardCompanymainType">Company Types</label>
        {(profileUpdateStatus === 'notUpdating') ?
          <div >
            {currentBusinessTypes?.map((el) => (
              <span className='chosen__choice' key={el?.id}>
                {el.name}
              </span>
            ))}
          </div>
        :
        <>
          <select
            value={selectValue}
            onChange={handleChangeBusinessType}
            className={`form-select signUpInput mt-2 ${errors?.country_id ? 'inputError' : ''}`}
            id="dashboardCompanymainType"
          >
          <option disabled value="">Select Company Types</option>
          {
            allTypes?.map(type => (
              <option key={type?.id} value={type?.id}>{type?.name}</option>
            ))
          }
          </select>
          {
            errors?.main_type
            &&
            (<span className='errorMessage'>{errors?.main_type?.message}</span>)
          }
          {currentBusinessTypes?.map((el) => (
            <span className='chosen__choice' key={el?.id}>
              {el?.name}
              <i 
                onClick={()=>handleDeleteBusinessType(el)}
                className="bi bi-trash chosen__choice-delete"
              ></i>
            </span>
          ))}
        </>
        }
      </div>
    </form>
  );
};
