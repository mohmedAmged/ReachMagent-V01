import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL } from "../../functions/baseUrl";
import toast from "react-hot-toast";
import { Lang } from "../../functions/Token";
import { useTranslation } from "react-i18next";

export default function CompanyAddNewIndustry({ token, setUnAuth }) {
      const { t } = useTranslation();
    const [allIndustries, setAllIndustries] = useState([]);
    // const [selectedIndustries, setSelectedIndustries] = useState([{ industry_id: '', sub_industry_id: '' }]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [isEditing, setIsEditing] = useState(false);


    const fetchAllIndustries = async () => {
        try {
            const response = await axios.get(`${baseURL}/industries?t=${new Date().getTime()}`, {
                headers: { "Locale": Lang }
            });
            setAllIndustries(response?.data?.data?.industries || []);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };
    const fetchCurrentIndustries = async () => {
        try {
            const response = await axios.get(`${baseURL}/employee/show-company?t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}`, "Locale": Lang }
            });
            const companyIndustries = response?.data?.data?.companyIndustries || [];
            setSelectedIndustries(companyIndustries?.map(ind => ({
                industry_id: ind?.industryId,
                sub_industry_id: ind?.subIndustryId
            })));
        } catch (error) {
            toast.error(error?.response?.data.message || 'Failed to load current industries');
        }
    };
    useEffect(() => {
        fetchAllIndustries();
        fetchCurrentIndustries();
    }, []);

     const handleIndustryChange = (index, industryId) => {
        const industry = allIndustries.find((indus) => indus.id === Number(industryId));
        const subIndustries = industry ? industry.sub_industries : [];

        const updatedSelections = [...selectedIndustries];
        updatedSelections[index] = {
            industry_id: industryId,
            sub_industry_id: subIndustries.length > 0 ? subIndustries[0].id : ''
        };
        setSelectedIndustries(updatedSelections);
    };

    const handleSubIndustryChange = (index, subIndustryId) => {
        const updatedSelections = [...selectedIndustries];
        updatedSelections[index].sub_industry_id = subIndustryId;
        setSelectedIndustries(updatedSelections);
    };

    const handleAddMore = () => {
        setSelectedIndustries([...selectedIndustries, { industry_id: '', sub_industry_id: '' }]);
    };

    const handleRemoveIndustry = (index) => {
        setSelectedIndustries(selectedIndustries.filter((_, i) => i !== index));
    };

    const handleConfirmChanges = async () => {
        const validSelections = selectedIndustries.filter(
            (entry) => entry.industry_id && entry.sub_industry_id
        );

        if (validSelections.length === 0) {
            toast.error('Please select at least one industry and sub-industry.');
            return;
        }
        const formData = new FormData();
        validSelections.forEach((entry) => {
            formData.append('industry_id[]', entry.industry_id);
            formData.append('sub_industry_id[]', entry.sub_industry_id);
        });
          console.log('Submitting:', [...formData.entries()]);
        try {
            const response = await axios.post(
                `${baseURL}/employee/update-company-industires`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response?.data?.message || 'Industries updated successfully');
            setIsEditing(false);
            fetchCurrentIndustries();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to update industries');
        }
    };

    return (
        <form className="profileForm__handler my-4">
            <div className="mt-2 profileFormInputItem w-100 pe-4 ms-2">
                <label>{t('DashboardBussinessSettingsPage.selectIndusAndSubFormInput')}</label>

                {selectedIndustries.map((selection, index) => (
                    <div key={index} className="d-flex gap-3 my-2">
                        {isEditing ? (
                            <>
                                <select
                                    value={selection.industry_id}
                                    onChange={(e) => handleIndustryChange(index, e.target.value)}
                                    className={`form-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                >
                                    <option value="">{t('DashboardProileSettingsPage.selectIndusFormInputPlaceholder')}</option>
                                    {allIndustries.map(indus => (
                                        <option key={indus.id} value={indus.id}>{indus.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={selection.sub_industry_id}
                                    onChange={(e) => handleSubIndustryChange(index, e.target.value)}
                                    className={`form-select ${Lang === 'ar' ? 'formSelect_RTL' : ''}`}
                                    disabled={!selection.industry_id}
                                >
                                    <option value="">{t('DashboardProileSettingsPage.selectSubIndusFormInputPlaceholder')}</option>
                                    {allIndustries.find(indus => indus.id === Number(selection.industry_id))?.sub_industries.map(subIndus => (
                                        <option key={subIndus.id} value={subIndus.id}>{subIndus.name}</option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveIndustry(index)}
                                    className="btn btn-danger"
                                >
                                    {t('DashboardBussinessSettingsPage.deleteActivityBtn')}
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={
                                        allIndustries.find(indus => indus.id === Number(selection.industry_id))?.name || ''
                                    }
                                    className="form-control"
                                    disabled
                                />
                                <input
                                    type="text"
                                    value={
                                        allIndustries.find(indus => indus.id === Number(selection.industry_id))?.sub_industries.find(sub => sub.id === Number(selection?.sub_industry_id))?.name || ''
                                    }
                                    className="form-control"
                                    disabled
                                />
                            </>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <button type="button" onClick={handleAddMore} className="btn btn-outline-primary mt-2">
                        {t('DashboardBussinessSettingsPage.addMoreIndustriesBtn')}
                    </button>
                )}

                <div className="text-center mt-4">
                    {isEditing ? (
                        <button type="button" onClick={handleConfirmChanges} className="btn btn-success">
                            {t('DashboardProileSettingsPage.confirmBtnFormInput')}
                        </button>
                    ) : (
                        <button type="button" onClick={() => setIsEditing(true)} className="btn btn-primary">
                            {t('DashboardProileSettingsPage.updateBtnFormInput')}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
