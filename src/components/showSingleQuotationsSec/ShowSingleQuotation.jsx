import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import ShowLocationOnMap from '../showLocationOnMapSec/ShowLocationOnMap';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import './showSinglequotation.css';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';

export default function ShowSingleQuotation({ token }) {
    const { t } = useTranslation();
    const loginType = localStorage.getItem('loginType');
    const { quotationsId } = useParams();
    const [fullData, setFullData] = useState([]);
    const [newData, setNewdata] = useState([]);
    const [acceptedSingleQuotations, setAcceptedSingleQuotations] = useState([]);

    const [submitionData, setSubmitionData] = useState({
        quotation_id: quotationsId,
        services: '',
        shipping_price: '',
        offer_validaty: '',
    });
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingValue, setShippingValue] = useState(0);
    const [servicesValue, setServicesValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const isOneClickQuotation = location.pathname.includes('companyoneclick');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const [updatedData, setUpdatedData] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const fetchShowQuotations = async () => {
        if (!isOneClickQuotation) {
            const slug = loginType === 'user' ? `${loginType}/show-single-quotation`
                :
                `${loginType}/show-quotation`
            try {
                const response = await axios.get(`${baseURL}/${slug}/${quotationsId}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                });
                setNewdata(response?.data?.data?.quotation);
                setAcceptedSingleQuotations(response?.data?.data?.quotation?.quotation_details);
            } catch (error) {
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data.message || 'Something Went Wrong!');
            };
        } else {
            const slug = `${loginType}/show-one-click-quotation`
            try {
                const response = await axios.get(`${baseURL}/${slug}/${quotationsId}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Locale": Lang
                    }
                });
                setFullData(response?.data?.data?.one_click_quotation);
                setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation[0]);
                setAcceptedSingleQuotations(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation[0]?.negotiate_one_click_quotation_details);
            } catch (error) {
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data.message || 'Something Went Wrong!');
            };
        };
    };

    useEffect(() => {
        fetchShowQuotations();
    }, [loginType, token]);

    useEffect(() => {
        setTotalPrice(+submitionData?.total_price + +shippingValue + +servicesValue);
    }, [submitionData?.total_price, shippingValue, servicesValue]);

    const handleChangeInput = (event) => {
        setSubmitionData({ ...submitionData, [event?.target?.name]: `${event?.target?.value}` });
        if (event.target.name === 'shipping_price') {
            setShippingValue(event?.target?.value);
        } else if (event.target.name === 'services') {
            setServicesValue(event.target.value);
        };
    };

    const handleRejectAllQuotation = () => {
        const toastId = toast.loading('Loading...');
        const submitData = {};
        let slug = undefined;
        if (!isOneClickQuotation) {
            if (loginType === 'user') {
                submitData.quotation_id = quotationsId;
                submitData.status = 'rejected'
                slug = 'update-quotation-status';
            } else {
                submitData.quotation_id = quotationsId;
                slug = 'reject-sell-quotation';
            }
        } else {
            submitData.negotiate_one_click_quotation_id = `${newData?.id}`;
            slug = 'reject-sell-negotiation-quotation';
        };
        (async () => {
            await axios.post(`${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`,
                submitData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (isOneClickQuotation) {
                        navigate('/profile/oneclick-quotations');
                    } else {
                        navigate('/profile/quotations');
                    };
                    toast.success(response?.data?.message || 'Quotation Rejected!', {
                        id: toastId,
                        duration: 1000,
                    });
                })
                .catch(error => {
                    if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                        setUnAuth(true);
                    };
                    toast.error(
                        error?.response?.data?.message ||
                        'Error', {
                        id: toastId,
                        duration: 1000
                    });
                });
        })();
    };

    useEffect(() => {
        const arrOfAcceptedPrices = acceptedSingleQuotations?.map(el => el?.status === 'Accepted' ? +el?.total_price : 0);
        setSubTotalPrice(arrOfAcceptedPrices?.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
    }, [acceptedSingleQuotations, updatedData]);

    useEffect(() => {
        setTotalPrice(+subTotalPrice + +shippingValue + +servicesValue);
    }, [subTotalPrice, shippingValue, servicesValue]);

    const [extraOptions, setExtraOptions] = useState({
        can_achieve_target_budget: '',
        can_achieve_preferred_delivery_terms: '',
        can_achieve_target_delivery_time: '',
    });

    const handleAcceptQuotation = () => {
        const toastId = toast.loading('Loading...');
        let submitData = {};
        let slug = undefined;
        if (!isOneClickQuotation) {
            if (loginType === 'user') {
                slug = 'update-quotation-status';
                submitData = submitionData;
                submitData.status = 'accepted'
                submitData.company_notes = replyText
            } else {
                slug = 'complete-quotation-data';
                submitData = submitionData;
                submitData.company_notes = replyText;
                submitData.extras_note = extrasNoteInput;
            }
        } else {
            slug = 'complete-negotiation-quotation-data';
            submitData.negotiate_one_click_quotation_id = `${newData?.id}`;
            submitData.shipping_price = shippingValue;
            submitData.services = servicesValue;
            submitData.offer_validaty = submitionData.offer_validaty;
            submitData.company_notes = replyText;
            submitData.extras_note = extrasNoteInput;
            if (extraOptions.can_achieve_target_budget) {
                submitData.can_achieve_target_budget = extraOptions?.can_achieve_target_budget;
            }
            if (extraOptions.can_achieve_preferred_delivery_terms) {
                submitData.can_achieve_preferred_delivery_terms = extraOptions?.can_achieve_preferred_delivery_terms;
            }
            if (extraOptions.can_achieve_target_delivery_time) {
                submitData.can_achieve_target_delivery_time = extraOptions?.can_achieve_target_delivery_time;
            }
        };
        (async () => {
            await axios.post(`${baseURL}/${loginType}/${slug}?t=${new Date().getTime()}`,
                submitData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (isOneClickQuotation) {
                        navigate('/profile/oneclick-quotations');
                    } else {
                        navigate('/profile/quotations');
                    };
                    toast.success(response?.data?.message || 'Quotation Accepted!', {
                        id: toastId,
                        duration: 1000,
                    });
                })
                .catch((error) => {
                    if (error?.response?.data?.errors) {
                        // Extract and format validation errors
                        const validationErrors = Object.values(error.response.data.errors)
                            .flat()
                            .join('\n'); // Separate errors by newlines
                        toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>, {
                            id: toastId,
                            duration: 1000,
                        });
                    } else {
                        toast.error(
                            error?.response?.data?.message || 'Error!',
                            {
                                id: toastId,
                                duration: 1000,
                            }
                        );
                    }

                    if (
                        error?.response?.data?.message === 'Server Error' ||
                        error?.response?.data?.message === 'Unauthorized'
                    ) {
                        setUnAuth(true);
                    }
                });
        })();
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    useEffect(() => {
        if (!isOneClickQuotation) {
            if (updatedData?.length === 0) {
                const arrayOfData = acceptedSingleQuotations?.map(el => {
                    return {
                        quotation_detail_id: el?.id,
                        duration: el?.duration || 0,
                        offer_price: el?.offer_price === 'N/A' ? 0 : el?.offer_price ? el?.offer_price : 0,
                        tax: el?.tax === 'N/A' ? 0 : el?.tax ? el?.tax : 0,
                        status: ''
                    };
                });
                setUpdatedData(arrayOfData);
            }
        } else {
            if (updatedData?.length === 0) {
                const arrayOfData = acceptedSingleQuotations?.map(el => {
                    return {
                        negotiate_one_click_quotation_id: newData?.id,
                        negotiate_one_click_quotation_detail_id: el?.id,
                        duration: el?.duration === 'N/A' ? 0 : el?.duration,
                        item_price: el?.offer_price === 'N/A' ? 0 : el?.offer_price ? el?.offer_price : 0,
                        tax: el?.tax === 'N/A' ? 0 : el?.tax ? el?.tax : 0,
                        status: ''
                    };
                });
                setUpdatedData(arrayOfData);
            }
        };
    }, [acceptedSingleQuotations, isOneClickQuotation]);

    const handleChangeValuesInRow = (e, id) => {
        if (!isOneClickQuotation) {
            const currChangedObj = updatedData?.find(el => el?.quotation_detail_id === id);
            if (currChangedObj) {
                if (e.target.name === 'tax' && +e.target.value >= 100) {
                    setUpdatedData(updatedData?.map(el => el?.quotation_detail_id === id ? { ...el, [e.target.name]: 100 } : el));
                } else if (e.target.name === 'tax' && +e.target.value <= 0) {
                    setUpdatedData(updatedData?.map(el => el?.quotation_detail_id === id ? { ...el, [e.target.name]: 0 } : el));
                } else {
                    setUpdatedData(updatedData?.map(el => el?.quotation_detail_id === id ? { ...el, [e.target.name]: e.target.value } : el));
                };
            } else {
                setUpdatedData([...updatedData, { quotation_detail_id: id, [e.target.name]: e.target.value }]);
            };
        } else {
            const currChangedObj = updatedData?.find(el => el?.negotiate_one_click_quotation_detail_id === id);
            if (currChangedObj) {
                if (e.target.name === 'tax' && +e.target.value >= 100) {
                    setUpdatedData(updatedData?.map(el => el?.negotiate_one_click_quotation_detail_id === id ? { ...el, [e.target.name]: 100 } : el));
                } else if (e.target.name === 'tax' && +e.target.value <= 0) {
                    setUpdatedData(updatedData?.map(el => el?.negotiate_one_click_quotation_detail_id === id ? { ...el, [e.target.name]: 0 } : el));
                } else {
                    setUpdatedData(updatedData?.map(el => el?.negotiate_one_click_quotation_detail_id === id ? { ...el, [e.target.name]: e.target.value } : el));
                };
            } else {
                setUpdatedData([...updatedData, { negotiate_one_click_quotation_detail_id: id, [e.target.name]: e.target.value }]);
            };
        }
    };

    const handleChangeStatusSingleQuoteRow = async (type, id) => {
        const toastId = toast.loading('Loading...');
        if (!isOneClickQuotation) {
            const submitData = updatedData?.find(el => +el?.quotation_detail_id === +id);
            submitData.status = type;
            submitData.duration = +submitData.duration;
            submitData.quotation_detail_id = `${id}`;
            await axios.post(`${baseURL}/${loginType}/update-quotation-detail-status?t=${new Date().getTime()}`, submitData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    fetchShowQuotations();
                    toast.success(res?.data?.message || 'Rejected Successfully!', {
                        id: toastId,
                        duration: 1000
                    })
                })
                .catch(err => {
                    if (err?.response?.status === 422 && err?.response?.data?.errors) {
                        const validationErrors = Object.values(err.response.data.errors)
                            .flat()
                            .join(', ');
                        toast.error(validationErrors, {
                            id: toastId,
                            duration: 3000
                        });
                    } else {
                        toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
                            id: toastId,
                            duration: 1000
                        });
                    }
                });
            fetchShowQuotations()
        } else {
            const submitData = updatedData?.find(el => +el?.negotiate_one_click_quotation_detail_id === +id);
            submitData.status = type;
            submitData.duration = +submitData.duration;
            submitData.negotiate_one_click_quotation_detail_id = `${id}`;
            submitData.negotiate_one_click_quotation_id = `${submitData.negotiate_one_click_quotation_id}`;
            await axios.post(`${baseURL}/${loginType}/update-negotiation-quotation-detail-status?t=${new Date().getTime()}`, submitData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    fetchShowQuotations();
                    toast.success(res?.data?.message || 'Rejected Successfully!', {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(err => {
                    toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
                        id: toastId,
                        duration: 1000
                    });
                });
        }
    };

    const handleUpdateBuyQuotationCompanyStatus = async (type) => {
        const toastId = toast.loading('Loading...');
        const submitData = {
            quotation_id: quotationsId,
            status: type
        };
        await axios.post(`${baseURL}/${loginType}/update-buy-quotation-status?t=${new Date().getTime()}`, submitData, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                console.log(res?.data?.data);
                toast.success(res?.data?.message || `${type} successfully!`, {
                    id: toastId,
                    duration: 1000,
                });
            })
            .catch(err => {
                console.log(err?.response?.data?.message);
                toast.error(err?.response?.data?.message || `Something Went Wrong!`, {
                    id: toastId,
                    duration: 1000,
                });
            })
    };

    const [visibleRowId, setVisibleRowId] = useState(null);

    const toggleOptions = (rowId) => {
        setVisibleRowId(prevId => (prevId === rowId ? null : rowId));
    };
    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setVisibleRowId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [replyText, setReplyText] = useState('');

    const [show, setShow] = useState(false);
    const [currNote, setCurrNote] = useState('');
    const handleViewNotes = (id) => {
        const note = newData?.quotation_details?.find((row) => +row?.id === +id)?.note
        setShow(true);
        setCurrNote(note);
    };
    // const handleShow = () => setShow(true);

    const [showFiles, setShowFiles] = useState(false);
    const [currFile, setCurrFile] = useState([]);

    const handleViewFiles = (files) => {
        setCurrFile(files); // Set files for the selected row
        setShowFiles(true); // Open the modal
    };

    const [showOptions, setShowOptions] = useState(false);
    const [currOptions, setCurrOptions] = useState([]);

    const handleViewOptions = (options) => {
        setCurrOptions(options);
        setShowOptions(true);
    };

    // const handleCloseFiles = () => setShow(false);
    // const handleShowFiles = () => setShow(true);

    const [editExtrasNote, setEditExtrasNote] = useState(false);
    const [extrasNoteInput, setExtrasNoteInput] = useState(newData?.extras_note === 'N/A' ? '' : newData?.extras_note);

    // const handleExtrasNoteChange = () => {
    //     setEditExtrasNote(true);
    // };

    const startNewChat = async (receiverId, receiverType) => {
        try {
            const res = await axios.post(`${baseURL}/${loginType}/start-chat`, {
                'receiever_type': receiverType,
                'receiever_id': `${receiverId}`
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    t: new Date().getTime()
                },
            });
            console.log(res?.data?.data);
            // navigate(`/your-messages/${res?.data?.data?.chat?.id}`)
            Cookies.set('newChatId', res?.data?.data?.chat?.id)
            navigate(`/your-messages`)

        } catch (error) {
            console.log(error?.response?.data?.message || 'Failed to load messages');
        }
    };

    const handleNavigation = () => {
        if (newData?.chatId === null) {
            startNewChat(newData?.receiver_id, newData?.receiver_type);
        }
        else {
            Cookies.set('newChatId', newData?.chatId)
            navigate(`/your-messages`);

        }
    };

    console.log(newData)
console.log(acceptedSingleQuotations);

    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='dashboard__handler showSingleQuotation__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader search={false} currentUserLogin={currentUserLogin} />
                            {(
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={`${t('DashboardSingleQuotationPage.quotationTitle')}: ${newData?.code || fullData?.code} `} />
                                        <div className="quotationTable__content quotationTable__NewStyle">
                                            <Table responsive>
                                                <thead id='theadBg'>
                                                    <tr
                                                        className='table__default__header'>
                                                        <th>(##) {t('DashboardSingleQuotationPage.tableHeadItemTitle')} </th>
                                                        <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemMeasure')}</th>
                                                        <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemQTY')}</th>
                                                        <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemUnitPrice')}</th>
                                                        <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemTax')}(%)</th>
                                                        <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemPrice')}</th>
                                                        <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemDuration')}</th>
                                                        <th className='text-center'> {t('DashboardSingleQuotationPage.tableHeadItemStatus')}</th>
                                                        <th className='text-center'> {t('DashboardSingleQuotationPage.tableHeadItemNotes')}</th>
                                                        <th className='text-center'> {t('DashboardSingleQuotationPage.tableHeadItemFiles')}</th>
                                                        {
                                                            !isOneClickQuotation &&
                                                            <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemPreferences')}</th>
                                                        }
                                                        {
                                                            ((loginType === 'employee' && newData?.quotation_type === 'sell') || (isOneClickQuotation && fullData?.quotation_type === 'sell')) &&
                                                            <th className='text-center'>{t('DashboardSingleQuotationPage.tableHeadItemAction')}</th>
                                                        }
                                                    </tr>
                                                </thead>
            <tbody>
                {
                    acceptedSingleQuotations?.map((row, idx) => (
                        <>
                            <tr key={`${row?.id}${row?.title}`}>
                                <td className='text-capitalize'>
                                    <span className='me-2 indexOfTheTable'>{idx + 1}</span>
                                    <span title={`${row?.title}`} className=' cursorPointer'>
                                        {
                                            `${row?.code ?
                                                `(${row?.code})` :
                                                ''
                                            } ${row?.title} `
                                        }
                                    </span>
                                </td>
                                <td className='text-center text-capitalize'>
                                    {
                                        row?.unit_of_measure
                                            ? row?.unit_of_measure !== 'N/A'
                                                ? row?.unit_of_measure
                                                : ''
                                            : row?.type === 'service'
                                                ? `${t('DashboardSingleQuotationPage.tableBodyItemServicesItem')}`
                                                : `${t('DashboardSingleQuotationPage.tableBodyItemCustomizedProduct')}`
                                    }
                                </td>
                                <td className='text-center text-capitalize'>
                                    {row?.quantity !== 'N/A' ? +row?.quantity : 0}
                                </td>
                                <td className='text-center text-capitalize'>
                                    {
                                        !isOneClickQuotation ?
                                            <input
                                                type="number"
                                                className={`form-control m-auto ${(!isOneClickQuotation &&
                                                    (newData?.company_status === 'Pending' && loginType !== 'user' && newData?.quotation_type === 'sell'))}`}
                                                defaultValue={
                                                    (row?.offer_price !== 'N/A' ? (row?.offer_price ? +row?.offer_price : 0) : 0)
                                                }
                                                name={'offer_price'}
                                                min={1}
                                                minLength={1}
                                                onChange={(e) => handleChangeValuesInRow(e, row?.id)}
                                                disabled={(!isOneClickQuotation ? (newData?.company_status !== 'Pending' || loginType === 'user' || newData?.quotation_type !== 'sell') : !(fullData?.quotation_type === 'sell'))}
                                            />
                                            :
                                            <input
                                                type="number"
                                                className={`form-control w-100 m-auto ${(fullData?.quotation_type === 'sell' ? newData?.company_status === 'Pending' : false) ? 'bg-white' : ''}`}
                                                defaultValue={
                                                    (row?.offer_price !== 'N/A' ? (row?.offer_price ? +row?.offer_price : 0) : 0)
                                                }
                                                name={'item_price'}
                                                min={1}
                                                minLength={1}
                                                onChange={(e) => handleChangeValuesInRow(e, row?.id)}
                                                disabled={fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'}
                                            />
                                    }
                                </td>
                                <td className='text-center text-capitalize'>
                                    <input
                                        type="number"
                                        className={`form-control ${(!isOneClickQuotation ?
                                            (newData?.company_status === 'Pending' && loginType !== 'user' && newData?.quotation_type === 'sell')
                                            :
                                            (fullData?.quotation_type === 'sell' ? newData?.company_status === 'Pending' : false)) ? 'bg-white' : ''}`}
                                        defaultValue={row?.tax !== 'N/A' ? +row?.tax : 0}
                                        name='tax'
                                        onChange={(e) => handleChangeValuesInRow(e, row?.id)}
                                        disabled={(!isOneClickQuotation ?
                                            (newData?.company_status !== 'Pending' || loginType === 'user' || newData?.quotation_type !== 'sell')
                                            :
                                            (fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'))}
                                    />
                                </td>
                                <td className='text-center text-capitalize'>
                                    {newData?.currency_symbol} {!isOneClickQuotation ?
                                        ((row?.quantity * updatedData?.find(el => el?.quotation_detail_id === row?.id)?.offer_price)
                                            +
                                            (
                                                (row?.quantity * updatedData?.find(el => el?.quotation_detail_id === row?.id)?.offer_price
                                                    * (updatedData?.find(el => el?.quotation_detail_id === row?.id)?.tax / 100))
                                            ))
                                        || (row?.total_price !== 'N/A' ? (row?.total_price ? +row?.total_price : 0) : 0)
                                        :
                                        ((row?.quantity * updatedData?.find(el => el?.negotiate_one_click_quotation_detail_id === row?.id)?.item_price)
                                            +
                                            (
                                                (row?.quantity * updatedData?.find(el => el?.negotiate_one_click_quotation_detail_id === row?.id)?.item_price
                                                    * (updatedData?.find(el => el?.negotiate_one_click_quotation_detail_id === row?.id)?.tax / 100))
                                            ))
                                        || (row?.total_price !== 'N/A' ? (row?.total_price ? +row?.total_price : 0) : 0)
                                    }
                                </td>
                                <td className='text-center text-capitalize'>
                                    <input
                                        type="number"
                                        name={'duration'}
                                        defaultValue={row?.duration === 'N/A' ? 0 : row?.duration}
                                        disabled={(!isOneClickQuotation ?
                                            (newData?.company_status !== 'Pending' || loginType === 'user' || newData?.quotation_type !== 'sell')
                                            :
                                            (fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'))}
                                        onChange={(e) => handleChangeValuesInRow(e, row?.id)}
                                        className={`form-control m-auto ${(!isOneClickQuotation ?
                                            (newData?.company_status === 'Pending' && loginType !== 'user' && newData?.quotation_type === 'sell')
                                            :
                                            (fullData?.quotation_type === 'sell' ? newData?.company_status === 'Pending' : false)) ? 'bg-white' : ''}`} />
                                </td>
                                <td>
                                    <div className={` tableBtnSingleQuote`}>
                                        <p className={`order__statue ${row?.status}`}>
                                            {row?.status_translated}
                                        </p>
                                    </div>
                                </td>
                                <td className='text-center'>
                                    {
                                        row?.note !== 'N/A' ?
                                            <i onClick={() => handleViewNotes(row?.id)} className="bi bi-eye cursorPointer"></i>
                                            :
                                            `${t('DashboardSingleQuotationPage.tableBodyNoNotes')}`
                                    }
                                </td>
                                <Modal show={show} onHide={() => setShow(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{t('DashboardSingleQuotationPage.tableModalNotes')}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>{currNote}</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShow(false)}>
                                            {t('DashboardSingleQuotationPage.tableModalCloseBtn')}
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <td className='text-center'>
                                    {
                                        row?.type === "customized" || isOneClickQuotation ?
                                            <i onClick={() => handleViewFiles(row?.medias)}
                                                className="bi bi-box-arrow-up-right cursorPointer"
                                            >
                                            </i>
                                            :
                                            `${t('DashboardSingleQuotationPage.tableBodyNoFiles')}`
                                    }

                                </td>
                                {!isOneClickQuotation &&
                                    <td className='text-center'>
                                        {
                                            row?.type !== 'customized' ?
                                                <i onClick={() => handleViewOptions(row?.preferences)}
                                                    className="bi bi-sliders cursorPointer"></i>
                                                :
                                                `${t('DashboardSingleQuotationPage.tableBodyNoPreferences')}`
                                        }
                                    </td>
                                }
                                <Modal show={showOptions} onHide={() => setShowOptions(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{t('DashboardSingleQuotationPage.tableModalOptions')}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    >
                                        <>
                                            {
                                                currOptions?.map((opp) => (
                                                    <div className='d-flex gap-4 mb-3'>
                                                        <p className='text-capitalize'>
                                                            {opp?.attribute} : <span>{opp?.valiue}</span>
                                                        </p>
                                                        <p className='text-capitalize'>
                                                            {t('DashboardSingleQuotationPage.tableModalPrice')}: <span>${opp?.price}</span>
                                                        </p>
                                                    </div>

                                                ))
                                            }
                                        </>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowOptions(false)}>
                                            {t('DashboardSingleQuotationPage.tableModalCloseBtn')}
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={showFiles} onHide={() => setShowFiles(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{t('DashboardSingleQuotationPage.tableModalFiles')}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            height: 'calc(80vh - 250px)',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <div className="mediasModal__handler">
                                            {currFile && currFile.length > 0 ? (
                                                currFile.map((media, i) => (
                                                    <div key={i} className="media__handler">
                                                        <NavLink to={media.media} target="_blank">
                                                            {media.type === "image" ? (
                                                                <img
                                                                    src={media.media}
                                                                    alt="media"
                                                                    className="mb-3"
                                                                    style={{
                                                                        maxWidth: '200px',
                                                                        maxHeight: '200px',
                                                                        objectFit: 'contain',
                                                                        borderRadius: "8px",
                                                                    }}
                                                                />
                                                            ) : (
                                                                `${t('DashboardSingleQuotationPage.tableModalViewFile')}`
                                                            )}
                                                        </NavLink>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>{t('DashboardSingleQuotationPage.tableModalNoFiles')}</p>
                                            )}
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowFiles(false)}>
                                            {t('DashboardSingleQuotationPage.tableModalCloseBtn')}
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                {(!isOneClickQuotation ? (loginType === 'employee' && newData?.quotation_type === 'sell') : (fullData?.quotation_type === 'sell')) &&
                                    <td className='text-center text-capitalize p-0'>
                                        <div className="actions w-100 position-relative">
                                            <i style={{ cursor: 'pointer' }} className="bi bi-three-dots-vertical" onClick={() => toggleOptions(row?.id)}></i>
                                            {visibleRowId === row?.id && newData?.company_status === 'Pending' && (
                                                <div className="options-box" ref={optionsRef}>
                                                    <p className="option mb-1 text-danger" onClick={() => handleChangeStatusSingleQuoteRow('rejected', row?.id)}>{t('DashboardSingleQuotationPage.tableBodyRejectBtn')}</p>
                                                    <p className=" option mb-0 text-success" onClick={() => handleChangeStatusSingleQuoteRow('accepted', row?.id)}>{t('DashboardSingleQuotationPage.tableBodyAcceptBtn')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </td>}
                            </tr>
                        </>
                    ))
                }
            </tbody>
                                            </Table>
                                        </div>
                                        <div className="quoteTotals__handler">
                                            <h3>
                                                {t('DashboardSingleQuotationPage.quotesTotalsInfo')}
                                            </h3>
                                            <div className="row align-items-center">
                                                <div className="col-lg-6">
                                                    <div className="totals__full__info">
                                                        <div className="totals__text">
                                                            <h5 className='mb-4 '>
                                                                {t('DashboardSingleQuotationPage.subtotalInfo')} <span className="optional">({t('DashboardSingleQuotationPage.subtotalAcceptedOnly')})</span>
                                                            </h5>
                                                            {
                                                                newData?.tax !== 'N/A' &&
                                                                <h5 className='mb-4'>
                                                                    {t('DashboardSingleQuotationPage.totalTaxInfo')} <span className="optional">({t('DashboardSingleQuotationPage.subtotalAcceptedOnly')})</span>
                                                                </h5>
                                                            }
                                                            {
                                                                (newData?.include_shipping === 'Yes' || isOneClickQuotation) ?
                                                                    <h5 className='mb-4'>
                                                                        {t('DashboardSingleQuotationPage.shippingCostInfo')}
                                                                    </h5>
                                                                    :
                                                                    ''
                                                            }
                                                            <h5 className='mb-4'>
                                                                {t('DashboardSingleQuotationPage.extraInfo')}
                                                                <span className='optional'>
                                                                    {loginType === 'employee' ? (
                                                                        editExtrasNote ? (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    name='extras_note'
                                                                                    value={extrasNoteInput}
                                                                                    onChange={(e) => setExtrasNoteInput(e.target.value)}
                                                                                    className="form-control d-inline-block w-auto"
                                                                                />
                                                                                <i
                                                                                    className="bi bi-check-lg ms-2"
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() => setEditExtrasNote(false)}
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {newData?.extras_note === 'N/A' ? `${t('DashboardSingleQuotationPage.specifiedInNotesInfo')}` : newData?.extras_note}

                                                                            </>
                                                                        )
                                                                    ) : (
                                                                        <>
                                                                            {newData?.extras_note === 'N/A' ? `${t('DashboardSingleQuotationPage.specifiedInNotesInfo')}` : newData?.extras_note}
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </h5>
                                                            <h5>
                                                               {t('DashboardSingleQuotationPage.totalPriceInfo')}
                                                            </h5>
                                                        </div>
                                                        <div className="totals__prices">
                                                            <h5 className='mb-4 mt-2'>
                                                                {newData?.currency_symbol} {subTotalPrice}
                                                            </h5>
                                                            {
                                                                newData?.tax !== 'N/A' &&
                                                                <h5 className='mb-4 mt-2'>
                                                                    {newData?.currency_symbol} {newData?.tax}
                                                                </h5>
                                                            }
                                                            {
                                                                (newData?.include_shipping === 'Yes' || isOneClickQuotation) ?
                                                                    <h5 className='mb-3'>
                                                                        <input
                                                                            defaultValue={newData?.shipping_price === 'N/A' ? 0 : newData?.shipping_price}
                                                                            name='shipping_price'
                                                                            type="number"
                                                                            id='quotationShippingPrice'
                                                                            className='form-control w-50'
                                                                            maxLength={4}
                                                                            disabled={
                                                                                !isOneClickQuotation ?
                                                                                    loginType === 'user' || newData?.company_status !== 'Pending' || newData?.quotation_type !== 'sell'
                                                                                    :
                                                                                    fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'
                                                                            }
                                                                            onChange={handleChangeInput}
                                                                        />
                                                                    </h5>
                                                                    :
                                                                    ''
                                                            }
                                                            <h5 className='mb-4'>
                                                                <input
                                                                    defaultValue={newData?.services === 'N/A' ? 0 : newData?.services}
                                                                    name='services'
                                                                    type="number"
                                                                    id='quotationservicesPrice'
                                                                    className='form-control w-50'
                                                                    min={0}
                                                                    maxLength={4}
                                                                    disabled={
                                                                        !isOneClickQuotation ?
                                                                            loginType === 'user' || newData?.company_status !== 'Pending' || newData?.quotation_type !== 'sell'
                                                                            :
                                                                            fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'
                                                                    }
                                                                    onChange={handleChangeInput}
                                                                />
                                                            </h5>

                                                            <h5 className='mt-3'>
                                                                {newData?.currency_symbol} {(newData?.total_price !== 'N/A' && newData?.total_price) || totalPrice || 0}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 adjustPositione">
                                                    <div className="totals__have__problem">
                                                        <h3>
                                                            {t('DashboardSingleQuotationPage.havingProblemTextInfo')}
                                                        </h3>
                                                        <button onClick={handleNavigation} className='updateBtn'>
                                                            <i className="bi bi-wechat fs-4 me-2"></i>
                                                            <span>
                                                                {t('DashboardSingleQuotationPage.chatNowTextInfo')}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="quoteTotals__handler">
                                            <h3 className='text-capitalize'>
                                                {t('DashboardSingleQuotationPage.offerValidatyTextInfo')}
                                            </h3>
                                            <div className="row align-items-center">
                                                <div className="col-lg-6">
                                                    <div className="totals__full__info">
                                                        <div className="totals__text">
                                                            <h5 className=''>
                                                                {t('DashboardSingleQuotationPage.offerValidForTextInfo')}<span className="optional">{t('DashboardSingleQuotationPage.DaysTextInfo')}</span>
                                                            </h5>
                                                        </div>
                                                        <div className="totals__prices">
                                                            <h5 className=''>
                                                                <input
                                                                    defaultValue={
                                                                        !isOneClickQuotation ?
                                                                            newData?.offer_validaty !== 'N/A' ? newData?.offer_validaty ? newData?.offer_validaty
                                                                                :
                                                                                fullData?.offer_validaty : fullData?.offer_validaty === 'N/A' ? 0 : fullData?.offer_validaty
                                                                            :
                                                                            0
                                                                    }
                                                                    name='offer_validaty'
                                                                    type="number"
                                                                    id='quotationservicesPrice'
                                                                    className='form-control w-50'
                                                                    min={0}
                                                                    maxLength={4}
                                                                    disabled={
                                                                        !isOneClickQuotation ?
                                                                            loginType === 'user' || newData?.company_status !== 'Pending' || newData?.quotation_type !== 'sell'
                                                                            :
                                                                            fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'
                                                                    }
                                                                    onChange={handleChangeInput}
                                                                />
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
    {
    isOneClickQuotation &&
    <div className="quoteTotals__handler">
        <h3 className='text-capitalize'>
            {t('DashboardSingleQuotationPage.targetedInfoText')}
        </h3>
        <div className="row align-items-center">
            <div className="col-lg-12">
                <div className="totals__full__info">
                    <div className="totals__text">
                        <h5 className=''>
                            {t('DashboardSingleQuotationPage.targetedBudgetText')}
                        </h5>
                    </div>
                    <div className="totals__prices">
                        <h5 className=''>
                            <input
                                Value={
                                    fullData?.target_budget
                                }
                                name='target_budget'
                                type="number"
                                id='quotationstarget_budget'
                                className='form-control text-center'
                                // min={0}
                                // maxLength={4}
                                disabled
                            // onChange={handleChangeInput}
                            />
                        </h5>
                    </div>
                    {
                        newData?.company_status === 'Pending' ?
                            <div className="actions w-100 position-relative d-flex gap-5">
                                <div className="d-flex gap-2 align-items-center">
                                    <label htmlFor="can_achieve_target_budget_true">Yes</label>
                                    <input
                                        type="radio"
                                        name="can_achieve_target_budget"
                                        id="can_achieve_target_budget_true"
                                        value="yes"
                                        onChange={(e) => setExtraOptions({ ...extraOptions, [e?.target?.name]: e?.target?.value })}
                                    />
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <label htmlFor="can_achieve_target_budget_false">{t('DashboardSingleQuotationPage.targetedInfoTextNo')}</label>
                                    <input
                                        type="radio"
                                        name="can_achieve_target_budget"
                                        id="can_achieve_target_budget_false"
                                        onChange={(e) => setExtraOptions({ ...extraOptions, [e?.target?.name]: e?.target?.value })}
                                        value="no"
                                    />
                                </div>
                            </div>
                            :
                            <div className='actions w-100 position-relative d-flex gap-5'>
                                {
                                    newData?.can_achieve_target_budget === 'Yes' ?
                                        <div className="d-flex gap-2 align-items-center">
                                            <label htmlFor="can_achieve_target_budget_true">{t('DashboardSingleQuotationPage.targetedInfoTextYes')}</label>
                                            <input
                                                type="radio"
                                                id="can_achieve_target_budget_true"
                                                name="can_achieve_target_budget"
                                                value="Yes"
                                                checked={newData?.can_achieve_target_budget === 'Yes'}
                                                disabled
                                            />
                                        </div>
                                        :
                                        <div className="d-flex gap-2 align-items-center">
                                            <label htmlFor="can_achieve_target_budget_false">{t('DashboardSingleQuotationPage.targetedInfoTextNo')}</label>
                                            <input
                                                type="radio"
                                                id="can_achieve_target_budget_false"
                                                name="can_achieve_target_budget"
                                                value="No"
                                                checked={newData?.can_achieve_target_budget === 'No'}
                                                disabled
                                            />
                                        </div>
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
        <div className="row align-items-center">
            <div className="col-lg-12">
                <div className="totals__full__info">
                    <div className="totals__text">
                        <h5 className=''>
                            {t('DashboardSingleQuotationPage.targetedDeliveryText')}
                        </h5>
                    </div>
                    <div className="totals__prices">
                        <h5 className=''>
                            <input
                                Value={
                                    fullData?.target_delivery_time
                                }
                                name='target_delivery_time'
                                type="text"
                                id='quotationtarget_delivery_time'
                                className='form-control text-center'
                                // min={0}
                                // maxLength={4}
                                disabled
                            // onChange={handleChangeInput}
                            />
                        </h5>
                    </div>
                    {
                        newData?.company_status === 'Pending' ?
                            <div className="actions w-100 position-relative d-flex gap-5">
                                <div className="d-flex gap-2 align-items-center">
                                    <label htmlFor="can_achieve_target_delivery_time_true">{t('DashboardSingleQuotationPage.targetedInfoTextYes')}</label>
                                    <input
                                        type="radio"
                                        name="can_achieve_target_delivery_time"
                                        id="can_achieve_target_delivery_time_true"
                                        value="yes"
                                        onChange={(e) => setExtraOptions({ ...extraOptions, [e?.target?.name]: e?.target?.value })}
                                    />
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <label htmlFor="can_achieve_target_delivery_time_false">{t('DashboardSingleQuotationPage.targetedInfoTextNo')}</label>
                                    <input
                                        type="radio"
                                        name="can_achieve_target_delivery_time"
                                        id="can_achieve_target_delivery_time_false"
                                        onChange={(e) => setExtraOptions({ ...extraOptions, [e?.target?.name]: e?.target?.value })}
                                        value="no"
                                    />
                                </div>
                            </div>
                            :
                            <div className='actions w-100 position-relative d-flex gap-5'>
                                {
                                    newData?.can_achieve_target_delivery_time === 'Yes' ?
                                        <div className="d-flex gap-2 align-items-center">
                                            <label htmlFor="can_achieve_target_delivery_time_true">{t('DashboardSingleQuotationPage.targetedInfoTextYes')}</label>
                                            <input
                                                type="radio"
                                                id="can_achieve_target_delivery_time_true"
                                                name="can_achieve_target_delivery_time"
                                                value="Yes"
                                                checked={newData?.can_achieve_target_delivery_time === 'Yes'}
                                                disabled
                                            />
                                        </div>
                                        :
                                        <div className="d-flex gap-2 align-items-center">
                                            <label htmlFor="can_achieve_target_delivery_time_false">{t('DashboardSingleQuotationPage.targetedInfoTextNo')}</label>
                                            <input
                                                type="radio"
                                                id="can_achieve_target_delivery_time_false"
                                                name="can_achieve_target_delivery_time"
                                                value="No"
                                                checked={newData?.can_achieve_target_delivery_time === 'No'}
                                                disabled
                                            />
                                        </div>
                                }
                            </div>
                    }

                </div>
            </div>
        </div>
        <div className="row align-items-center">
            <div className="col-lg-12">
                <div className="totals__full__info">
                    <div className="totals__text">
                        <h5 className=''>
                            {t('DashboardSingleQuotationPage.preferredDeliveryTermsText')}
                        </h5>
                    </div>
                    <div className="totals__prices">
                        <h5 className=''>
                            <textarea
                                Value={
                                    fullData?.preferred_delivery_terms
                                }
                                defaultValue={fullData?.preferred_delivery_terms}
                                name='preferred_delivery_terms'
                                id='quotationpreferred_delivery_terms'
                                className='form-control text-center'
                                // min={0}
                                // maxLength={4}
                                disabled
                            // onChange={handleChangeInput}
                            />
                        </h5>
                    </div>
                    {
                        newData?.company_status === 'Pending' ?
                            <div className="actions w-100 position-relative d-flex gap-5">
                                <div className="d-flex gap-2 align-items-center">
                                    <label htmlFor="can_achieve_preferred_delivery_terms_true">{t('DashboardSingleQuotationPage.targetedInfoTextYes')}</label>
                                    <input
                                        type="radio"
                                        name="can_achieve_preferred_delivery_terms"
                                        id="can_achieve_preferred_delivery_terms_true"
                                        value="yes"
                                        onChange={(e) => setExtraOptions({ ...extraOptions, [e?.target?.name]: e?.target?.value })}
                                    />
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <label htmlFor="can_achieve_preferred_delivery_terms_false">{t('DashboardSingleQuotationPage.targetedInfoTextNo')}</label>
                                    <input
                                        type="radio"
                                        name="can_achieve_preferred_delivery_terms"
                                        id="can_achieve_preferred_delivery_terms_false"
                                        onChange={(e) => setExtraOptions({ ...extraOptions, [e?.target?.name]: e?.target?.value })}
                                        value="no"
                                    />
                                </div>
                            </div>
                            :
                            <div className='actions w-100 position-relative d-flex gap-5'>
                                {
                                    newData?.can_achieve_preferred_delivery_terms === 'Yes' ?
                                        <div className="d-flex gap-2 align-items-center">
                                            <label htmlFor="can_achieve_preferred_delivery_terms_true">{t('DashboardSingleQuotationPage.targetedInfoTextYes')}</label>
                                            <input
                                                type="radio"
                                                id="can_achieve_preferred_delivery_terms_true"
                                                name="can_achieve_preferred_delivery_terms"
                                                value="Yes"
                                                checked={newData?.can_achieve_preferred_delivery_terms === 'Yes'}
                                                disabled
                                            />
                                        </div>
                                        :
                                        <div className="d-flex gap-2 align-items-center">
                                            <label htmlFor="can_achieve_preferred_delivery_terms_false">{t('DashboardSingleQuotationPage.targetedInfoTextNo')}</label>
                                            <input
                                                type="radio"
                                                id="can_achieve_preferred_delivery_terms_false"
                                                name="can_achieve_preferred_delivery_terms"
                                                value="No"
                                                checked={newData?.can_achieve_preferred_delivery_terms === 'No'}
                                                disabled
                                            />
                                        </div>
                                }
                            </div>
                    }

                </div>
            </div>
        </div>
    </div>
    }

                                        <div className="quoteTotals__handler mt-5">
                                            <h3>
                                                {t('DashboardSingleQuotationPage.notesOnQuoteText')}
                                            </h3>
                                            <div className="row align-items-center">
                                                <div className="col-lg-12 allQuote__notes__handler">
                                                    <div className="allQuote__notes">
                                                        <i className="bi bi-envelope-exclamation"></i>
                                                        <p className='text-capitalize'>
                                                           {t('DashboardSingleQuotationPage.requesterNotesText')} :
                                                        </p>
                                                        <p className='user_note'>
                                                            {!isOneClickQuotation ?
                                                                newData?.user_notes === 'N/A' ? 'No Notes' : newData?.user_notes
                                                                :
                                                                fullData?.user_notes === 'N/A' ? 'No Notes' : fullData?.user_notes
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="replayBackForNote" >
                                                        <i className="bi bi-envelope-paper"></i>
                                                        <p>
                                                            {t('DashboardSingleQuotationPage.noteFromSellerText')} :
                                                        </p>
                                                        <div className="replayDynamicly_handler">
                                                            <div className="replyTextarea">
                                                                <textarea
                                                                    // rows="4"
                                                                    className="form-control"
                                                                    defaultValue={newData?.company_notes !== 'N/A' ? newData?.company_notes ? newData?.company_notes : fullData?.company_notes !== 'N/A' ? fullData?.company_notes ? fullData?.company_notes : '' : '' : ''}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    disabled={
                                                                        !isOneClickQuotation ?
                                                                            loginType === 'user' || newData?.company_status !== 'Pending' || newData?.quotation_type !== 'sell'
                                                                            :
                                                                            fullData?.quotation_type === 'sell' ? newData?.company_status !== 'Pending' : newData?.company_status === 'Pending'
                                                                    }
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                        <div className="requesterDetails__handler">
                                            {
                                                (loginType === 'employee' && newData?.quotation_type === 'sell') &&
                                                <h3>
                                                    {t('DashboardSingleQuotationPage.requesterDetailsText')}
                                                </h3>
                                            }
                                            <div className="row">
                                                {
                                                    (loginType === 'employee' && newData?.quotation_type === 'sell') &&
                                                    <div className="col-lg-12 requesterDetails__content">
                                                        <div className="requesterDetails__mainInfo">
                                                            <div className="mainInfo__title">
                                                                <h5 className='mb-4'>
                                                                    {t('DashboardSingleQuotationPage.fullNameFormInput')}:
                                                                </h5>
                                                                <h5>
                                                                    {t('DashboardSingleQuotationPage.emailFormInput')}:
                                                                </h5>
                                                                <h5 className='mb-4'>
                                                                    {t('DashboardSingleQuotationPage.validToFormInput')}:
                                                                </h5>
                                                                {!isOneClickQuotation &&
                                                                    <h5 className='mb-4'>
                                                                        {t('DashboardSingleQuotationPage.preferedCurrencyFormInput')}:
                                                                    </h5>
                                                                }
                                                            </div>
                                                            <div className="mainInfo__texts mt-0">
                                                                <h5 className='mb-4'>
                                                                    {newData?.requested_by_name || fullData?.requested_by_name}
                                                                </h5>
                                                                <h5>
                                                                    {newData?.requested_by_email || fullData?.requested_by_email}
                                                                </h5>
                                                                <h5 className='mb-4'>
                                                                    {newData?.valid_to || fullData?.valid_to}
                                                                </h5>
                                                                {!isOneClickQuotation &&
                                                                    <h5 className='mb-4'>
                                                                        {newData?.currency}
                                                                    </h5>}
                                                            </div>
                                                        </div>
                                                        <div className="requesterDetails__subInfo">
                                                            <div className="mainInfo__title">
                                                                <h5 className='mb-4'>
                                                                    {t('DashboardSingleQuotationPage.cityFormInput')}:
                                                                </h5>
                                                                <h5 className='mb-4'>
                                                                    {t('DashboardSingleQuotationPage.areaFormInput')}:
                                                                </h5>
                                                                <h5 className='mb-4'>
                                                                    {t('DashboardSingleQuotationPage.postalCodeFormInput')}:
                                                                </h5>
                                                                <h5>
                                                                    {t('DashboardSingleQuotationPage.countryFormInput')}:
                                                                </h5>
                                                                <h5>
                                                                    {t('DashboardSingleQuotationPage.locationFormInput')}:
                                                                </h5>
                                                            </div>
                                                            <div className="mainInfo__texts">
                                                                <h5 className='mb-4'>
                                                                    {newData?.city || fullData?.destination_city}
                                                                </h5>
                                                                <h5 className='mb-4'>
                                                                    {newData?.area || fullData?.destination_area}
                                                                </h5>
                                                                <h5 className='mb-4'>
                                                                    {newData?.postal_code || fullData?.postal_code}
                                                                </h5>
                                                                <h5>
                                                                    {newData?.country || fullData?.destination_country}
                                                                </h5>
                                                                <h5>
                                                                    <ShowLocationOnMap latitude={newData?.latitude} longitude={newData?.longitude} />
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                <div className="col-lg-12 d-flex justify-content-around">
                    {
                        !isOneClickQuotation ?
                            loginType === 'employee' ?
                                (newData?.company_status === 'Pending') ?
                                    newData?.quotation_type === 'sell' ?
                                        <>
                                            <button onClick={handleAcceptQuotation} className='updateBtn' >{t('DashboardSingleQuotationPage.acceptQuotationBtn')}</button>
                                            <button onClick={handleRejectAllQuotation} className='updateBtn reject' >{t('DashboardSingleQuotationPage.rejectQuotationBtn')}</button>
                                        </>
                                        :
                                        ''
                                    :
                                    (newData?.quotation_type === 'buy' && newData?.user_status === 'Pending') &&
                                    <>
                                        <button onClick={() => handleUpdateBuyQuotationCompanyStatus('accepted')} className='updateBtn' >{t('DashboardSingleQuotationPage.acceptQuotationBtn')}</button>
                                        <button onClick={() => handleUpdateBuyQuotationCompanyStatus('rejected')} className='updateBtn reject' >{t('DashboardSingleQuotationPage.rejectQuotationBtn')}</button>
                                    </>
                                :
                                (newData?.company_status === 'Accepted' && newData?.user_status !== 'Accepted') &&
                                <>
                                    <button onClick={handleAcceptQuotation} className='updateBtn' >{t('DashboardSingleQuotationPage.acceptQuotationBtn')}</button>
                                    <button onClick={handleRejectAllQuotation} className='updateBtn reject' >{t('DashboardSingleQuotationPage.rejectQuotationBtn')}</button>
                                </>
                            :
                            loginType === 'employee' ?
                                (newData?.company_status === 'Pending') ?
                                    fullData?.quotation_type === 'sell' ?
                                        <>
                                            <button onClick={handleAcceptQuotation} className='updateBtn' >{t('DashboardSingleQuotationPage.acceptQuotationBtn')}</button>
                                            <button onClick={handleRejectAllQuotation} className='updateBtn reject' >{t('DashboardSingleQuotationPage.rejectQuotationBtn')}</button>
                                        </>
                                        :
                                        ''
                                    :
                                    (fullData?.quotation_type === 'buy' && fullData?.user_status === 'Pending') &&
                                    <>
                                        <button onClick={() => handleUpdateBuyQuotationCompanyStatus('accepted')} className='updateBtn' >{t('DashboardSingleQuotationPage.acceptQuotationBtn')}</button>
                                        <button onClick={() => handleUpdateBuyQuotationCompanyStatus('rejected')} className='updateBtn reject' >{t('DashboardSingleQuotationPage.rejectQuotationBtn')}</button>
                                    </>
                                :
                                (newData?.company_status === 'Accepted' && newData?.user_status !== 'Accepted') &&
                                <>
                                    <button onClick={handleAcceptQuotation} className='updateBtn' >{t('DashboardSingleQuotationPage.acceptQuotationBtn')}</button>
                                    <button onClick={handleRejectAllQuotation} className='updateBtn reject' >{t('DashboardSingleQuotationPage.rejectQuotationBtn')}</button>
                                </>
                    }
                </div>
                                            </div>
                                        </div>
                                    </div>
                            )
                            }
                        </div>
                    </div>
            }
        </>
    );
};