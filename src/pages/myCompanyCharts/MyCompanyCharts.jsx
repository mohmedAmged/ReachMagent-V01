// Dashboard.js
import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import MyNewSidebarDash from "../../components/myNewSidebarDash/MyNewSidebarDash";

import Cookies from "js-cookie";
import MainContentHeader from "../../components/mainContentHeaderSec/MainContentHeader";
import { useTranslation } from "react-i18next";
import useStatisticsStore from "../../store/UseEmployeeStatisticsStore";

export default function MyCompanyCharts({ token, loginType }) {
  const { t } = useTranslation();
  const { statistics, fetchStatistics, loading, error } = useStatisticsStore();
 useEffect(() => {
      fetchStatistics(token);
  }, [fetchStatistics]);
  console.log(statistics);
  
  const cookiesData = Cookies.get("currentLoginedData");
  const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // const quotationStatusData = {
  //   labels: ["Pending", "Approved", "Rejected"],
  //   datasets: [
  //     {
  //       data: [5, 10, 2],
  //       backgroundColor: ["#f6c23e", "#1cc88a", "#e74a3b"],
  //     },
  //   ],
  // };

  const quotationStatusData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [
          statistics?.quotation_details?.Pending,
          statistics?.quotation_details?.Approved,
          statistics?.quotation_details?.Rejected,
        ],
        backgroundColor: ["#f6c23e", "#1cc88a", "#e74a3b"],
      },
    ],
  };
  
  // const topCountriesQuotations = {
  //   labels: ["USA", "UK", "Germany", "India", "Canada"],
  //   datasets: [
  //     {
  //       label: "Requests",
  //       data: [12, 9, 7, 5, 4],
  //       backgroundColor: "#4e73df",
  //     },
  //   ],
  // };

  const topCountriesQuotations = {
    labels: statistics?.top_quotation_countries?.map((c) => c?.code || "Unknown"),
    datasets: [
      {
        label: "Requests",
        data: statistics?.top_quotation_countries?.map((c) => c?.total),
        backgroundColor: "#4e73df",
      },
    ],
  };


  // const orderStatusData = {
  //   labels: ["Delivered", "Processing", "Cancelled"],
  //   datasets: [
  //     {
  //       data: [15, 8, 3],
  //       backgroundColor: ["#1cc88a", "#36b9cc", "#e74a3b"],
  //     },
  //   ],
  // };


   const orderStatusData = {
    labels: ["Accepted", "Canceled", "Pending"],
    datasets: [
      {
        data: [
          statistics?.order_details?.Accepted,
          statistics?.order_details?.Canceled,
          statistics?.order_details?.Pending,
        ],
        backgroundColor: ["#1cc88a", "#e74a3b", "#f6c23e"],
      },
    ],
  };

 const topCountriesOrders = {
    labels: statistics?.top_order_countries?.map((c) => c?.code || "Unknown"),
    datasets: [
      {
        label: "Orders",
        data: statistics?.top_order_countries?.map((c) => c?.total),
        backgroundColor: "#36b9cc",
      },
    ],
  };

  // const followersByCountry = {
  //   labels: ["USA", "UK", "India", "Brazil", "Germany"],
  //   datasets: [
  //     {
  //       label: "Followers",
  //       data: [300, 250, 200, 150, 100],
  //       backgroundColor: "#36b9cc",
  //     },
  //   ],
  // };

   const followersByCountry = {
    labels: statistics?.top_follower_countries?.map((c) => c?.code || "Unknown"),
    datasets: [
      {
        label: "Followers",
        data: statistics?.top_follower_countries?.map((c) => c?.total),
        backgroundColor: "#8e44ad",
      },
    ],
  };



  return (
    <div className="dashboard__handler d-flex">
      <MyNewSidebarDash />
      <div className="main__content container">
        <MainContentHeader currentUserLogin={currentUserLogin} />
        <div className="content__view__handler company__follower__sec">
          <Container fluid className="py-4">
            {/* ===== QUOTATIONS ===== */}
            <h4 className="fs-2 mb-4 fw-bold">{t('DashboaedChartSec.QuotationsHeaderText')}</h4>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body style={{ height: "300px" , display: "flex", flexDirection: "column", gap:"30px"}}>
                    <Card.Title>{t('DashboaedChartSec.QuotationsStatusHeaderText')}</Card.Title>
                    <div>
                        <Pie data={quotationStatusData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body style={{ height: "300px" }}>
                    <Card.Title>{t('DashboaedChartSec.topCountriesRequest')}</Card.Title>
                    <>
                        <Bar data={topCountriesQuotations} options={chartOptions} />
                    </>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card className="my-4">
                  <Card.Body>
                    <Card.Title>{t('DashboaedChartSec.numberOfQuotations')}</Card.Title>
                    <h2>{statistics?.total_quotations}</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* ===== ORDERS ===== */}
            <h4 className="fs-2 mb-4 fw-bold">{t('DashboaedChartSec.OrdersHeaderText')}</h4>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body  style={{ height: "300px" , display: "flex", flexDirection: "column", gap:"30px"}}>
                    <Card.Title>{t('DashboaedChartSec.OrdersStatusHeaderText')}</Card.Title>
                    <div className="">
                    <Pie data={orderStatusData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
               <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body style={{ height: "300px" }}>
                    <Card.Title>
                      {t("DashboaedChartSec.topCountriesOrdering")}
                    </Card.Title>
                    <Bar data={topCountriesOrders} options={chartOptions} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* ===== PRODUCTS ===== */}
            <h4 className="fs-2 mb-4 fw-bold">{t('DashboaedChartSec.ProductsHeaderText')}</h4>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body style={{ height: "300px" }}>
                    <Card.Title>{t('DashboaedChartSec.topCountriesOrdering')}</Card.Title>
                    <Bar data={topCountriesQuotations} options={chartOptions} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="my-4">
                  <Card.Body>
                    <Card.Title>{t('DashboaedChartSec.mostOrderedProduct')}</Card.Title>
                    <p className="text-capitalize">{statistics?.most_sold_catalog !== null ? statistics?.most_sold_catalog : 'no product sold yet'}</p>
                    {/* <p>120 Orders</p> */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* ===== FOLLOWERS ===== */}
            <h4 className="fs-2 mb-4 fw-bold">{t('DashboaedChartSec.followersHeaderText')}</h4>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body style={{ height: "300px" }}>
                    <Card.Title>{t('DashboaedChartSec.followersByCountry')}</Card.Title>
                    <Bar data={followersByCountry} options={chartOptions} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="my-4">
                  <Card.Body>
                    <Card.Title>{t('DashboaedChartSec.followersNumber')}</Card.Title>
                    <h2>{statistics?.total_followers}</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* ===== APPOINTMENTS ===== */}
            <h4 className="fs-2 mb-4 fw-bold">{t('DashboaedChartSec.AppointmentsHeaderText')}</h4>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{t('DashboaedChartSec.numberOfBookedAppointments')}</Card.Title>
                    <h2>{statistics?.total_of_appointments}</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}
