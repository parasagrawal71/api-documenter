import React from "react";
import { Dialog } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import { prettyPrintJson, getStatusText } from "utils/functions";

// IMPORT ASSETS HERE
import appStyles from "./Popup.module.scss";

const Popup = (props) => {
  // PROPS HERE
  const { openPopup, setOpenPopup, title, statusCode, content } = props;

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
        <div className={appStyles["view-more-popup__title"]}>
          <span>{title}</span>
          <span
            className={
              String(statusCode)?.startsWith("2")
                ? appStyles.green
                : appStyles.red
            }
          >
            {statusCode ? `${statusCode} ${getStatusText(statusCode)}` : null}
          </span>
        </div>
        <div className={appStyles["view-more-popup__json-cnt"]}>
          <pre>{prettyPrintJson(content)}</pre>
        </div>
      </section>
    </Dialog>
  );
};

export default Popup;
