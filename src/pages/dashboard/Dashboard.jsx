import React, { useState, useEffect } from "react";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Close as CancelIcon } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";
import cx from "classnames";
import { toast } from "react-toastify";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import apiService from "apis/apiService";
import { service } from "apis/urls";
import { ThemeButton, ThemeTextField } from "utils/commonStyles/StyledComponents";
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import ConfirmPopupComponent from "components/confirmPopup/ConfirmPopup";
import useGlobal from "redux/globalHook";
import { fetchLoggedInUserData } from "apis/apiCalls";

// IMPORT ASSETS HERE
import appStyles from "./Dashboard.module.scss";

const Dashboard = (props) => {
  const [serviceList, setServiceList] = useState([]);
  const [serviceOldData, setServiceOldData] = useState({});
  const [showActionIcons, setShowActionIcons] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [globalState, globalActions] = useGlobal();
  const [openTextfieldPopup, setOpenTextfieldPopup] = useState({
    open: false,
    placeholder1: "",
  });
  const [openConfirmPopup, setOpenConfirmPopup] = useState({
    open: false,
    serviceMID: "",
    message: "",
  });

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    const response = await apiService(service().getAll);
    if (response?.success) {
      setServiceList(response?.data);
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const createService = async (reqBody) => {
    const response = await apiService(service().post, reqBody);
    if (response?.success) {
      serviceList.unshift(response?.data);
      setServiceList([...serviceList]);
      fetchLoggedInUserData().then((userData) => {
        globalActions.updateLoggedInUser(userData);
      });
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const deleteService = async (mongoId) => {
    const response = await apiService(service(mongoId).delete);
    if (response?.success) {
      const updatedServiceList = serviceList.filter((aSer) => aSer._id !== mongoId);
      setServiceList([...updatedServiceList]);
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const editService = async (updatedService) => {
    const response = await apiService(service(updatedService?._id).put, updatedService);
    if (response?.success) {
      fetchLoggedInUserData().then((userData) => {
        globalActions.updateLoggedInUser(userData);
      });
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
      updateServiceState(serviceOldData);
    }
  };

  const updateServiceState = (updatedService) => {
    const updatedServiceList = serviceList.map((aSer) => {
      if (aSer?._id === updatedService?._id) {
        return updatedService;
      }

      return aSer;
    });
    setServiceList([...updatedServiceList]);
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <HeaderComponent />
      <section className={appStyles["services-cnt"]}>
        <section className={appStyles["services-cnt__header"]}>
          <div className={appStyles["services-cnt__header__title"]}>Services</div>
          <ThemeButton
            className={appStyles["add-service-btn"]}
            onClick={() => {
              setOpenTextfieldPopup({ open: true, placeholder1: "Enter service name" });
              setEditMode(null);
            }}
          >
            Add Service
          </ThemeButton>
        </section>
        {serviceList?.map((aService, index) => {
          return (
            <div
              key={index}
              className={cx(appStyles["service-cnt"], {
                cursorPointer: editMode !== aService?._id,
              })}
              role="button"
              tabIndex="0"
              onKeyDown={() => {}}
              onClick={() => {
                if (editMode !== aService?._id) {
                  props?.history?.push(
                    `/documentation?serviceMID=${aService?._id}&serviceName=${aService?.serviceName}`
                  );
                }
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setShowActionIcons(aService?._id);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                setShowActionIcons(null);
              }}
            >
              <section className={appStyles.serviceName}>
                {editMode === aService?._id ? (
                  <ThemeTextField
                    value={aService?.serviceName}
                    onClick={(e) => e?.stopPropagation()}
                    onChange={(e) => {
                      e?.stopPropagation();
                      const newServiceName = e?.target?.value;
                      updateServiceState({ ...aService, serviceName: newServiceName });
                    }}
                  />
                ) : (
                  aService?.serviceName
                )}
              </section>
              <section className={appStyles.endpointsCount}>
                {[0, 1]?.includes(aService?.endpointsCount)
                  ? `${aService?.endpointsCount || 0} endpoint`
                  : `${aService?.endpointsCount || 0} endpoints`}
              </section>
              <section className={appStyles.actionBtns}>
                {editMode === aService?._id && (
                  <Tooltip title="Cancel">
                    <CancelIcon
                      className={cx(appStyles.actionBtn, appStyles.cancelBtn)}
                      onClick={(e) => {
                        e?.stopPropagation();
                        setEditMode(null);
                        updateServiceState(serviceOldData);
                        setServiceOldData({});
                      }}
                    />
                  </Tooltip>
                )}
                {editMode === aService?._id && (
                  <Tooltip title="Save">
                    <SaveIcon
                      className={cx(appStyles.actionBtn, appStyles.saveBtn)}
                      onClick={(e) => {
                        e?.stopPropagation();
                        editService(aService);
                        setEditMode(null);
                      }}
                    />
                  </Tooltip>
                )}
                {globalState?.loggedInUser?.editAccess?.includes?.(aService?.serviceName) &&
                  editMode !== aService?._id && (
                    <Tooltip title="Edit service">
                      <EditIcon
                        onClick={(e) => {
                          e?.stopPropagation();
                          setEditMode(aService?._id);
                          setServiceOldData({ ...aService });
                        }}
                        className={cx(appStyles.actionBtn, {
                          visibilityHidden: showActionIcons !== aService?._id,
                        })}
                      />
                    </Tooltip>
                  )}
                {globalState?.loggedInUser?.editAccess?.includes?.(aService?.serviceName) &&
                  editMode !== aService?._id && (
                    <Tooltip title="Delete service">
                      <DeleteIcon
                        onClick={(e) => {
                          e?.stopPropagation();
                          setOpenConfirmPopup({
                            open: true,
                            serviceMID: aService?._id,
                            message:
                              "Are you sure you want to delete the service? It will delete all the endpoints of it.",
                          });
                          setEditMode(null);
                        }}
                        className={cx(appStyles.actionBtn, {
                          visibilityHidden: showActionIcons !== aService?._id,
                        })}
                      />
                    </Tooltip>
                  )}
              </section>
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
        message={openConfirmPopup?.message}
        confirmText="Delete"
        confirmCallback={() => {
          deleteService(openConfirmPopup?.serviceMID);
        }}
      />
    </section>
  );
};

export default Dashboard;
