import React, { useEffect, useState } from "react";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import { NavLink } from "react-router-dom";
import { scrollToTop } from "../../functions/scrollToTop";

export default function OneClickQuotationTable({ token }) {
  const loginType = localStorage.getItem("loginType");
  const [newData, setNewdata] = useState([]);

  const fetchAllQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/my-one-click-quotations`
        : `${loginType}/all-one-click-quotations`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewdata(response?.data?.data?.one_click_quotations);
    } catch (error) {
      setNewdata(error?.response?.data.message);
    }
  };
  useEffect(() => {
    fetchAllQuotations();
  }, [loginType, token]);



  return (
    <div className="quotationTable__handler content__view__handler">
      <ContentViewHeader title={"All Customers"} />
      <div className="quotationTable__content">
        <Table responsive>
          <thead>
            <tr className="table__default__header">
              <th>{loginType === 'user' ? 'Request-Type' : 'User Name'}</th>
              <th>{loginType === 'user' ? 'Category' : 'Include Shipping'}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {newData?.map((row, index) => (
              <tr className="" key={index}>
                <td>
                  {loginType === 'user'?
                      row?.type 
                      :
                      row?.area === "N/A"
                      ? loginType === "user"
                        ? row?.company_name
                        : row?.user_name
                      : row?.area
                    }
                </td>
                {
                  loginType === 'user' ?
                  <td>{row?.category}</td>
                  :
                  <td>{row?.include_shipping}</td>
                }
                <td className="adjust__flex">
                  <NavLink
                    className={"nav-link"}
                    onClick={() => {
                      scrollToTop();
                    }}
                    to={loginType === 'user' ? `/profile/oneclick-quotations/${row?.id}` : `/profile/companyoneclick-quotations/${row?.id}`}
                  >
                    <button className={`table__statu__btn show__btn`}>
                      <span>show</span>
                      <i className="bi bi-eye"></i>
                    </button>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
