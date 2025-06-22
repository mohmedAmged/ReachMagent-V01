import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function CompanyTimezoneFormTable({ token, timezone, setEditMode, fetchShowCompany }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType')
    const [allowedTimezones, setAllowedTimezones] = useState([])
    const [selectedTimezone, setSelectedTimezone] = useState(timezone || '');

    const fetchAllowedTimeZones = async () => {
        try {
            const response = await axios.get(`${baseURL}/allowed-timezones?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                }
            });
            setAllowedTimezones(response?.data?.data?.timezones || []);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Somthing Went Wrong');
        };
    };
    useEffect(() => {
        fetchAllowedTimeZones();
    }, [loginType, token]);

    const handleTimezoneChange = (e) => {
        setSelectedTimezone(e.target.value); 
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const slug = loginType === 'user' ? 'user/update-timezone' : 'employee/update-company-timezone'
            const response = await axios.post(
                `${baseURL}/${slug}?t=${new Date().getTime()}`,
                { timezone: selectedTimezone },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Timezone updated successfully');
                setEditMode(false)
                fetchShowCompany()
            } 
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                const displayedMessages = new Set(); 
                Object.values(validationErrors).forEach((messages) => {
                    messages.forEach((message) => {
                        if (!displayedMessages.has(message)) {
                            toast.error(message); 
                            displayedMessages.add(message);
                        }
                    });
                });
            } else {
                console.error("Error: ", error.response || error.message);
                toast.error("Error updating Timezone.");
            }
        }
    };



    return (
        <form onSubmit={handleFormSubmit} className='companyWorkHourTable__handler'>
                <div className="w-100 WorkHourTables__box">

                    <div className="mt-2 profileFormInputItem">
                        <label>{t('DashboardProileSettingsPage.userTimezoneFilterItem')}</label>
                        <select
                            className={`form-control custom-select signUpInput mt-2 ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                            name="timezone"
                            value={selectedTimezone} 
                            onChange={handleTimezoneChange} 
                        >
                            <option value="" disabled>{t('DashboardProileSettingsPage.companyTimeZonesFormInputPlaceholder')}</option>
                            {
                                allowedTimezones?.map((el) => (
                                    <option key={el} value={el}>{el}</option>
                                ))
                            }
                        </select>
                    </div>

                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    {t('DashboardProileSettingsPage.updateTimeBtnFormInput')}
                </button>

        </form>
    )
}
