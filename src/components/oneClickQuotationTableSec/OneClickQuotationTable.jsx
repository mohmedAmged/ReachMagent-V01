import React from "react";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function OneClickQuotationTable({
  totalPages,
  newData,
  currentPage,
  setCurrentPage,
  filteration,
  setFilteration,
}) {
  const loginType = localStorage.getItem("loginType");

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRoleChange = (role, typeValue) => {
    setFilteration({ ...filteration, type: typeValue, activeRole: role });
  };

  return (
    <div className="quotationTable__handler content__view__handler">
      {loginType === "employee" && (
        <div className="my__roles__actions mb-5 ps-0 ms-0">
          <button
            className={`def__btn px-5 ${filteration.activeRole === "All" ? "rolesActiveBtn" : ""}`}
            onClick={() => handleRoleChange("All", "")}
          >
            All
          </button>
          <button
            className={`def__btn meddle_btn px-5 ${filteration.activeRole === "Sell" ? "rolesActiveBtn" : ""}`}
            onClick={() => handleRoleChange("Sell", "sell")}
          >
            Selling
          </button>
          <button
            className={`cust__btn px-5 ${filteration.activeRole === "Buy" ? "rolesActiveBtn" : ""}`}
            onClick={() => handleRoleChange("Buy", "buy")}
          >
            Buying
          </button>
        </div>
      )}
      <ContentViewHeader title={"All One-Click Quotations"} />
      <div className="quotationTable__content">
        <Table responsive>
          <thead>
            <tr className="table__default__header">
              <th>ID</th>
              <th>Submission Date</th>
              {/* <th>Requested {loginType === "user" ? "From" : "By"}</th>
              {loginType === "employee" && <th>Requester Phone</th>}
              <th>Country</th> */}
            </tr>
          </thead>
          <tbody>
            {newData?.map((row, index) => (
              <tr key={index}>
                <td>
                  <NavLink
                    to={loginType === "user"
                      ? `/profile/oneclick-quotations/${row?.code}`
                      : row?.quotation_type === "buy"
                        ? `/profile/oneclick-quotations/${row?.code}`
                        : `/profile/companyoneclick-quotations/${row?.code}`}
                    className="nav-link fw-bold"
                  >
                    {row?.code === "N/A" ? "" : row?.code}
                  </NavLink>
                </td>
                <td>{row?.created_at}</td>
                {/* <td>{loginType === "user" ? row?.company_name : row?.request_by_name}</td>
                {loginType === "employee" && <td>{row?.request_by_phone}</td>}
                <td>{row?.destination_country}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              type="button"
              className="paginationBtn me-2"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="bi bi-caret-left-fill"></i>
            </button>
            <span className="currentPagePagination">{currentPage}</span>
            <button
              type="button"
              className="paginationBtn ms-2"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
