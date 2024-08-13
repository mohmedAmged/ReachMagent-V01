import React, { useEffect, useState } from "react";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import { NavLink, useParams } from "react-router-dom";
import { scrollToTop } from "../../functions/scrollToTop";
import toast from "react-hot-toast";

export default function OneClickNegotiationTable({ token }) {
  const loginType = localStorage.getItem("loginType");
  const [newData, setNewdata] = useState([]);
  const { negotiateId } = useParams();

  const fetchShowQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/show-single-one-click-quotation`
        : `${loginType}/show-one-click-quotation`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}/${negotiateId}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation);
    } catch (error) {
      toast.error(error?.response?.data.message || 'Error!');
    };
  };
  useEffect(() => {
    fetchShowQuotations();
  }, [loginType, token]);

  console.log(newData)

  return (
    <div className="quotationTable__handler content__view__handler">
      <ContentViewHeader title={"All Customers"} />
      <div className="quotationTable__content">
        <Table responsive>
          <thead>
            <tr className="table__default__header">
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {newData?.map((row, index) => (
              <tr className="" key={index}>
                <td>
                {row?.company_name}
                </td>
                <td className="adjust__flex">
                  <button className={`${loginType === 'user' && row?.user_status} ${loginType === 'employee' && row?.company_status} table__statu__btn`}>
                    {loginType === 'user' ? row?.user_status : row?.company_status }
                  </button>
                  <NavLink
                    className={"nav-link"}
                    onClick={() => {
                      scrollToTop();
                    }}
                    to={`/profile/oneclick-quotations/${negotiateId}/${row?.id}`}
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
