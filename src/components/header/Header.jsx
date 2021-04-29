import React, { useState, useEffect } from "react";
import { ListAlt as ListAltIcon } from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import {
  ThemeAutocomplete,
  ThemeTextField,
} from "utils/commonStyles/styledComponents";

// IMPORT ASSETS HERE
import environments from "assets/environments";
import appStyles from "./Header.module.scss";

const Header = () => {
  // HOOKS HERE
  const [selectedEnv, setSelectedEnv] = useState({});

  useEffect(() => {
    setSelectedEnv(environments[0]);
  }, []);

  return (
    <header className={appStyles["app-header"]}>
      <section className={appStyles["app-header--left"]}>
        <div className={appStyles["app-header__appName"]}>APIs</div>
      </section>
      <section className={appStyles["app-header--right"]}>
        <div className={appStyles["app-header__envs-dropdown"]}>
          <ThemeAutocomplete
            options={environments}
            getOptionLabel={(option) => option?.envName || ""}
            width="250px"
            renderInput={(params) => (
              <ThemeTextField
                {...params}
                variant="outlined"
                size="small"
                color="white"
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
        <div className={appStyles["app-header__edit-env"]}>
          <ListAltIcon className={appStyles["app-header__edit-env__icon"]} />
        </div>
      </section>
    </header>
  );
};

export default Header;
