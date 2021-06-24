import React, { useState } from "react";
import { ClickAwayListener } from "@material-ui/core";
import { ListAlt as ListAltIcon } from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeAutocomplete, ThemeTextField } from "utils/commonStyles/StyledComponents";
import EnvPopoverComponent from "components/envPopover/EnvPopover";

// IMPORT ASSETS HERE
import environments from "assets/environments.json";
import appStyles from "./Header.module.scss";

const Header = (props) => {
  // PROPS HERE
  const { selectedEnv, setSelectedEnv } = props;

  // HOOKS HERE
  const [openEnvPopover, setOpenEnvPopover] = useState(null);

  const toggleOpenEnvPopover = (event) => {
    setOpenEnvPopover(openEnvPopover ? null : event?.currentTarget);
  };

  const handleCloseEnvPopover = () => {
    setOpenEnvPopover(null);
  };

  return (
    <header className={appStyles["app-header"]}>
      <section className={appStyles["app-header--left"]}>
        <div className={appStyles["app-header__appName"]}>Documentation</div>
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
      </section>
    </header>
  );
};

export default Header;
