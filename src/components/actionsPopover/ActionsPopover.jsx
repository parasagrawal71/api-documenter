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
    showActions,
    addFileText,
    addFileCallback,
    addFolderText,
    addFolderCallback,
    deleteText,
    deleteCallback,
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
      {showActions?.includes("addFile") && (
        <div
          className={appStyles["actions-icons-cnt"]}
          onClick={(e) => {
            e.stopPropagation();
            if (addFileCallback) {
              addFileCallback();
            }
          }}
          role="button"
          onKeyDown={() => {}}
          tabIndex="0"
        >
          <AddIcon className={appStyles.actionIcons} />
          <span>{addFileText || "Add File"}</span>
        </div>
      )}
      {showActions?.includes("addFolder") && (
        <div
          className={appStyles["actions-icons-cnt"]}
          onClick={(e) => {
            e.stopPropagation();
            if (addFolderCallback) {
              addFolderCallback();
            }
          }}
          role="button"
          onKeyDown={() => {}}
          tabIndex="0"
        >
          <AddFolderIcon className={appStyles.actionIcons} />
          <span>{addFolderText || "Add Folder"}</span>
        </div>
      )}
      {showActions?.includes("delete") && (
        <div
          className={appStyles["actions-icons-cnt"]}
          onClick={(e) => {
            e.stopPropagation();
            if (deleteCallback) {
              deleteCallback();
            }
          }}
          role="button"
          onKeyDown={() => {}}
          tabIndex="0"
        >
          <DeleteIcon className={appStyles.actionIcons} />
          <span>{deleteText || "Delete"}</span>
        </div>
      )}
    </section>
  ) : null;
}
