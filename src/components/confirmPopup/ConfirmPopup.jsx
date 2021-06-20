import React from "react";
import { Dialog } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeButton } from "utils/commonStyles/styledComponents";

// IMPORT ASSETS HERE
import appStyles from "./ConfirmPopup.module.scss";

const ConfirmPopup = (props) => {
  // PROPS HERE
  const { openPopup, setOpenPopup, message, cancelCallback, confirmCallback, confirmText } = props;

  // HOOKS HERE

  return (
    <Dialog
      open={Boolean(openPopup)}
      classes={{ paper: appStyles["dialog-cnt"] }}
      className={appStyles["main-cnt"]}
      onClose={() => {
        setOpenPopup({});
      }}
    >
      <section>{message || "Are you sure you want to delete it?"}</section>

      <section className={appStyles["action-btns-cnt"]}>
        <ThemeButton
          isSecondary
          onClick={() => {
            if (cancelCallback) {
              cancelCallback();
            }
            setOpenPopup({});
          }}
          className={appStyles["action-btn"]}
        >
          Cancel
        </ThemeButton>

        <ThemeButton
          onClick={() => {
            if (confirmCallback) {
              confirmCallback();
            }
            setOpenPopup({});
          }}
          className={appStyles["action-btn"]}
        >
          {confirmText || "Confirm"}
        </ThemeButton>
      </section>
    </Dialog>
  );
};

export default ConfirmPopup;
