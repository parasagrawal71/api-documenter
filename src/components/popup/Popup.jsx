import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

// IMPORT ASSETS HERE
import appStyles from "./Popup.module.scss";

export default function AlertDialog(props) {
  // PROPS HERE
  const { openPopup, setOpenPopup, children } = props;

  return (
    <Dialog
      open={openPopup}
      fullWidth
      maxWidth="lg"
      classes={{ paper: appStyles["dialog-cnt"] }}
      className={appStyles["main-cnt"]}
      onClose={() => {
        setOpenPopup(false);
      }}
    >
      {children}
    </Dialog>
  );
}
