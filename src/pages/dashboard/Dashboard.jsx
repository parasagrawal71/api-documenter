import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import apiService from "apis/apiService";
import { service } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./Dashboard.module.scss";

const Dashboard = (props) => {
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const response = await apiService(service().getAll);
    if (response?.success) {
      setServiceList(response?.data);
    }
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <HeaderComponent />
      {serviceList?.map((aService, index) => {
        return (
          <Link
            key={index}
            className={appStyles["service-link"]}
            to={{
              pathname: "/documentation",
              search: `?serviceMID=${aService?._id}`,
            }}
          >
            <div className={appStyles["service-cnt"]}>{aService?.serviceName}</div>
          </Link>
        );
      })}
    </section>
  );
};

export default Dashboard;
