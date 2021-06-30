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
      <section className={appStyles["services-cnt"]}>
        {serviceList?.map((aService, index) => {
          return (
            <div
              key={index}
              className={appStyles["service-cnt"]}
              role="button"
              tabIndex="0"
              onKeyDown={() => {}}
              onClick={() => {
                props?.history?.push(`/documentation?serviceMID=${aService?._id}`);
              }}
            >
              {aService?.serviceName}
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default Dashboard;
