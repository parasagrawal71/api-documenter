import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import { clearSession } from "utils/cookie";
import useGlobal from "redux/globalHook";

// IMPORT ASSETS HERE
import appStyles from "./Header.module.scss";

const Header = (props) => {
  // HOOKS HERE
  const [globalState] = useGlobal();

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
        <LogoutIcon className={appStyles["logout-btn"]} onClick={logout} />
      </section>
    </header>
  );
};

export default Header;
