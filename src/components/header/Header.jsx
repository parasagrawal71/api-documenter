import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AccountCircle as AccountCircleIcon } from "@material-ui/icons";
import cx from "classnames";
import { toast } from "react-toastify";

// IMPORT USER-DEFINED COMPONENTS HERE
import { clearSession } from "utils/cookie";
import useGlobal from "redux/globalHook";
import GenericActionsPopoverComponent from "subComponents/genericActionsPopover/GenericActionsPopover";

// IMPORT ASSETS HERE
import appStyles from "./Header.module.scss";

const Header = (props) => {
  // HOOKS HERE
  const [globalState] = useGlobal();
  const [openAccountOptions, setOpenAccountOptions] = useState(false);

  const logout = () => {
    clearSession();
    window.location.href = "/";
  };

  return (
    <header className={appStyles["app-header"]}>
      <section className={appStyles["app-header--left"]}>
        <div className={appStyles["app-header__appName"]}>Documentation</div>
      </section>
      <section className={appStyles["app-header--right"]}>
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

        <div className={appStyles["user-account-cnt"]}>
          <AccountCircleIcon
            className={appStyles["user-account-icon"]}
            onClick={() => {
              setOpenAccountOptions(!openAccountOptions);
            }}
          />
        </div>

        <GenericActionsPopoverComponent
          openPopover={openAccountOptions}
          setOpenPopover={(val) => {
            setOpenAccountOptions(val);
          }}
          options={["Profile", "Logout"]}
          optionsCallbacks={[
            () => {
              toast.info("Feature coming soon!");
            },
            logout,
          ]}
          containerClass={appStyles.accountOptionsCnt}
          optionCntClass={appStyles.accountOption}
        />
      </section>
    </header>
  );
};

export default Header;
