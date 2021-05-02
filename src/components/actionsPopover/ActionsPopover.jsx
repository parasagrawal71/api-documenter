import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Popover, Tooltip, ClickAwayListener } from "@material-ui/core";
import {
  AddCircleOutline as AddIcon,
  CreateNewFolderOutlined as AddFolderIcon,
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
  const { openPopover, setOpenPopover, hideAddFolder } = props;

  const classes = useStyles();

  return openPopover ? (
    <ClickAwayListener onClickAway={() => setOpenPopover(false)}>
      <section className={appStyles["actions-cnt"]}>
        <div className={appStyles["actions-icons-cnt"]}>
          <AddIcon className={appStyles.actionIcons} />
          <span>Add File</span>
        </div>
        {!hideAddFolder && (
          <div className={appStyles["actions-icons-cnt"]}>
            <AddFolderIcon className={appStyles.actionIcons} />
            <span>Add Folder</span>
          </div>
        )}
      </section>
    </ClickAwayListener>
  ) : null;
}
