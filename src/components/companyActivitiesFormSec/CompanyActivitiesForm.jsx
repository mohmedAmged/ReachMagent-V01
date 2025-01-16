import React, { act, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDataFromAPI } from '../../functions/fetchAPI';
import toast from 'react-hot-toast';
import CompanyActivityFormTable from '../companyActivityFormTable/CompanyActivityFormTable';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

// const activitiesFinalShape = { activity_id: [], sub_activity_id: [] };

export default function CompanyActivitiesForm(token, setUnAuth) {
  const [companyActivities, setCompanyActivities] = useState([]);
  const [activitiesFinalShape, setActivitiesFinalShape] = useState({ activity_id: [], sub_activity_id: [] });
  const [allActivities, setAllActivities] = useState([]);
  const [updatePointer, setUpdatePointer] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const [editMode, setEditMode] = useState(false);
  const [editCase, setEditCase] = useState(false)
  useEffect(() => {
    getDataFromAPI('main-activities')
      .then((response) => {
        setAllActivities(response?.mainActivities);
      })
      .catch((error) => {
        if (error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        }
        toast.error(error?.response?.data?.message, {
          duration: 1000,
        });
      });
  }, []);
// console.log(allActivities);

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      activity_id: '',
      sub_activity_id: '',
    }
  });

  useEffect(() => {
    if(token && loginType === 'employee'){
      
        (async()=>{
          axios.get(`${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`,{
            headers:{
              Authorization: `Bearer ${token.token}`
            }
          })
          .then(res => {
            setCompanyActivities(res?.data?.data?.companyActivities);
          })
          .catch(err => {
            toast.error(err?.response?.data?.message);
          })
        })();
      
    };
  }, []);
// console.log(companyActivities);

  const handleAddMoreActivities = () => {
    setActivitiesFinalShape({activity_id: [...activitiesFinalShape.activity_id, ''], sub_activity_id:[...activitiesFinalShape.sub_activity_id, '']})
  };

  const handleDeleteThisTable = (index) => {
    const deletedActivity = activitiesFinalShape.activity_id?.filter((el,idx)=>(
      index !== idx && el
    ))  
    const deletedSubAvtivity = activitiesFinalShape.sub_activity_id?.filter((el,idx)=>(
      index !== idx && el
    ))    
    console.log(deletedActivity, deletedSubAvtivity);
    
    setActivitiesFinalShape({activity_id: deletedActivity, sub_activity_id:deletedSubAvtivity})
    setEditCase(!editCase)
  };

  // useEffect(() => {
  //   const arrOfMainActNames = companyActivities?.map(el => el.mainActivityName);
  //   activitiesFinalShape.activity_id.push(...allActivities?.reduce((acc, item) => {
  //     if (arrOfMainActNames.includes(item.mainActivityName)) {
  //       acc.push(item.mainActivitySlug);
  //     }
  //     return acc;
  //   }, []));
  //   setValue('activity_id', activitiesFinalShape.activity_id);
  // }, [companyActivities]);
  useEffect(() => {

}, [companyActivities]);
// console.log(watch('activity_id'));
//  console.log(activitiesFinalShape);
 
  useEffect(()=>{

    const arrOfMainActNames = companyActivities?.map(el => el.mainActivityName);
    const filteredActivities = arrOfMainActNames?.map(item => allActivities.find((el)=>el.mainActivityName === item));
    const activitySlugs = filteredActivities?.map(item => item.mainActivitySlug);
    console.log(filteredActivities);
    setActivitiesFinalShape()


    const finalShape = {...activitiesFinalShape, activity_id:activitySlugs}
    activitySlugs.map((slug,idx)=>(
    (async()=>{
      const response = await axios.get(`${baseURL}/main-activities/${slug}`);
      finalShape.activity_id[idx] = response?.data?.data?.mainActivityId;
      finalShape.sub_activity_id?.push(response?.data?.data?.subActivities?.find((subAct)=>(subAct.subActivityName === companyActivities[idx]?.subActivityName))?.subActivityId);
    })()
  ))
  setActivitiesFinalShape(finalShape)
  },[companyActivities])
// (async()=>{
//   console.log(await activitiesFinalShape?.activity_id);
// })()
  const onSubmit = async (data) => {
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(activitiesFinalShape).forEach((key) => {
      activitiesFinalShape[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    });
    await axios.post(`${baseURL}/${loginType}/update-company-activities?t=${new Date().getTime()}`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token.token}`,
      },
    }).then(response => {
      toast.success(`${response?.data?.message}.`, {
        id: toastId,
        duration: 1000,
      });
      window.location.reload();
    })
      .catch(error => {
        if (error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message, {
          id: toastId,
          duration: 2000
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4'>
      <button type='button' className='editModeBtn' onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel Update' : 'Update Activities'}
      </button>
      {!editMode ?
        companyActivities?.map((el, idx) => {
        return (
          
            <div key={idx} className='w-100 row'>
              <div className='col-6 mt-2 profileFormInputItem'>
                <label htmlFor="dashboardCompanyMainActivity">Main Activity</label>
                <input
                  id='dashboardCompanyMainActivity'
                  className='form-control signUpInput w-100 mt-2'
                  value={el?.mainActivityName}
                  type="text"
                  disabled={true}
                />
              </div>
              <div className='col-6 mt-2 profileFormInputItem'>
                <label htmlFor="dashboardCompanySubActivity">Sub Activity</label>
                <input
                  id='dashboardCompanySubActivity'
                  className='form-control signUpInput w-100 mt-2'
                  value={el?.subActivityName}
                  type="text"
                  disabled={true}
                />
              </div>
            </div>
          
        )})
      :
      activitiesFinalShape?.activity_id?.map((el,idx)=>(
        <div className='text-center w-100' key={idx}>
          <div className='w-100 d-flex gap-3'>
            <CompanyActivityFormTable
              activityUpdateStatus={editMode}
              index={idx}
              allActivities={allActivities}
              currMainActivity={el}
              currsubActivity={activitiesFinalShape?.sub_activity_id[idx]}
              errors={errors}
              companyActivities={companyActivities}
              setUpdatePointer={setUpdatePointer}
              updatePointer={updatePointer}
              // subActivityFinal={activitiesFinalShape?.sub_activity_id}
              setValue={setValue}
              activitiesFinalShape={activitiesFinalShape}
            />
          </div>
          {
            editMode &&
            <div className="profileFormInputItem text-center flex-1">
              <button onClick={() => handleDeleteThisTable(idx)} type='button' className='deleteBtn'>
                delete <i className="bi bi-trash3"></i>
              </button>
            </div>
          }
        </div>
      ))
     
}
      {
        editMode &&
        <div className="formActions text-center">
          <button type="button" className="btn btn-secondary my-3 w-100" onClick={handleAddMoreActivities}>
            + Add More Company Activities
          </button>
          <button type="submit" className="updateBtn mt-3">
            Submit Changes
          </button>
        </div>
      }
    </form>
  );
};