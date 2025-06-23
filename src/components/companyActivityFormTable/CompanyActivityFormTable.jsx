import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function CompanyActivityFormTable({
  index,
  allActivities,
  currMainActivity,
  currsubActivity,
  activitiesFinalShape,
}) {
  const { t } = useTranslation();
  const [mainAct, setMainAct] = useState(currMainActivity || '');
  const [subAct, setSubAct] = useState([]);
  const [selectedSubAct, setSelectedSubAct] = useState(currsubActivity || '');
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (mainAct) {
      const loadSubActivities = async () => {
        try {
          const chosenActivity = allActivities.find(
            (act) => act.mainActivityId === +mainAct
          );

          if (chosenActivity?.mainActivitySlug) {
            const response = await axios.get(
              `${baseURL}/main-activities/${chosenActivity.mainActivitySlug}`,
              {
                          headers:{
                            "Locale": Lang
                          }
              }
            );
            setSubAct(response?.data?.data?.subActivities || []);
          }
        } catch (error) {
          console.error('Error loading sub-activities:', error);
          toast.error('Failed to load sub-activities.');
        }
      };

      loadSubActivities();
    }
  }, [mainAct, allActivities]);

  const handleChangeMainActivity = (event) => {
    const selectedValue = event.target.value;
    setMainAct(selectedValue);

    const updatedActivityId = activitiesFinalShape.activity_id.map((item) =>
      item.id === index ? { ...item, value: selectedValue } : item
    );

    activitiesFinalShape.activity_id = updatedActivityId;
    setSubAct([]);
    setSelectedSubAct('');
  };

  const handleChangeSubActivity = (event) => {
    const selectedValue = event.target.value;
    setSelectedSubAct(selectedValue);

    const updatedSubActivityId = activitiesFinalShape.sub_activity_id.map((item) =>
      item.id === index ? { ...item, value: selectedValue } : item
    );

    activitiesFinalShape.sub_activity_id = updatedSubActivityId;
  };

  return (
    <>
      <div className="mt-2 profileFormInputItem activitiesSelect">
        <select
          value={mainAct}
          onChange={handleChangeMainActivity}
          className={`form-select signUpInput mt-2 ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
          id="dashboardCompanymainType"
        >
          <option disabled value="">
           {t('DashboardBussinessSettingsPage.mainActivityFormInputPlaceholder')}
          </option>
          {allActivities?.map((act) => (
            <option key={act.mainActivityId} value={act.mainActivityId}>
              {act.mainActivityName}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 profileFormInputItem activitiesSelect">
        <select
          ref={fileInputRef}
          value={selectedSubAct}
          onChange={handleChangeSubActivity}
          className={`form-select signUpInput mt-2 ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
          id="dashboardCompanySubType"
          disabled={!subAct.length}
        >
          <option disabled value="">
            {t('DashboardBussinessSettingsPage.subActivityFormInputPlaceholder')}
          </option>
          {subAct?.map((sub) => (
            <option key={sub.subActivityId} value={sub.subActivityId}>
              {sub.subActivityName}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
