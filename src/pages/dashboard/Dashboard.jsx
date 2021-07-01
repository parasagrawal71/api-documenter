import React, { useState, useEffect } from "react";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import apiService from "apis/apiService";
import { service } from "apis/urls";
import { ThemeButton } from "utils/commonStyles/StyledComponents";
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import ConfirmPopupComponent from "components/confirmPopup/ConfirmPopup";

// IMPORT ASSETS HERE
import appStyles from "./Dashboard.module.scss";

const Dashboard = (props) => {
  const [serviceList, setServiceList] = useState([]);
  const [showDeleteIcon, setShowDeleteIcon] = useState(null);
  const [openTextfieldPopup, setOpenTextfieldPopup] = useState({
    open: false,
    placeholder1: "",
  });
  const [openConfirmPopup, setOpenConfirmPopup] = useState({
    open: false,
    serviceMID: "",
  });

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const response = await apiService(service().getAll);
    if (response?.success) {
      setServiceList(response?.data);
    }
  };

  const createService = async (reqBody) => {
    const response = await apiService(service().post, reqBody);
    if (response?.success) {
      serviceList.unshift(response?.data);
      setServiceList([...serviceList]);
    }
  };

  const deleteService = async (mongoId) => {
    const response = await apiService(service(mongoId).delete);
    if (response?.success) {
      const updatedServiceList = serviceList.filter((aSer) => aSer._id !== mongoId);
      setServiceList([...updatedServiceList]);
    }
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <HeaderComponent />
      <section className={appStyles["services-cnt"]}>
        <ThemeButton
          className={appStyles["add-service-btn"]}
          onClick={() => {
            setOpenTextfieldPopup({ open: true });
          }}
        >
          Add Service
        </ThemeButton>
        {serviceList?.map((aService, index) => {
          return (
            <div
              key={index}
              className={appStyles["service-cnt"]}
              role="button"
              tabIndex="0"
              onKeyDown={() => {}}
              onClick={() => {
                props?.history?.push(`/documentation?serviceMID=${aService?._id}&serviceName=${aService?.serviceName}`);
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setShowDeleteIcon(aService?._id);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                setShowDeleteIcon(null);
              }}
            >
              <div>{aService?.serviceName}</div>
              <Tooltip title="Delete service">
                <DeleteIcon
                  onClick={(e) => {
                    e?.stopPropagation();
                    setOpenConfirmPopup({ open: true, serviceMID: aService?._id });
                  }}
                  className={cx(appStyles.deleteServiceBtn, {
                    visibilityHidden: showDeleteIcon !== aService?._id,
                  })}
                />
              </Tooltip>
            </div>
          );
        })}
      </section>

      <TextfieldPopupComponent
        openPopup={openTextfieldPopup?.open}
        setOpenPopup={setOpenTextfieldPopup}
        placeholder1={openTextfieldPopup?.placeholder1}
        handleSave={(value1) => {
          createService({ serviceName: value1 });
        }}
      />

      <ConfirmPopupComponent
        openPopup={openConfirmPopup?.open}
        setOpenPopup={setOpenConfirmPopup}
        message="Are you sure you want to delete the service? It will delete all the endpoints of it."
        confirmText="Delete"
        confirmCallback={() => {
          deleteService(openConfirmPopup?.serviceMID);
        }}
      />
    </section>
  );
};

export default Dashboard;
