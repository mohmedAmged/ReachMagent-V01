import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import MyNewSidebarDash from "../myNewSidebarDash/MyNewSidebarDash";
import MainContentHeader from "../mainContentHeaderSec/MainContentHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import defaultProdImg from "../../assets/servicesImages/default-store-350x350.jpg";
import toast from "react-hot-toast";
import MyLoader from "../myLoaderSec/MyLoader";

export default function ShowOneClickQuotation({ token }) {
  const loginType = localStorage.getItem("loginType");
  const { offerId } = useParams();
  const [fullData, setFullData] = useState([]);
  const [newData, setNewdata] = useState([]);
  const [acceptedSingleQuotations, setAcceptedSingleQuotations] = useState([]);
  const [updatedOfferPrices, setUpdatedOfferPrices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingValue, setShippingValue] = useState(0);
  const [taxValue, setTaxValue] = useState(0);
  const [servicesValue, setServicesValue] = useState(0);
  const navigate = useNavigate();
  let negotiationId = undefined;
  const location = useLocation();
  (() => {
    const regex = /oneclick-quotations\/(\d+)/;
    const str = location.pathname;
    const result = str.match(regex)[1];
    negotiationId = result;
  })();
  const [submitionData, setSubmitionData] = useState({
    one_click_quotation_id: negotiationId,
    negotiate_one_click_quotation_id: offerId,
    status: "",
    negotiate_one_click_quotation_detail_id: [],
    offer_price: [],
    tax: "",
    services: "",
    shipping_price: "",
    total_price: "",
  });

  const fetchShowQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/show-single-one-click-quotation`
        : `${loginType}/show-one-click-quotation`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}/${negotiationId}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFullData(response?.data?.data?.one_click_quotation);
      setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation);
    } catch (error) {
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    };
  };

  useEffect(() => {
    fetchShowQuotations();
  }, [loginType, token]);

  useEffect(() => {
    const currentNegotiationDetails = newData?.find(el => +el?.id === +offerId);
    setShippingValue(currentNegotiationDetails?.shipping_price);
    setTaxValue(currentNegotiationDetails?.tax);
    setServicesValue(currentNegotiationDetails?.services);
    if (currentNegotiationDetails) {
      setAcceptedSingleQuotations(currentNegotiationDetails?.negotiate_one_click_quotation_details)
    };
  }, [newData]);

  useEffect(() => {
    if (updatedOfferPrices.length === 0) {
      const totalPriceArray = acceptedSingleQuotations?.map(
        (el) => el?.offer_price !== "N/A" && +el?.offer_price
      );
      const totalPrice = totalPriceArray?.reduce(
        (acc, current) => +acc + +current,
        0
      );
      setSubmitionData({ ...submitionData, total_price: +totalPrice });
    } else {
      const totalPriceArray = updatedOfferPrices?.map((el) => +el?.value);
      const totalPrice = totalPriceArray.reduce(
        (acc, current) => +acc + +current,
        0
      );
      setSubmitionData({ ...submitionData, total_price: +totalPrice });
    }
  }, [acceptedSingleQuotations, updatedOfferPrices]);

  useEffect(() => {
    setTotalPrice(
      +submitionData?.total_price + +shippingValue + +taxValue + +servicesValue
    );
  }, [submitionData?.total_price, taxValue, shippingValue, servicesValue]);

  const handleChangeOfferPrices = (e, id) => {
    const founded = updatedOfferPrices?.find((price) => +price?.id === +id);
    if (founded) {
      const updatedPrices = updatedOfferPrices.map((el) =>
        el.id === id ? { ...el, value: e.target.value } : el
      );
      setUpdatedOfferPrices(updatedPrices);
    } else {
      setUpdatedOfferPrices([
        ...updatedOfferPrices,
        { id: id, value: e.target.value },
      ]);
    }
  };

  const handleRejectAllQuotation = () => {
    const toastId = toast.loading("Loading...");
    const submitData = {
      one_click_quotation_id: negotiationId,
      negotiate_one_click_quotation_id: offerId,
      status: "rejected",
    };
    (async () => {
      await axios
        .post(
          `${baseURL}/${loginType}/update-one-click-quotation-status?t=${new Date().getTime()}`,
          submitData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          navigate("/profile/quotations");
          toast.success(response?.data?.message || "Quotation Rejected!", {
            id: toastId,
            duration: 1000,
          });
        })
        .catch((error) => {
          toast.error(error?.response?.data?.errors?.negotiate_one_click_quotation_id[0] || error?.response?.data?.message || "Error", {
            id: toastId,
            duration: 2000,
          });
        });
    })();
  };

  const handleAcceptQuotation = () => {
    const toastId = toast.loading("Loading...");
    let submitData = {};
    if (loginType === "employee") {
      submitData = submitionData;
      submitData.status = "accepted";
      submitData.total_price = +totalPrice;
      submitData.negotiate_one_click_quotation_detail_id = acceptedSingleQuotations?.map(
        (el) => `${el?.id}`
      );
      submitData.offer_price = updatedOfferPrices?.map((el) => el?.value);
      (async () => {
        await axios
          .post(
            `${baseURL}/${loginType}/update-one-click-quotation-status?t=${new Date().getTime()}`,
            submitData,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            navigate(`/profile/oneclick-quotations/${negotiationId}`);
            toast.success(response?.data?.message || "Quotation Accepted!", {
              id: toastId,
              duration: 1000,
            });
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.errors?.shipping_price[0] ||
              error?.response?.data?.errors?.total_price[0] ||
              error?.response?.data?.errors?.status[0] ||
              error?.response?.data?.errors?.quotation_id[0] ||
              error?.response?.data?.errors?.tax[0] ||
              error?.response?.data?.errors?.services[0] ||
              error?.response?.data?.message ||
              "Error!",
              {
                id: toastId,
                duration: 1000,
              }
            );
          });
      })();
    } else if (loginType === "user") {
      submitData.one_click_quotation_id = negotiationId;
      submitData.negotiate_one_click_quotation_id = offerId;
      submitData.status = "accepted";
      const currentNegotiationDetails = newData?.find(el => +el?.id === +offerId);
      if (!(currentNegotiationDetails?.company_status !== 'Accepted')) {
        (async () => {
          await axios
            .post(
              `${baseURL}/${loginType}/update-one-click-quotation-status?t=${new Date().getTime()}`,
              submitData,
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              navigate(`/profile/oneclick-quotations/${negotiationId}`);
              toast.success(response?.data?.message || "Quotation Accepted!", {
                id: toastId,
                duration: 1000,
              });
            })
            .catch((error) => {
              toast.error(
                error?.response?.data?.errors?.shipping_price[0] ||
                error?.response?.data?.errors?.total_price[0] ||
                error?.response?.data?.errors?.status[0] ||
                error?.response?.data?.errors?.negotiate_one_click_quotation_id[0] ||
                error?.response?.data?.errors?.one_click_quotation_id[0] ||
                error?.response?.data?.errors?.tax[0] ||
                error?.response?.data?.errors?.services[0] ||
                error?.response?.data?.message ||
                "Error!",
                {
                  id: toastId,
                  duration: 1000,
                }
              );
            });
        })();
      } else {
        toast.error("Company doesn't Accept this Quotation Yet!", {
          id: toastId,
          duration: 2000
        })
      }
    };
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);

  return (
    <>
      {
        loading ?
          <MyLoader />
          :
          <div className="dashboard__handler showSingleQuotation__handler d-flex">
            <MyNewSidebarDash />
            <div className="main__content container">
              <MainContentHeader />
              <div className="content__view__handler">
                <ContentViewHeader title={"Request a quote"} />
                <div className="quotationTable__content">
                  <Table responsive>
                    <thead>
                      <tr className="table__default__header">
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>QTY</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acceptedSingleQuotations?.map((row) => (
                        <tr className="" key={row?.id}>
                          <td className="product__item__content">
                            <img
                              src={
                                row?.medias[0]?.media
                                  ? row?.medias[0]?.media
                                  : `${defaultProdImg}`
                              }
                              alt=""
                            />
                            <span>{row?.slug ? row?.slug : `${row?.title}`}</span>
                          </td>
                          <td>{row?.category ? row?.category : "N/A"}</td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              disabled
                              defaultValue={!row?.price ? 0 : row?.price}
                            />
                          </td>
                          <td>{row?.quantity}</td>
                          <td>
                            <input
                              type="number"
                              className={`form-control ${loginType !== "user" && "bg-white"
                                }`}
                              defaultValue={
                                row?.offer_price !== "N/A" ? row?.offer_price : 0
                              }
                              onChange={(event) =>
                                handleChangeOfferPrices(event, row?.id)
                              }
                              disabled={loginType === "user"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="quoteTotals__handler">
                  <h3>Quote Totals</h3>
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <div className="totals__full__info">
                        <div className="totals__text">
                          <h5 className="mb-4">subtotal (Standard)</h5>
                          <h5 className="mb-4">Shipping cost</h5>
                          <h5 className="mb-4">Tax</h5>
                          <h5 className="mb-4">Services</h5>
                          <h5>Total</h5>
                        </div>
                        <div className="totals__prices">
                          <h5 className="mb-4">${submitionData?.total_price}</h5>
                          {(newData?.include_shipping === "Yes") && (
                            <h5 className="mb-4">
                              {shippingValue}
                            </h5>
                          )}
                          <h5 className="mb-4">${taxValue}</h5>
                          <h5 className="mb-4">${servicesValue}</h5>
                          <h5>
                            $
                            {totalPrice}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 adjustPositione">
                      <div className="totals__have__problem">
                        <h3>Having a problem?</h3>
                        <button className="updateBtn">
                          <i className="bi bi-wechat fs-4"></i>
                          <span>Chat with requester</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="requesterDetails__handler">
                  <h3>Requester Details</h3>
                  <div className="row">
                    <div className="col-lg-12 requesterDetails__content">
                      <div className="requesterDetails__mainInfo">
                        <div className="mainInfo__title">
                          <h5 className="mb-4">Company Name:</h5>
                          <h5 className="mb-4">Quotation Type:</h5>
                          <h5>Street address:</h5>
                        </div>
                        <div className="mainInfo__texts">
                          <h5 className="mb-4">{fullData?.company_name}</h5>
                          <h5 className="mb-4">{fullData?.type}</h5>
                          <h5>{fullData?.address}</h5>
                        </div>
                      </div>
                      <div className="requesterDetails__subInfo">
                        <div className="mainInfo__title">
                          <h5 className="mb-4">Your City:</h5>
                          <h5 className="mb-4">Your Area:</h5>
                          <h5 className="mb-4">Postal Code:</h5>
                          <h5>Your Country:</h5>
                        </div>
                        <div className="mainInfo__texts">
                          <h5 className="mb-4">{fullData?.destination_city}</h5>
                          <h5 className="mb-4">{fullData?.destination_area}</h5>
                          <h5 className="mb-4">{fullData?.code}</h5>
                          <h5>{fullData?.destination_country}</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 d-flex justify-content-around">
                      <span onClick={handleAcceptQuotation} className="updateBtn">
                        Accept Quotation
                      </span>
                      <span
                        onClick={handleRejectAllQuotation}
                        className="updateBtn reject"
                      >
                        Reject Quotation
                      </span>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
      }
    </>
  );
};
