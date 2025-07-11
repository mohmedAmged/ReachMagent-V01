import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import './companyWorkHourFormTable.css'
import { useTranslation } from 'react-i18next';
import { Lang } from '../../functions/Token';
export default function CompanyWorkHourFormTable({ token, workingHours,  setEditMode, fetchShowCompany }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType')

    const convertTo24HourFormat = (time) => {
        const [hours, minutes] = time.split(/:| /);
        const modifier = time.split(" ")[1];
        let hours24 = parseInt(hours, 10);
    
        if (modifier === "PM" && hours24 !== 12) {
            hours24 += 12;
        } else if (modifier === "AM" && hours24 === 12) {
            hours24 = 0;
        }
    
        return `${String(hours24).padStart(2, "0")}:${minutes}`;
    };

    const [formData, setFormData] = useState([]);

    useEffect(() => {
        if (workingHours?.length > 0) {
            setFormData(workingHours?.map((hour) => ({
                day_of_week: hour?.day_of_week || "",
                opening_time: convertTo24HourFormat(hour?.opening_time) || "",
                closing_time: convertTo24HourFormat(hour?.closing_time) || ""
            })));
        }
    }, [workingHours]);


    const handleInputChange = (index, name, value) => {
        setFormData((prevState) => {
            const updatedData = [...prevState];
            updatedData[index][name] = value;
            return updatedData;
        });
    };

    const handleAddWorkingHour = () => {
        setFormData((prevState) => [
            ...prevState,
            { day_of_week: "", opening_time: "", closing_time: "" }
        ]);
    };

    const handleDeleteWorkingHour = (index) => {
        setFormData((prevState) => prevState.filter((_, i) => i !== index));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        formData.forEach((hour, index) => {
            submissionData.append(`day_of_week[${index}]`, hour.day_of_week.toLowerCase());
            submissionData.append(`opening_time[${index}]`, hour.opening_time);
            submissionData.append(`closing_time[${index}]`, hour.closing_time);
        });
        try {
            const response = await axios.post(
                `${baseURL}/${loginType}/update-company-working-hours?t=${new Date().getTime()}`,
                submissionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Work hours updated successfully');
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
                toast.error("Error updating work hours.");
            }
        }
    };
    // console.log(formData);
    // console.log(workingHours);
    console.log("Form Data:", formData);
    
    
    return (
        <form onSubmit={handleFormSubmit} className='companyWorkHourTable__handler'>
            {formData?.map((day, index) => (
                <div key={index} className="w-100 WorkHourTables__box">

                    <div className="mt-2 profileFormInputItem">
                        <label>{t('DashboardBussinessSettingsPage.dayOfWeekFormInput')}</label>
                        <select
                            className={`form-control custom-select signUpInput mt-2 ${Lang === 'ar' ? 'formSelect_RTL' :""}`}
                            name="day_of_week"
                            value={day?.day_of_week || ""}
                            onChange={(e) =>
                                handleInputChange(index, 'day_of_week', e.target.value)
                            }
                        >
                            <option value="" disabled>{t('DashboardBussinessSettingsPage.dayFormInput')}</option>
                            <option value="Sunday">{t('DashboardBussinessSettingsPage.SundayFormInput')}</option>
                            <option value="Monday">{t('DashboardBussinessSettingsPage.MondayFormInput')}</option>
                            <option value="Tuesday">{t('DashboardBussinessSettingsPage.TuesdayFormInput')}</option>
                            <option value="Wednesday">{t('DashboardBussinessSettingsPage.WednesdayFormInput')}</option>
                            <option value="Thursday">{t('DashboardBussinessSettingsPage.ThursdayFormInput')}</option>
                            <option value="Friday">{t('DashboardBussinessSettingsPage.FridayFormInput')}</option>
                            <option value="Saturday">{t('DashboardBussinessSettingsPage.SaturdayFormInput')}</option>
                        </select>
                    </div>
                    <div className="mt-2 profileFormInputItem">
                        <label>{t('DashboardBussinessSettingsPage.openingTimeFormInput')}</label>
                        <input
                            className="form-control signUpInput mt-2"
                            name="opening_time"
                            value={day?.opening_time || ""}
                            type="time"
                            onChange={(e) =>
                                handleInputChange(index, 'opening_time', e.target.value)
                            }
                        />
                    </div>
                    <div className="mt-2 profileFormInputItem">
                        <label>{t('DashboardBussinessSettingsPage.closingTimeFormInput')}</label>
                        <input
                            className="form-control signUpInput mt-2"
                            name="closing_time"
                            value={day?.closing_time || ""}
                            type="time" 
                            onChange={(e) =>
                                handleInputChange(index, 'closing_time', e.target.value)
                            }
                        />
                    </div>
                    <div className="profileFormInputItem text-center mt-4">
                        <button onClick={() => handleDeleteWorkingHour(index)} type='button' className='deleteBtn'>
                            {t('DashboardBussinessSettingsPage.deleteActivityBtn')} <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            ))}
            <div className="formActions">
                <button type="button" className="btn btn-secondary mt-3" onClick={handleAddWorkingHour}>
                    {t('DashboardBussinessSettingsPage.addMoreWorkingHoursBtn')}
                </button>
                <button type="submit" className="updateBtn mt-3">
                    {t('DashboardBussinessSettingsPage.submitChangesBtn')}
                </button>
            </div>
        </form>
    )
}
