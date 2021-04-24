import React from "react";
import { Dialog } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import { prettyPrintJson } from "utils/functions";

// IMPORT ASSETS HERE
import appStyles from "./Popup.module.scss";

const Popup = (props) => {
  // PROPS HERE
  const { openPopup, setOpenPopup, title, content } = props;

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
      <section className={appStyles["view-more-popup"]}>
        <div>{title}</div>
        <div className={appStyles["view-more__json-cnt"]}>
          <pre>{prettyPrintJson(content)}</pre>
        </div>
      </section>
    </Dialog>
  );
};

export default Popup;
