import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import CompanyTimezoneFormTable from '../companyTimezoneFormTableSec/CompanyTimezoneFormTable';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function CompanyTimezoneForm({ token ,setUnAuth }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])
    const [editMode, setEditMode] = useState(false);

    const fetchShowCompany = async () => {
        try {
            const slug = loginType === 'user' ? 'user/profile' : 'employee/show-company'
            const response = await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale":Lang
                }
            });
            if (loginType === 'user') {
                setNewdata(response?.data?.data?.user?.timezone);
            }else{
                setNewdata(response?.data?.data?.timezone);

            }
        } catch (error) {
            if(error?.response?.data?.message === 'Unauthorized'){
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Somthing Went Wrong');
        };
    };
    useEffect(() => {
        fetchShowCompany();
    }, [loginType, token]);
  return (
    <div className='companyWorkHourTable__handler'>
    <button className='editModeBtn' onClick={() => setEditMode(!editMode)}>
        {editMode ? `${t('DashboardProileSettingsPage.cancelBtnFormInput')}` : `${t('DashboardProileSettingsPage.updateTimeBtnFormInput')}`}
    </button>
    {!editMode ? (
        <form>

                <div className="w-100 WorkHourTables__box">
                    <div className="mt-2 profileFormInputItem">
                        <label>{t('DashboardProileSettingsPage.timeZoneFormInput')}</label>
                        <input
                            className="form-control signUpInput mt-2"
                            value={newData}
                            type="text"
                            disabled
                        />
                    </div>
                </div>
          
        </form>
    ) : (
        <CompanyTimezoneFormTable setUnAuth={setUnAuth} token={token} timezone={newData} editMode={editMode} setEditMode={setEditMode} fetchShowCompany={fetchShowCompany}/>
    )}
    
    </div>
  )
}
