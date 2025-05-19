import React, { useEffect, useState } from "react";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import { NavLink, useParams } from "react-router-dom";
import { scrollToTop } from "../../functions/scrollToTop";
import toast from "react-hot-toast";

export default function OneClickNegotiationTable({ token, setUnAuth }) {
  const loginType = localStorage.getItem("loginType");
  const [newData, setNewdata] = useState([]);
  const [fullData, setFulldata] = useState([]);
  const { negotiateId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [can_achieve_target_budget, setCan_achieve_target_budget] = useState(null);
    const [can_achieve_target_delivery_time, setCan_achieve_target_delivery_time] = useState(null);
      const [can_achieve_preferred_delivery_terms, setCan_achieve_preferred_delivery_terms] = useState(null);
  const fetchShowQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/show-single-one-click-quotation`
        : `${loginType}/show-one-click-quotation`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}/${negotiateId}?page=${currentPage}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            can_achieve_target_budget,
            can_achieve_target_delivery_time,
            can_achieve_preferred_delivery_terms
          }
        }
      );
      setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Error!');
    };
  };

  useEffect(() => {
    fetchShowQuotations();
  }, [ 
    loginType,
    token,
    currentPage,
    can_achieve_target_budget,
    can_achieve_target_delivery_time,
    can_achieve_preferred_delivery_terms]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    };
  };

    const handleFilterChange = (e) => {
    const value = e.target.value;
    setCan_achieve_target_budget(null);
    setCan_achieve_target_delivery_time(null);
    setCan_achieve_preferred_delivery_terms(null);

    if (value === "budget") {
      setCan_achieve_target_budget("yes");
    } else if (value === "delivery_time") {
      setCan_achieve_target_delivery_time("yes");
    } else if (value === "delivery_terms") {
      setCan_achieve_preferred_delivery_terms("yes");
    }
    setCurrentPage(1); // Reset to page 1 when filters change
  };

console.log(newData);

  return (
    <div className="quotationTable__handler content__view__handler">
      
       <div className="row align-items-center">
        <div className="col-6">
          <ContentViewHeader title={`All Requested Companies`} />
        </div>
        <div className="col-6">
          <div className="singleQuoteInput">
            {/* <label htmlFor="oneclickquotationFilterComapnies">
                filter companies
            </label> */}
            <select
                className='form-select'
                id="oneclickquotationFilterComapnies"
                 onChange={handleFilterChange}
            >
                <option value="" disabled>filter companies</option>
                <option value="budget" className="text-capitalize">can achieve target budget</option>
                <option value="delivery_time" className="text-capitalize">can achieve target delivery time</option>
                <option value="delivery_terms" className="text-capitalize">can achieve preferred delivery terms
                </option>
                
              
            </select>
        </div>
        </div>
       </div>
      <div className="quotationTable__content">
        <Table responsive>
          <thead>
            <tr className="table__default__header">
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            { newData?.length > 0 ?
            newData?.map((row, index) => (
              <tr className="" key={index}>
                <td>
                  {row?.company_name}
                </td>
                <td className="adjust__flex">
                  <button className={`${row?.company_status} table__statu__btn`}>
                    {row?.company_status}
                  </button>
                  <NavLink
                    className={"nav-link"}
                    onClick={() => {
                      scrollToTop();
                    }}
                    to={`/profile/oneclick-quotations/${negotiateId}/${row?.id}`}
                  >
                    {
                      <button className={`table__statu__btn show__btn`}>
                        <span>show</span>
                        <i className="bi bi-eye"></i>
                      </button>
                    }
                  </NavLink>
                </td>
              </tr>
            ))
            : 
            <h2 className="text-danger text-center text-capitalize my-3 fs-4">no company accecpt with this filter</h2>
          }
          </tbody>
        </Table>
        {
          totalPages > 1 &&
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              type="button"
              className="paginationBtn me-2"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i class="bi bi-caret-left-fill"></i>
            </button>
            <span className='currentPagePagination'>{currentPage}</span>
            <button
              type="button"
              className="paginationBtn ms-2"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i class="bi bi-caret-right-fill"></i>
            </button>
          </div>
        }
      </div>
    </div>
  );
}
