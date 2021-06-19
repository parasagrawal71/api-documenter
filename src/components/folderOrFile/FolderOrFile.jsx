import React, { useState, useEffect } from "react";
import {
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDownIcon,
  FolderOutlined as FolderIcon,
  FolderOpenOutlined as FolderOpenIcon,
  MoreVert as MoreIcon,
} from "@material-ui/icons";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import ActionsPopoverComponent from "components/actionsPopover/ActionsPopover";

// IMPORT ASSETS HERE
import appStyles from "./FolderOrFile.module.scss";

const FolderOrFile = (props) => {
  // PROPS HERE
  const {
    type,
    isFolderOpen,
    toggleFolder,
    folderObj,
    fileObj,
    showActions,
    addFileText,
    addFileCallback,
    addFolderText,
    addFolderCallback,
    deleteText,
    deleteCallback,
    href,
  } = props;

  // HOOKS HERE
  const [showActionsBtn, setShowActionsBtn] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);

  const inlineStyles = {
    folderFileCnt: {
      paddingLeft: (type === "file" && fileObj?.method && 27) || (type === "file" && 47),
      height: type === "file" && 20,
    },
  };

  const getRequestType = (method) => {
    switch (method && method.toUpperCase()) {
      case "GET":
        return <span className={cx(appStyles["request-type"], appStyles.get)}>{method}</span>;

      case "POST":
        return <span className={cx(appStyles["request-type"], appStyles.post)}>{method}</span>;

      case "PUT":
        return <span className={cx(appStyles["request-type"], appStyles.put)}>{method}</span>;

      case "PATCH":
        return <span className={cx(appStyles["request-type"], appStyles.patch)}>PAT</span>;

      case "DELETE":
        return <span className={cx(appStyles["request-type"], appStyles.delete)}>DEL</span>;

      default:
        return "";
    }
  };

  return (
    <section
      className={appStyles["folder-file-cnt"]}
      style={inlineStyles.folderFileCnt}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setShowActionsBtn(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setShowActionsBtn(false);
      }}
    >
      <section className={appStyles["folder-file-cnt--left"]}>
        {type === "folder" &&
          (isFolderOpen ? (
            <>
              <ArrowDownIcon className={appStyles.arrowIcon} onClick={toggleFolder} />
              <FolderOpenIcon className={appStyles.folderIcon} />
            </>
          ) : (
            <>
              <ArrowRightIcon className={appStyles.arrowIcon} onClick={toggleFolder} />
              <FolderIcon className={appStyles.folderIcon} />
            </>
          ))}
        {type === "file" && fileObj?.method && getRequestType(fileObj?.method)}
        <a
          href={href ? `#${href}` : null}
          className={appStyles["folder-file-name"]}
          title={type === "folder" ? folderObj?.folderName : fileObj?.fileName}
        >
          {type === "folder" ? folderObj?.folderName : fileObj?.fileName}
        </a>
      </section>
      {(showActionsBtn || showActionPopup) && (
        <section className={appStyles["folder-file-cnt--right"]}>
          <MoreIcon
            className={appStyles.actionIcons}
            onClick={(e) => {
              e.stopPropagation();
              setShowActionPopup(true);
            }}
          />
        </section>
      )}
      {showActionPopup && (
        <ActionsPopoverComponent
          openPopover={showActionPopup}
          setOpenPopover={setShowActionPopup}
          showActions={showActions}
          addFileText={addFileText}
          addFileCallback={addFileCallback}
          addFolderText={addFolderText}
          addFolderCallback={addFolderCallback}
          deleteText={deleteText}
          deleteCallback={deleteCallback}
        />
      )}
    </section>
  );
};

export default FolderOrFile;
