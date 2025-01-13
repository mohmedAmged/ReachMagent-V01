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
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';

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
    console.log(companyPackageStatus);

    const handleSelectPackage = (id) => {
            setSelectedPackageId(id); // Update the selected package ID
    };

    const handleSubmit = async () => {
        if (!selectedPackageId && actionType !== 'renew') {
             toast.error('Please select a package before proceeding.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${baseURL}/${loginType}/control-packages`,
                {
                    type: actionType,
                    package: actionType === 'renew' ? null : selectedPackageId?.toString(),
                    payment_type: 'offline',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                toast.success('Changes submitted successfully!');
                fetchLatestCompanyPackage(loginType);
                scrollToTop();
            } else {
                throw new Error(response.data?.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting changes:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
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
                                <div className="row">
                                    <div className="col-12 ">
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
                                </div>
                                {activeRole === 'package details' &&
                                    <div className="content__card__list ms-4">
                                        { packages?.length !== 0 ?
                                            <div className='row business-signUp__packages'>
                                            {packages.map((pack) => (
                                                <div
                                                    className={`col-lg-5 col-md-5 col-sm-10 m-auto p-4`}
                                                    key={pack.id}
                                                >
                                                    <div
                                                        className={`packageCard ${
                                                            selectedPackageId === pack.id
                                                                ? 'selectedPackage'
                                                                : 'notSelectedPackage'
                                                        }`}
                                                    >
                                                        <h5>{pack.name}</h5>
                                                        <p className='price'>{pack.price}</p>
                                                        {pack.discountPrice && (
                                                            <p className='discount-price'>
                                                                Discount Price: {pack.discountPrice}
                                                            </p>
                                                        )}
                                                        <ul>
                                                            {Object.entries(pack?.data)?.map(([key, value]) => (
                                                                <li key={key}>
                                                                    <span>
                                                                        <i className='bi bi-check-lg'></i>
                                                                    </span>
                                                                    {key.replace(/_/g, ' ')}: {value}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div
                                                            onClick={() => handleSelectPackage(pack.id)}
                                                            className={`text-center d-flex justify-content-center packageBtn ${
                                                                selectedPackageId === pack.id
                                                                    ? 'selectedPackageBtn'
                                                                    : 'notSelectedPackageBtn'
                                                            }`}
                                                        >
                                                            {selectedPackageId === pack.id ? 'Selected' : 'Select'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            </div>
                                            :
                                            <h3 className='text-danger'>
                                                {message}
                                            </h3>
                                        }
                                       { (packages?.length !== 0 || companyPackageStatus?.length !== 0) &&
                                        <div className="action-selector mt-4">
                                            <h4>Choose Action</h4>
                                            <select
                                                value={actionType}
                                                onChange={(e) => setActionType(e.target.value)}
                                                className="form-select"
                                            >
                                                {
                                                    companyPackageStatus?.map((status) =>(
                                                        <option value={status} key={status}>
                                                            {status}
                                                        </option>
                                                    ))
                                                }
                                                {/* <option value="upgrade">Upgrade</option>
                                                <option value="renew">Renew</option>
                                                <option value="subscribe">Subscribe</option> */}
                                            </select>
                                        </div>
                                        }
                                       { (packages?.length !== 0 || companyPackageStatus?.length !== 0) &&
                                        <button
                                            className="btn btn-primary mt-4"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Changes'}
                                        </button>
                                        }
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
