import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../myLoaderSec/MyLoader';
import { useLatestPackageStore } from '../../store/LatestCompanyPackageStore';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';

export default function MyPackagesSettings({ token }) {
    const loginType = localStorage.getItem('loginType');
    const cookiesData = Cookies.get("currentLoginedData");
    const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;
    const navigate = useNavigate();
    const {
        loading,
        companyPackageStatus,
        packages,
        message,
        unAuth,
        fetchLatestCompanyPackage,
    } = useLatestPackageStore();

    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [actionType, setActionType] = useState('upgrade');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeRole, setActiveRole] = useState('package details')
    useEffect(() => {
        fetchLatestCompanyPackage(loginType);
    }, [loginType, fetchLatestCompanyPackage]);
    console.log(packages);
    
    const handleSubmit = async () => {
        if (!selectedPackageId && actionType !== 'renew') {
            alert('Please select a package before proceeding.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${baseURL}/${loginType}/control-packages`,
                {
                    type: actionType,
                    package: actionType === 'renew' ? null : selectedPackageId,
                    payment_type: 'offline',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                alert('Changes submitted successfully!');
            } else {
                throw new Error(response.data?.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting changes:', error);
            alert(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="dashboard__handler d-flex">
                    <MyNewSidebarDash />
                    <div className="main__content container">
                        <MainContentHeader
                            currentUserLogin={currentUserLogin}
                        />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className="content__view__handler">
                                <ContentViewHeader title="Packages Settings" />
                                <div className="col-12 mb-4">
                                                <div className="my__roles__actions mt-4">
                                                    <button
                                                        className={`def__btn ${activeRole === "package details" ? "rolesActiveBtn" : ""}`}
                                                        onClick={() => setActiveRole("package details")}
                                                    >
                                                        package details
                                                    </button>
                                                    <button
                                                        className={`cust__btn ${activeRole === "transactions" ? "rolesActiveBtn" : ""}`}
                                                        onClick={() => setActiveRole("transactions")}
                                                    >
                                                        transactions
                                                    </button>
                                                    <button
                                                        className={`cust__btn ${activeRole === "payment methods" ? "rolesActiveBtn" : ""}`}
                                                        onClick={() => setActiveRole("payment methods")}
                                                    >
                                                        payment methods
                                                    </button>
                                                </div>
                                </div>
                                { activeRole === 'package details' &&
                                    <div className="content__card__list ms-4">
                                       <h1 className='mb-3 fs-4'>
                                       current package: premuim
                                       </h1>
                                    {packages.map((pkg) => (
                                        <div key={pkg.id} className="package-card">
                                            <h5>{pkg.name}</h5>
                                            <p>Price: {pkg.price}</p>
                                            <p>Discount Price: {pkg.discount_price}</p>
                                            <ul>
                                                {Object.entries(pkg.data).map(([key, value]) => (
                                                    <li key={key}>
                                                        {key.replace(/_/g, ' ')}: {value}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    // Handle package upgrade/renew logic here
                                                }}
                                            >
                                                Upgrade or Renew
                                            </button>
                                        </div>
                                    ))}
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
