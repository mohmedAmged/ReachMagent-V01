import React, { useEffect, useState } from "react";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

export default function OneClickQuotationTable({ token, setUnAuth }) {
  const [activeRole, setActiveRole] = useState('All');
  const loginType = localStorage.getItem("loginType");
  const [newData, setNewdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/my-one-click-quotations`
        : `${loginType}/all-one-click-quotations`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}?page=${currentPage}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewdata(response?.data?.data?.one_click_quotations);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    };
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    };
  };

  useEffect(() => {
    fetchAllQuotations();
  }, [loginType, token]);

  console.log(newData);

  return (
    <div className="quotationTable__handler content__view__handler">
      {
        loginType === 'employee' &&
        <div className="my__roles__actions mb-5 ps-0 ms-0">
          <button
            className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
            onClick={() => setActiveRole('All')}
          >
            All
          </button>
          <button
            className={`def__btn meddle_btn px-5 ${activeRole === 'Sell' ? 'rolesActiveBtn' : ''}`}
            onClick={() => setActiveRole('Sell')}
          >
            Sell
          </button>
          <button
            className={`cust__btn px-5 ${activeRole === 'Buy' ? 'rolesActiveBtn' : ''}`}
            onClick={() => setActiveRole('Buy')}
          >
            Buy
          </button>
        </div>
      }
      <ContentViewHeader title={"All One-Click Quotations"} />
      <div className="quotationTable__content">
        <Table responsive>
          <thead>
            <tr className="table__default__header">
              <th>ID</th>
              <th>Submission Date</th>
              <th>Requested {loginType === 'user' ? 'From' : 'By'}</th>
              <th>Request type</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {console.log(newData)}
            {newData?.map((row, index) => {
              return (
                <tr key={index}>
                  <td>
                    <NavLink to={loginType === 'user' ? `/profile/oneclick-quotations/${row?.id}` : `/profile/companyoneclick-quotations/${row?.id}`} className={'nav-link fw-bold'}>
                      {row?.code === 'N/A' ? '' : row?.code}
                    </NavLink>
                  </td>
                  <td >{row?.created_at}</td>
                  <td>{loginType === 'user' ? row?.company_name : row?.user_name}</td>
                  <td>{row?.type}</td>
                  <td >{row?.country}</td>
                </tr>
              )
            })}
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
