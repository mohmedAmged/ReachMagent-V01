import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { scrollToTop } from '../../functions/scrollToTop';
import Cookies from 'js-cookie';
import { getDataFromAPI } from '../../functions/fetchAPI';
import toast from 'react-hot-toast';
import CompanyActivityFormTable from '../companyActivityFormTable/CompanyActivityFormTable';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function CompanyActivitiesForm(token,setUnAuth) {
  const [companyActivities,setCompanyActivities] = useState([]);
  const [activityUpdateStatus,setActivityUpdateStatus] = useState(localStorage.getItem('updatingCompanyActivities'));
  const [allActivities,setAllActivities] = useState([]);
  const activitiesFinalShape = {activity_id: [] ,sub_activity_id: []};
  const [updatePointer,setUpdatePointer] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const activitiesUpdated = Cookies.get('currentUpdatingActivities') ? false : true;

  useEffect(() => {
    getDataFromAPI('main-activities')
    .then((response )=> {
      setAllActivities(response?.mainActivities);
    })
    .catch((error) => {
      if(error?.response?.data?.message === 'Unauthorized'){
        setUnAuth(true);
      }
      toast.error(error?.response?.data?.message,{
        duration: 1000,
      });
    });
  },[]);
  useEffect(() => {
    const companyUpdatedDataInCookies = Cookies.get('currentUpdatingActivities');
    if (companyUpdatedDataInCookies) {
      const newShape = JSON.parse(companyUpdatedDataInCookies);
      if(newShape){
        setCompanyActivities(newShape);
      };
    };
}, [Cookies.get('currentUpdatingActivities')]);
  useEffect(() => {
    if(activitiesUpdated){
      if(companyActivities.length === 0){
        const companyUpdatedDataInCookies = Cookies.get('currentUpdatedCompanyData');
        if (companyUpdatedDataInCookies) {
          const newShape = JSON.parse(companyUpdatedDataInCookies);
          if(newShape){
            setCompanyActivities(newShape?.companyActivities);
          };
        };
      }
    }
}, []);

  const {
    handleSubmit,
    setValue,
    formState: {errors,isSubmitting}
  } = useForm({
    defaultValues: {
      activity_id: '',
      sub_activity_id: '',
    }
  });

  const handleAddMoreActivities = () => {
    setCompanyActivities([...companyActivities,{mainActivityName: '',subActivityName: ''}])
  };

  const handleDeleteThisTable = (index) => {
    setCompanyActivities(companyActivities?.filter((el,idx) => idx !== index ));
  };

  useEffect(()=>{
    const arrOfMainActNames = companyActivities?.map(el => el.mainActivityName);
    activitiesFinalShape.activity_id.push(...allActivities?.reduce((acc, item) => {
      if (arrOfMainActNames.includes(item.mainActivityName)) {
        acc.push(item.mainActivityId);
      }
      return acc;
    }, []));
    setValue('activity_id',activitiesFinalShape.activity_id);
  },[companyActivities,updatePointer]);

  const onSubmit = async (data) => {
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      data[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    });
    await axios.post(`${baseURL}/${loginType}/update-company-activities`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token.token}`,
      },
      }).then(response => {
        toast.success(`${response?.data?.message}.`,{
          id: toastId,
          duration: 1000,
        });
        Cookies.set('currentUpdatingActivities',JSON.stringify(response?.data?.data?.companyActivities ), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });
        localStorage.setItem('updatingCompanyActivities','notUpdating');
        window.location.reload();
      })
      .catch(error => {
        if(error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message,{
          id: toastId,
          duration: 2000
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4'>
      {companyActivities?.map((el,idx)=>{
        return (
          activityUpdateStatus === 'notUpdating' ?
            <div key={idx} className='w-100 d-flex gap-3'>
              <div className='mt-2 profileFormInputItem'>
                <input
                  id='dashboardCompanyMainCategory'
                  className='form-control signUpInput mt-2'
                  value={el?.mainActivityName}
                  type="text"
                  disabled={true}
                />
              </div>
              <div className='mt-2 profileFormInputItem'>
                <input
                  id='dashboardCompanyMainCategory'
                  className='form-control signUpInput mt-2'
                  value={el?.subActivityName}
                  type="text"
                  disabled={true}
                />
              </div>
            </div>
          :
            <>
              <div key={idx} className='w-100 d-flex gap-3'>
                <CompanyActivityFormTable
                  activityUpdateStatus={activityUpdateStatus}
                  index={idx}
                  allActivities={allActivities}
                  currMainActivityName={el?.mainActivityName}
                  errors={errors}
                  handleDeleteThisTable={handleDeleteThisTable}
                  companyActivities={companyActivities}
                  setUpdatePointer={setUpdatePointer}
                  updatePointer={updatePointer}
                  subActivityFinal={activitiesFinalShape?.sub_activity_id}
                  setValue={setValue}
                />
              </div>
            </>
        )
      })}
      {
        activityUpdateStatus !== 'notUpdating' &&
        <div className="addMoreActivitiesContainer text-center w-100">
          <span className="addMoreActivitiesBtn" onClick={handleAddMoreActivities}>Add More Activity</span>
        </div> 
      }
      <div className={`bottomContainer w-100 pt-5 text-center m-auto`}>
        {
          (activityUpdateStatus === 'notUpdating') ?
            <span className={`startUpdateBtn ${isSubmitting && 'd-none'}`} onClick={() => {
              scrollToTop();
              localStorage.setItem('updatingCompanyActivities', 'updating');
              setActivityUpdateStatus(localStorage.getItem('updatingCompanyActivities'));
              setCompanyActivities([{mainActivityName: '' , subActivityName: ''}]);
          }}>Update</span>
          :
          <input type="submit" disabled={isSubmitting} value="Confirm Changes" className='updateBtn mt-0' />
        }
      </div>
    </form>
  );
};