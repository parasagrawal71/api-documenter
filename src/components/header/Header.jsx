import React, { useState, useEffect } from "react";
import { ClickAwayListener } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ListAlt as ListAltIcon, ExitToApp as LogoutIcon } from "@material-ui/icons";
import cx from "classnames";
import { toast } from "react-toastify";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeAutocomplete, ThemeTextField } from "utils/commonStyles/StyledComponents";
import EnvPopoverComponent from "components/envPopover/EnvPopover";
import { clearSession } from "utils/cookie";
import useGlobal from "redux/globalHook";
import apiService from "apis/apiService";
import { environment } from "apis/urls";
import { getUrlParams } from "utils/functions";

// IMPORT ASSETS HERE
import appStyles from "./Header.module.scss";

const Header = (props) => {
  // PROPS HERE
  const { environments, setEnvironments, selectedEnv, setSelectedEnv } = props;

  // VARIABLES HERE
  const serviceMID = getUrlParams()?.serviceMID;

  // HOOKS HERE
  const [openEnvPopover, setOpenEnvPopover] = useState(null);
  const [selectedEnvOldData, setSelectedEnvOldData] = useState(null);
  const [globalState] = useGlobal();

  const createEnvironment = async (reqBody) => {
    const response = await apiService(environment().post, { ...reqBody, serviceMID });
    if (response?.success) {
      // setEnvironments(); response?.data
    }
  };

  const editEnvironment = async (updatedEnvironment) => {
    const response = await apiService(environment(updatedEnvironment?._id).put, updatedEnvironment);
    if (response?.success) {
      setSelectedEnvOldData({});
    } else {
      setSelectedEnv(selectedEnvOldData);
      toast.error("Couldn't update environment!");
      toast.clearWaitingQueue();
    }
  };

  const deleteEnvironment = async (mongoId) => {
    const response = await apiService(environment(mongoId).delete);
    if (response?.success) {
      // setEnvironments(); response?.data
    }
  };

  const toggleOpenEnvPopover = (event) => {
    setOpenEnvPopover(openEnvPopover ? null : event?.currentTarget);
  };

  const handleCloseEnvPopover = () => {
    if (openEnvPopover) {
      editEnvironment(selectedEnv);
    }
    setOpenEnvPopover(null);
  };

  const logout = () => {
    clearSession();
    window.location.href = "/";
  };

  return (
    <header className={appStyles["app-header"]}>
      <section className={appStyles["app-header--left"]}>
        <div className={appStyles["app-header__appName"]}>Documentation</div>
      </section>
      <section className={appStyles["app-header--mid"]}>
        <Link
          className={cx(appStyles["app-header_menu-item"], {
            [appStyles.active]: window.location.href.includes("dashboard"),
          })}
          to="/dashboard"
        >
          Dashboard
        </Link>
        {globalState?.loggedInUser?.superuser && (
          <Link
            className={cx(appStyles["app-header_menu-item"], {
              [appStyles.active]: window.location.href.includes("users"),
            })}
            to="/users"
          >
            Users
          </Link>
        )}
      </section>
      <section className={appStyles["app-header--right"]}>
        {selectedEnv && (
          <div className={appStyles["app-header__envs"]}>
            <div className={appStyles["app-header__envs-dropdown"]}>
              <ThemeAutocomplete
                options={environments}
                getOptionLabel={(option) => option?.envName || ""}
                customStyle={{ width: "250px", padding: 0, color: "lightgrey" }}
                renderInput={(params) => (
                  <ThemeTextField
                    {...params}
                    InputLabelProps={{
                      focused: false,
                    }}
                  />
                )}
                onChange={(e, selectedOption) => {
                  setSelectedEnv(selectedOption);
                }}
                value={selectedEnv || ""}
              />
            </div>
            <ClickAwayListener onClickAway={handleCloseEnvPopover}>
              <div className={appStyles["app-header__edit-env"]}>
                <ListAltIcon className={appStyles["app-header__edit-env__icon"]} onClick={toggleOpenEnvPopover} />
                <EnvPopoverComponent
                  openEnvPopover={openEnvPopover}
                  handleCloseEnvPopover={handleCloseEnvPopover}
                  selectedEnv={selectedEnv}
                  setSelectedEnv={setSelectedEnv}
                  selectedEnvOldData={selectedEnvOldData}
                  setSelectedEnvOldData={setSelectedEnvOldData}
                />
              </div>
            </ClickAwayListener>
          </div>
        )}

        <LogoutIcon className={appStyles["logout-btn"]} onClick={logout} />
      </section>
    </header>
  );
};

export default Header;
