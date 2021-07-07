import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeButton } from "utils/commonStyles/StyledComponents";

// IMPORT ASSETS HERE
import appStyles from "./SnackBar.module.scss";

export default function SnackbarComponent(props) {
  // PROPS HERE
  const { snackBar, handleClose, autoHideDuration, stayOpen, noAlert, severity, isButton, buttonText, buttonCallback } =
    props;

  const useStyles = makeStyles({
    root: {
      "& .MuiAlert-message": {
        display: "flex",
        alignItems: "center",
      },
      "& .MuiAlert-action": {
        paddingLeft: 5,
      },
    },
    button: {
      textTransform: "none",
    },
  });
  const classes = useStyles();

  return (
    <Snackbar
      className={appStyles.snackbar}
      key={snackBar?.key}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={snackBar?.show}
      autoHideDuration={stayOpen ? null : autoHideDuration || 3000}
      onClose={handleClose}
      message={snackBar?.message || undefined}
      action={
        <>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    >
      {!noAlert && (
        <Alert onClose={handleClose} severity={severity || "success"} className={cx(appStyles.alert, classes.root)}>
          {snackBar?.message || undefined}

          {isButton && (
            <ThemeButton
              variant="default"
              className={cx(appStyles.button, classes.button)}
              onClick={(e) => {
                e?.stopPropagation();
                buttonCallback?.();
              }}
            >
              {buttonText}
            </ThemeButton>
          )}
        </Alert>
      )}
    </Snackbar>
  );
}
