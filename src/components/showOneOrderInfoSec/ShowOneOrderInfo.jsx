import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import './showOneOrderInfo.css'
import { Table } from 'react-bootstrap';
import defaulImg from '../../assets/servicesImages/default-store-350x350.jpg'
import fileImage from '../../assets/productImages/file-txt-1-icon-512x510-5cj0091t.png'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { findRenderedDOMComponentWithTag } from 'react-dom/test-utils';
import MyNewLoader from '../myNewLoaderSec/MyNewLoader';
import { Lang } from '../../functions/Token';
import { useTranslation } from 'react-i18next';
export default function ShowOneOrderInfo({ token }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [newData, setNewdata] = useState([]);
    const fetchOrderInfo = async () => {
        const slug = loginType === 'user' ? 'show-quotation-order' : 'quotation-order';
        try {
            const response = await axios.get(`${baseURL}/${loginType}/${slug}/${orderId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Locale": Lang
                }
            });
            setNewdata(response?.data?.data?.quotation_order);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchOrderInfo();
    }, [loginType, token]);
    const taxesPrice = newData?.taxes;
    const shippingPrice = newData?.shipping_price;
    const servicePrice = newData?.services;
    const currencySymbol = newData?.currency_symbol;
    

    const handleChangeStatue = async (id, status) => {        
            await axios.post(`${baseURL}/${loginType}/update-quotation-order-status?t=${new Date().getTime()}`, {
                quotation_order_id: `${id}`,
                status: status
            }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                toast.success(response?.data?.message || 'Changed Successfully!');
                fetchOrderInfo();
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            })            
        };

console.log(newData);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    const [show, setShow] = useState(false);
    const [currNote, setCurrNote] = useState('');
    const handleViewNotes = (id) =>{
        const note = newData?.quotation_order_details?.find((row)=>+row?.id === +id)?.notes
        setShow(true);
        setCurrNote(note);
    };

const [showFiles, setShowFiles] = useState(false);
const [currFile, setCurrFile] = useState([]);

const handleViewFiles = (files) => {
    setCurrFile(files); // Set files for the selected row
    setShowFiles(true); // Open the modal
};
// console.log(currFile);


    // console.log(newData);
    
    return (
        <>
            {
                loading ?
                    <MyNewLoader />
                    :
                    <div className='dashboard__handler showOneProductInDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container showOneOrder__handler'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
        <div className='content__view__handler'>
            <ContentViewHeader title={`${t('DashboardSingleQuotationOrderPage.headerPageText')} #${newData?.code} (${newData?.order_type})`} />
            <div className="content__card__list showOrder__handler">
                <div className="row">
                    <div className="col-12 main_header_for_order">
                        <div className="row justify-content-between">
                            <div className="col-lg-6 col-md-6 col-sm-12 ">
                                <p>
                                    <i className={`bi bi-calendar ${Lang === 'ar' ? 'ms-2' : 'me-2'}`}></i>
                                    {newData?.created_at}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 ">
                                <div className="changeOrderStatu__handler ">
                                    <p className={`order__statue ${newData?.order_status}`}>
                                        {newData?.order_status_translated}
                                    </p>
                    {
                        newData?.order_type !== 'buy' && newData?.order_status !== 'Completed'  && loginType !== 'user' && (
                        <select
                            className="changeSatusSelect form-select w-50"
                            onChange={(e) => handleChangeStatue(newData?.id, e.target.value)} 
                            defaultValue=""
                        >
                            <option value="" disabled>{t('DashboardSingleQuotationOrderPage.orderStatusFormInputPlaceholder')}</option> 
                            <option value="Accepted">{t('DashboardSingleQuotationOrderPage.acceptedStatusFormInput')}</option>
                            <option value="processing">{t('DashboardSingleQuotationOrderPage.processingStatusFormInput')}</option>
                            <option value="delivering">{t('DashboardSingleQuotationOrderPage.deliveringStatusFormInput')}</option>
                            <option value="completed">{t('DashboardSingleQuotationOrderPage.completedStatusFormInput')}</option>
                            <option value="cancelled_by_admin" disabled>{t('DashboardSingleQuotationOrderPage.cancelledByAdminStatusFormInput')}</option>
                        </select>
                        )
                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        {
                            newData?.order_type !== 'buy' ?
                            <div className="row">
                            <div className="col-lg-6 col-md-6 sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <p className='specialP'>
                                    {t('DashboardSingleQuotationOrderPage.orderInfoCustomerInfo')}
                                </p>
                                <h5>
                                    {newData?.order_by_name}                              
                                </h5>
                                <p>
                                    {newData?.order_by_phone}
                                </p>
                                <p>
                                    {newData?.city}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6  sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-geo-alt-fill"></i>

                                </div>
                                <p className='specialP'>
                                    {t('DashboardSingleQuotationOrderPage.orderInfoDestinationPayment')}
                                </p>
                                <h5>
                                    {newData?.city}, {newData?.country}
                                </h5>
                                <p>
                                    {t('DashboardSingleQuotationOrderPage.orderInfoAdress')}: {newData?.address}
                                </p>
                            </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-lg-6 col-md-6 sub_header_for_order">
                                    <div className="icon_handler">
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <p className='specialP text-capitalize'>
                                        {t('DashboardSingleQuotationOrderPage.orderInfoSellerInformation')}
                                    </p>
                                    <h5>
                                        {newData?.company_name}                              
                                    </h5>
                                    <p>
                                        {newData?.company_email}
                                    </p>
                                    <p className='text-capitalize'>
                                        {newData?.city !== 'N/A' ? newData?.city : newData?.address}
                                    </p>
                                </div>
                                <div className="col-lg-6 col-md-6  sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-geo-alt-fill"></i>

                                </div>
                                <p className='specialP'>
                                    {t('DashboardSingleQuotationOrderPage.orderInfoDestinationPayment')}
                                </p>
                                {
                                    newData?.city !== 'N/A' && newData?.country !== 'N/A' &&
                                    <h5 className='text-capitalize'>
                                    {newData?.city !== 'N/A' ? `${newData?.city},`  : ''} {newData?.country !== 'N/A' ? newData?.country : ''}
                                    </h5>
                                }
                                
                                <p className='text-capitalize'>
                                    {t('DashboardSingleQuotationOrderPage.orderInfoAdress')}: {newData?.address}
                                </p>
                                <p className='text-capitalize'>
                                    {t('DashboardSingleQuotationOrderPage.orderInfoOrderType')}: {newData?.order_type}
                                </p>
                            </div>
                            </div>
                        }
                        
                    </div>
                    <div className="col-12">
                        {
                            newData?.length !== 0 ?
<div className="productTable__content">
<Table responsive>
                                        <thead>
            <tr className='table__default__header'>
                <th>
                    {t('DashboardSingleQuotationOrderPage.tableHeadProduct')}
                </th>
                <th className='text-center'>{t('DashboardSingleQuotationOrderPage.tableHeadQty')}</th>
                <th className='text-center'>{t('DashboardSingleQuotationOrderPage.tableHeadUnit')}</th>
                
                <th 
                className='text-center'>{t('DashboardSingleQuotationOrderPage.tableHeadTotalPrice')}</th>
                <th className='text-center'>{t('DashboardSingleQuotationOrderPage.tableHeadNotes')}</th>
                {/* <th className='text-center'>Preferences</th> */}
                <th className='text-center'>{t('DashboardSingleQuotationOrderPage.tableHeadFiles')}</th>
                
            </tr>
                                        </thead>
                                        <tbody>
                                            {newData?.quotation_order_details?.map((row, index) => (
    <tr className='' key={index}>
        <td className='product__breif__detail d-flex '>
            <div className="product__img">
            <img  src={
    row?.medias?.find((media) => media.type === 'image')?.media || 
    (row?.medias?.every((media) => media.type === 'file') 
      ? fileImage 
      : row?.image || defaulImg) 
  } alt="product" />
            </div>
            <div className="product__info">
                <h2 className='cursorPointer' title={row?.title}>
                    {/* {row?.title?.length > 5 ? `${row?.title.substring(0, 5)}...` : row?.title} */}
                    {row?.title} <span className='optional'>
                                    {
                                        row?.code ? `(${row?.code})` : '' 
                                    }
                                </span>
                </h2>
            </div>
        </td>
        <td>
            {row?.quantity}
        </td>
        <td>
        {
            row?.unit_of_measure 
                ? row?.unit_of_measure !== 'N/A' 
                ? row?.unit_of_measure 
                : '' 
                : row?.type === 'service' 
                ? 'services item' 
                : 'Customized Product'
        }
        </td>
        <td>
            {currencySymbol}{row?.total_price}
        </td>
        <td className='text-center'>
                                {
                                row?.note !== 'N/A' ?
                                    <i onClick={()=>handleViewNotes(row?.id)} className="bi bi-eye cursorPointer"></i>
                                    : 
                                    `${t('DashboardSingleQuotationOrderPage.tableHeadNoNotes')}`
                                }
                            </td>
                            <Modal show={show} onHide={() => setShow(false)}>
                                <Modal.Header closeButton>
                                <Modal.Title>{t('DashboardSingleQuotationOrderPage.tableHeadNotes')}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{currNote}</Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShow(false)}>
                                    {t('DashboardSingleQuotationOrderPage.ModalCloseBtn')}
                                </Button>
                                </Modal.Footer>
                            </Modal>
                            <td className='text-center'>
                               {
                               row?.type === "customized" ? 
                                <i onClick={() => handleViewFiles(row?.medias)}
                                    className="bi bi-box-arrow-up-right cursorPointer"
                                >
                                </i>
                                :
                                `${t('DashboardSingleQuotationOrderPage.tableHeadNoFiles')}`
                                }

                            </td>
                            <Modal show={showFiles} onHide={() => setShowFiles(false)}>
                                <Modal.Header closeButton>
                                <Modal.Title>{t('DashboardSingleQuotationOrderPage.tableHeadFiles')}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body  
                                    style={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            height: 'calc(80vh - 250px)', 
                                            overflowY:'auto'
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
                                            `${t('DashboardSingleQuotationOrderPage.ModalViewFileBtn')}`
                                        )}
                                    </NavLink>
                                </div>
                            ))
                        ) : (
                            <p>{t('DashboardSingleQuotationOrderPage.NoFilesText')}</p>
                        )}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowFiles(false)}>
                                    {t('DashboardSingleQuotationOrderPage.ModalCloseBtn')}
                                </Button>
                                </Modal.Footer>
                            </Modal>
    </tr>
))}
    </tbody>
</Table>
<div className="quoteTotals__handler">
        <h3 className='text-capitalize'>
            {t('DashboardSingleQuotationOrderPage.orderTotalInfo')}
        </h3>
        <div className="row align-items-center">
            <div className="col-lg-6">
                <div className="totals__full__info">
                    <div className="totals__text">
                        <h5 className='mb-4'>
                            {t('DashboardSingleQuotationOrderPage.SubTotalInfo')} <span className="optional">({t('DashboardSingleQuotationOrderPage.beforeTaxInfo')})</span>
                        </h5>
                        {
                            newData?.taxes !== 'N/A' &&
                            <h5 className='mb-4'>
                            {t('DashboardSingleQuotationOrderPage.totalTaxInfo')}
                            </h5>
                        }
                        {
                            
                                <h5 className='mb-4'>
                                    {t('DashboardSingleQuotationOrderPage.ShippingCostInfo')}
                                </h5>
                        }
                        <h5 className='mb-4'>
                            {t('DashboardSingleQuotationOrderPage.extraInfo')} <span className='optional'>({t('DashboardSingleQuotationOrderPage.specifiedInNotesInfo')})</span>
                        </h5>
                        <h5>
                            {t('DashboardSingleQuotationOrderPage.totalPriceInfo')}
                        </h5>
                    </div>
                    <div className="totals__prices">
                        <h5 className='mb-4 '>
                                $ {newData?.sub_total
                                }
                        </h5>
                        {
                            newData?.taxes !== 'N/A' &&
                            <h5 className='mb-4'>
                                $ {newData?.taxes}
                            </h5>
                        }
                        <h5 className='mb-4 mt-2'>
                                $ {newData?.shipping_price}
                        </h5>
                        <h5 className='mb-4 mt-2'>
                                $ {newData?.services}
                        </h5>
                        <h5 className=' mt-2'>
                                $ {newData?.total_price
                                }
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                                :
                                <div className='row'>
                                    <div className="col-12 text-danger fs-5">
                                        {t('DashboardSingleQuotationOrderPage.noProductItem')}
                                    </div>
                                </div>
                        }
                    </div>
                </div>


            </div>

        </div>
                            }
                        </div>
                    </div>
            }
        </>
    )
}
