import React, { useEffect, useRef, useState } from 'react';
import './activityTable.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function CompanyActivityFormTable(
  {index,
  errors,
  allActivities,
  currMainActivity,
  companyActivities,
  currsubActivity,
  setUpdatePointer,
  updatePointer,
  // subActivityFinal,
  activitiesFinalShape,
  setValue,

  }) {
  const [mainAct,setMainAct] = useState(currMainActivity || '');
  const [subAct,setSubAct] = useState([]);
  // const [defaultSubAct,setDefaultSubAct] = useState(currsubActivity);
  // useEffect(()=>{
  //   setMainAct(allActivities?.find(act=> act?.mainActivityName === currMainActivityName));
  // },[currMainActivityName]);
  const fileInputRef = useRef(null);
console.log(activitiesFinalShape);

  const subActsInsideCurrentMainActs = async (mainActivitySlug,toastId) => {
    const response = await axios.get(`${baseURL}/main-activities/${mainActivitySlug}`);
    if(response?.status === 200){
      setSubAct(response?.data?.data?.subActivities);
      toast.success(`Sub-Activities Loaded Successfully.`,{
        id: toastId,
        duration: 1000
      });
      if(toastId){
        fileInputRef.current.value = '';
      };
     
    }else{
      toast.error(`something went wrong ,Please try again !`,{
        id: toastId,
        duration: 1000
      });
    };
  };

  const handleChangeMainActivity = (event) => {
    const toastId = toast.loading('Loading Sub-Activities , Please Wait !');
    const chosenActivity = allActivities?.find(el => el?.mainActivityId === +event);
    activitiesFinalShape.activity_id = activitiesFinalShape.activity_id.map((el, idx) => idx === index ? +event : el)
      companyActivities.mainActivityName = chosenActivity?.mainActivityName;
      setUpdatePointer(!updatePointer);
      subActsInsideCurrentMainActs(chosenActivity?.mainActivitySlug, toastId);
  };

  const handleChangeSubActivity = (event) => {
    const toastId = toast.loading('Adding Sub-Activity , Please Wait !');
    const chosenActivity = subAct?.find(el => el?.subActivityId === +event?.target?.value);
    activitiesFinalShape.sub_activity_id = activitiesFinalShape.sub_activity_id.map((el, idx) => idx === index ? +event.target.value : el)
      companyActivities.subActivityName = chosenActivity?.subActivityName;
      setUpdatePointer(!updatePointer);
      toast.success('Sub-Activity Added Successfuly.',{
        id: toastId,
        duration: 1000,
      });
   
  };

  // useEffect(()=>{
  //   const arrOfSubActNames = companyActivities?.map(el => el.subActivityName);
  //   subActivityFinal.push(...subAct?.reduce((acc, item) => {
  //     if (arrOfSubActNames.includes(item.subActivityName)) {
  //       acc.push(item.subActivityId);
  //     }
  //     return acc;
  //   }, []));
  //   setValue('sub_activity_id',subActivityFinal);
  // },[companyActivities,updatePointer]);

  useEffect(()=>{
    if(mainAct){
      subActsInsideCurrentMainActs(allActivities?.find((activity)=>(+activity.mainActivityId === +currMainActivity)).mainActivitySlug);
    };
  },[]);

  useEffect(()=>{
    if(currsubActivity){
      fileInputRef.current.value = currsubActivity;
    }
  },[currsubActivity]);
console.log(allActivities);

  return (
    <>
      <div className='mt-2 profileFormInputItem activitiesSelect'>
        <select
          defaultValue={mainAct}
          onChange={(e) => handleChangeMainActivity(e.target.value)}
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
          value={currsubActivity}
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

      </>
  )
}