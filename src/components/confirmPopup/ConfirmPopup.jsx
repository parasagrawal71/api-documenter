import React from "react";
import { Dialog } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeButton } from "utils/commonStyles/StyledComponents";

// IMPORT ASSETS HERE
import appStyles from "./ConfirmPopup.module.scss";

const ConfirmPopup = (props) => {
  // PROPS HERE
  const {
    openPopup,
    setOpenPopup,
    message,
    cancelCallback,
    confirmCallback,
    confirmText,
    noCancelBtn,
    disableBackdropClick,
  } = props;

  // HOOKS HERE

  return (
    <Dialog
      open={Boolean(openPopup)}
      classes={{ paper: appStyles["dialog-cnt"] }}
      className={appStyles["main-cnt"]}
      onClose={(event, reason) => {
        if (!disableBackdropClick) {
          setOpenPopup({});
        }
      }}
    >
      <section className={appStyles.message}>{message || "Are you sure you want to delete it?"}</section>

      <section className={appStyles["action-btns-cnt"]}>
        {!noCancelBtn && (
          <ThemeButton
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
        )}

        <ThemeButton
          issecondary="true"
          backgroundColor="green"
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
