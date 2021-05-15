import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import { ClickAwayListener } from "@material-ui/core";
import {
  AddCircleOutline as AddIcon,
  CreateNewFolderOutlined as AddFolderIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import appStyles from "./ActionsPopover.module.scss";

const useStyles = makeStyles((theme) => ({
  popover: {
    marginTop: 5,
  },
  paper: {},
}));

export default function ActionsPopover(props) {
  // PROPS HERE
  const {
    openPopover,
    setOpenPopover,
    addFileText,
    hideAddFile,
    hideAddFolder,
    deleteText,
    hideDelete,
  } = props;

  // REFS HERE
  const actionsPopupRef = useRef(null);

  const classes = useStyles();

  useEffect(() => {
    const clickAwayEventListener = (e) => {
      if (
        !actionsPopupRef?.current ||
        !actionsPopupRef?.current?.contains(e?.target)
      ) {
        setOpenPopover(false);
      }
    };

    document.addEventListener("click", clickAwayEventListener);

    return () => {
      document.removeEventListener("click", clickAwayEventListener);
    };
    // eslint-disable-next-line
  }, []);

  return openPopover ? (
    <section ref={actionsPopupRef} className={appStyles["actions-cnt"]}>
      {!hideAddFile && (
        <div className={appStyles["actions-icons-cnt"]}>
          <AddIcon className={appStyles.actionIcons} />
          <span>{addFileText || "Add Request"}</span>
        </div>
      )}
      {!hideAddFolder && (
        <div className={appStyles["actions-icons-cnt"]}>
          <AddFolderIcon className={appStyles.actionIcons} />
          <span>Add Folder</span>
        </div>
      )}
      {!hideDelete && (
        <div className={appStyles["actions-icons-cnt"]}>
          <DeleteIcon className={appStyles.actionIcons} />
          <span>{deleteText || "Delete"}</span>
        </div>
      )}
    </section>
  ) : null;
}
