import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import CompanyWorkHourFormTable from '../companyWorkHourFormTableItem/CompanyWorkHourFormTable';
import toast from 'react-hot-toast';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function CompanyWorkHourForm({ token ,setUnAuth }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])
    const [editMode, setEditMode] = useState(false);

    const fetchShowCompany = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                }
            });
            setNewdata(response?.data?.data?.workingHours);
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
                {editMode ? `${t('DashboardBussinessSettingsPage.cancelUpdateActivityBtn')}` : `${t('DashboardBussinessSettingsPage.updateWorkHourBtn')}`}
            </button>
            {!editMode ? (
                <form>
                    {newData?.map((el, index) => (
                        <div key={index} className="w-100 WorkHourTables__box">
                            <div className="mt-2 profileFormInputItem">
                                <label>{t('DashboardBussinessSettingsPage.dayOfWeekFormInput')}</label>
                                <input
                                    className="form-control signUpInput mt-2"
                                    value={el?.day_of_week}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="mt-2 profileFormInputItem">
                                <label>{t('DashboardBussinessSettingsPage.openingTimeFormInput')}</label>
                                <input
                                    className="form-control signUpInput mt-2"
                                    value={el?.opening_time}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="mt-2 profileFormInputItem">
                                <label>{t('DashboardBussinessSettingsPage.closingTimeFormInput')}</label>
                                <input
                                    className="form-control signUpInput mt-2"
                                    value={el?.closing_time}
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>
                    ))}
                </form>
            ) : (
                <CompanyWorkHourFormTable 
                setUnAuth={setUnAuth} 
                token={token} 
                workingHours={newData} 
                editMode={editMode} 
                setEditMode={setEditMode} 
                fetchShowCompany={fetchShowCompany}/>
            )}
            
        </div>


    )
}
