import React from "react";
import { Dialog } from "@material-ui/core";

// IMPORT ASSETS HERE
import appStyles from "./Popup.module.scss";

const Popup = (props) => {
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
};

export default Popup;
