import React, { useState } from "react";
import { Dialog, Button } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE

// IMPORT ASSETS HERE
import appStyles from "./ConfirmPopup.module.scss";

const ConfirmPopup = (props) => {
  // PROPS HERE
  const { openPopup, setOpenPopup, message, cancelCallback, confirmCallback, confirmText } = props;

  // HOOKS HERE

  return (
    <Dialog
      open={openPopup}
      classes={{ paper: appStyles["dialog-cnt"] }}
      className={appStyles["main-cnt"]}
      onClose={() => {
        setOpenPopup({});
      }}
    >
      <section>{message || "Are you sure you want to delete it?"}</section>

      <section className={appStyles["action-btns-cnt"]}>
        <Button
          variant="outlined"
          onClick={() => {
            if (cancelCallback) {
              cancelCallback();
            }
            setOpenPopup({});
          }}
          className={appStyles["action-btn"]}
        >
          Cancel
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            if (confirmCallback) {
              confirmCallback();
            }
            setOpenPopup({});
          }}
          className={appStyles["action-btn"]}
        >
          {confirmText || "Confirm"}
        </Button>
      </section>
    </Dialog>
  );
};

export default ConfirmPopup;
