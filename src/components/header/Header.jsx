import React, { useState } from "react";
import { ClickAwayListener } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ListAlt as ListAltIcon, ExitToApp as LogoutIcon } from "@material-ui/icons";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeAutocomplete, ThemeTextField } from "utils/commonStyles/StyledComponents";
import EnvPopoverComponent from "components/envPopover/EnvPopover";
import { clearSession } from "utils/cookie";
import useGlobal from "redux/globalHook";

// IMPORT ASSETS HERE
import environments from "assets/environments.json";
import appStyles from "./Header.module.scss";

const Header = (props) => {
  // PROPS HERE
  const { selectedEnv, setSelectedEnv } = props;

  // HOOKS HERE
  const [openEnvPopover, setOpenEnvPopover] = useState(null);
  const [globalState] = useGlobal();

  const toggleOpenEnvPopover = (event) => {
    setOpenEnvPopover(openEnvPopover ? null : event?.currentTarget);
  };

  const handleCloseEnvPopover = () => {
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
