import React, { useEffect, useRef, useState } from 'react';
import './activityTable.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function CompanyActivityFormTable(
  {index,
  handleDeleteThisTable,
  activityUpdateStatus,
  errors,
  allActivities,
  currMainActivityName,
  companyActivities,
  setUpdatePointer,
  updatePointer,
  subActivityFinal,
  setValue
  }) {

  const [mainAct,setMainAct] = useState(allActivities?.find(act=> act?.mainActivityName === currMainActivityName) || {});
  const [subAct,setSubAct] = useState([]);
  useEffect(()=>{
    setMainAct(allActivities?.find(act=> act?.mainActivityName === currMainActivityName));
  },[currMainActivityName]);
  const fileInputRef = useRef(null);

  const handleChangeMainActivity = (event) => {
    const toastId = toast.loading('Loading Sub-Activities , Please Wait !');
    const chosenActivity = allActivities?.find(el => el?.mainActivityId === +event?.target?.value);
    if(!companyActivities.find(el => el?.mainActivityName === chosenActivity?.mainActivityName)){
      companyActivities[index].mainActivityName = chosenActivity?.mainActivityName;
      setUpdatePointer(!updatePointer);
      const subActsInsideCurrentMainActs = async () => {
        const response = await axios.get(`${baseURL}/main-activities/${chosenActivity?.mainActivitySlug}`);
        if(response?.status === 200){
          setSubAct(response?.data?.data?.subActivities);
          toast.success(`( ${chosenActivity?.mainActivityName} ) Sub-Activities Loaded Successfully.`,{
            id: toastId,
            duration: 1000
          });
          fileInputRef.current.value = '';
        }else{
          toast.error(`something went wrong ,Please try again !`,{
            id: toastId,
            duration: 1000
          });
        };
      };
      subActsInsideCurrentMainActs();
    }else {
      toast.error('This Main Activity Added Before!',{
        id: toastId,
        duration: 1000,
      });
      event.target.value = '';
    }
  };

  const handleChangeSubActivity = (event) => {
    const toastId = toast.loading('Adding Sub-Activity , Please Wait !');
    const chosenActivity = subAct?.find(el => el?.subActivityId === +event?.target?.value);
    if(!companyActivities.find(el => el?.subActivityName === chosenActivity?.subActivityName)){
      companyActivities[index].subActivityName = chosenActivity?.subActivityName;
      setUpdatePointer(!updatePointer);
      toast.success('Sub-Activity Added Successfuly.',{
        id: toastId,
        duration: 1000,
      });
    }else {
      toast.error('This Sub-Activity Added Before!',{
        id: toastId,
        duration: 1000,
      });
      event.target.value = '';
    };
  };

  useEffect(()=>{
    const arrOfSubActNames = companyActivities?.map(el => el.subActivityName);
    subActivityFinal.push(...subAct?.reduce((acc, item) => {
      if (arrOfSubActNames.includes(item.subActivityName)) {
        acc.push(item.subActivityId);
      }
      return acc;
    }, []));
    setValue('sub_activity_id',subActivityFinal);
  },[companyActivities,updatePointer]);

  return (
    <>
      <div className='mt-2 profileFormInputItem activitiesSelect'>
        <select
          defaultValuevalue={''}
          onChange={handleChangeMainActivity}
          className={`form-select signUpInput mt-2 ${errors?.activity_id?.message[index] ? 'inputError' : ''}`}
          id="dashboardCompanymainType"
        >
          <option disabled value="">Company Activity</option>
          {
            allActivities?.map(act=>{
              return(
                <option key={act?.mainActivityId} value={act?.mainActivityId}>{act?.mainActivityName}</option>
              );
            })
          }
        </select>
        {
          errors?.activity_id?.message[index] &&
          <span className='errorMessage'>{errors?.activity_id?.message[index]}</span>
        }
      </div>
      <div className='mt-2 profileFormInputItem activitiesSelect'>
      <select
          ref={fileInputRef}
          defaultValue={''}
          className={`form-select signUpInput mt-2 ${errors?.sub_activity_id?.message[index] ? 'inputError' : ''}`}
          id="dashboardCompanymainType"
          onChange={handleChangeSubActivity}
        >
          <option disabled value="">Company Sub-Activity</option>
          {
            subAct?.map(sub=>{
              return(
                <option key={sub?.subActivityId} value={sub?.subActivityId}>{sub?.subActivityName}</option>
              );
            })
          }
        </select>
        {
          errors?.sub_activity_id?.message[index] &&
          <span className='errorMessage'>{errors?.sub_activity_id?.message[index]}</span>
        }
      </div>
      {
        activityUpdateStatus !== 'notUpdating' &&
        <div className="removeMoreActivitiesContainer text-center">
          <span className="removeMoreActivitiesBtn" onClick={()=> handleDeleteThisTable(index)}>
            <i className="bi bi-trash"></i>
          </span>
        </div> 
      }
      </>
  )
}
