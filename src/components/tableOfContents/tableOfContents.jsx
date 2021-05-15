import React, { useState, useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import {
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDownIcon,
  FolderOutlined as FolderIcon,
  FolderOpenOutlined as FolderOpenIcon,
  CreateNewFolderOutlined as AddFolderIcon,
  MoreVert as MoreIcon,
} from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import ActionsPopoverComponent from "components/actionsPopover/ActionsPopover";
import { sortArrayOfObjs } from "utils/functions";

// IMPORT ASSETS HERE
import apiList from "assets/apiList.json";
import appStyles from "./tableOfContents.module.scss";

const tableOfContents = () => {
  // HOOKS HERE
  const [sortedApiFolders, setSortedApiFolders] = useState([]);
  const [openReadme, setOpenReadme] = useState(false);
  const [openModels, setOpenModels] = useState(false);
  const [openTextfieldPopup, setOpenTextfieldPopup] = useState(false);
  const [showApiActions, setShowApiActions] = useState({});
  const [openActionsPopover, setOpenActionsPopover] = useState({});

  useEffect(() => {
    const sortedApis = sortArrayOfObjs(apiList, "folder");
    setSortedApiFolders(sortedApis);
  }, []);

  const openFolder = (folderName, subFolderName, folderIndex) => {
    const updatedFolders = sortedApiFolders?.map((folderObj, index) => {
      if (folderObj?.folder === folderName && !subFolderName) {
        folderObj.opened = !folderObj.opened;
      }

      if (subFolderName && index === folderIndex) {
        const updatedSubfolders = folderObj?.subfolders?.map((subFolderObj) => {
          if (subFolderObj?.folder === subFolderName) {
            subFolderObj.opened = !subFolderObj.opened;
          }
          return subFolderObj;
        });
        folderObj.subfolders = updatedSubfolders;
      }

      return folderObj;
    });
    setSortedApiFolders(updatedFolders);
  };

  const showApiFolder = (apiObj, subApiObj, apiIndex, subApiIndex) => {
    const handleArrowClick = (e) => {
      // e.stopPropagation(); // DON'T uncomment it. Because of this, actions popover clickaway listener doesn't work on clicking the arrow btn
      if (apiObj?.folder === "README") {
        setOpenReadme(!openReadme);
      } else if (apiObj?.folder === "Models") {
        setOpenModels(!openModels);
      } else {
        openFolder(apiObj?.folder, subApiObj?.folder, apiIndex);
      }
    };

    return (
      <section
        className={appStyles["api-folder"]}
        key={subApiObj ? subApiObj?.folder : apiObj?.folder}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setShowApiActions({ [subApiObj?.folder || apiObj?.folder]: true });
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setShowApiActions({ [subApiObj?.folder || apiObj?.folder]: false });
        }}
      >
        <section className={appStyles["api-folder--left"]}>
          {apiObj?.folder === "README" && openReadme ? (
            <>
              <ArrowDownIcon
                className={appStyles.arrowIcon}
                onClick={handleArrowClick}
              />
              <FolderOpenIcon />
            </>
          ) : apiObj?.folder === "Models" && openModels ? (
            <>
              <ArrowDownIcon
                className={appStyles.arrowIcon}
                onClick={handleArrowClick}
              />
              <FolderOpenIcon />
            </>
          ) : subApiObj && apiObj?.subfolders?.[subApiIndex]?.opened ? (
            <>
              <ArrowDownIcon
                className={appStyles.arrowIcon}
                onClick={handleArrowClick}
              />
              <FolderOpenIcon />
            </>
          ) : !subApiObj && apiObj?.opened ? (
            <>
              <ArrowDownIcon
                className={appStyles.arrowIcon}
                onClick={handleArrowClick}
              />
              <FolderOpenIcon />
            </>
          ) : (
            <>
              <ArrowRightIcon
                className={appStyles.arrowIcon}
                onClick={handleArrowClick}
              />
              <FolderIcon />
            </>
          )}
          <span className={appStyles["api-folder-name"]}>
            {subApiObj ? subApiObj?.folder : apiObj?.folder}
          </span>
        </section>
        {showApiActions?.[subApiObj?.folder || apiObj?.folder] && (
          <section className={appStyles["api-folder--right"]}>
            <MoreIcon
              className={appStyles.actionIcons}
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionsPopover({
                  [subApiObj?.folder || apiObj?.folder]: true,
                });
              }}
            />
          </section>
        )}
        {openActionsPopover?.[subApiObj?.folder || apiObj?.folder] && (
          <ActionsPopoverComponent
            openPopover={openActionsPopover}
            setOpenPopover={setOpenActionsPopover}
            hideAddFolder={
              subApiObj || ["README", "Models"].includes(apiObj?.folder)
            }
            addFileText={
              apiObj?.folder === "Models"
                ? "Add Model"
                : apiObj?.folder === "README"
                ? "Add File"
                : null
            }
            // addFolderCallback={}
            // addFileCallback={}
            // deleteCallback={}
          />
        )}
      </section>
    );
  };

  const showApiFiles = (apiFiles) => {
    return apiFiles?.map((file) => {
      return (
        <div
          className={appStyles["api-file"]}
          key={file?.fileName}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setShowApiActions({ [file?.fileName]: true });
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setShowApiActions({ [file?.fileName]: false });
          }}
        >
          <section className={appStyles["api-file--left"]}>
            <span className={appStyles["api-file-method"]}>{file?.method}</span>
            <span className={appStyles["api-file-name"]}>{file?.fileName}</span>
          </section>
          {showApiActions?.[file?.fileName] && (
            <section className={appStyles["api-file--right"]}>
              <MoreIcon
                className={appStyles.actionIcons}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenActionsPopover({
                    [file?.fileName]: true,
                  });
                }}
              />
            </section>
          )}
          {openActionsPopover?.[file?.fileName] && (
            <ActionsPopoverComponent
              openPopover={openActionsPopover}
              setOpenPopover={setOpenActionsPopover}
              hideAddFile
              hideAddFolder
              deleteText="Delete Request"
            />
          )}
        </div>
      );
    });
  };

  const updateApiFolders = (actionType, folderName) => {
    switch (actionType) {
      case "add":
        const updatedApiFolders = [...sortedApiFolders];
        updatedApiFolders.push({ folder: folderName });
        setSortedApiFolders(sortArrayOfObjs(updatedApiFolders, "folder"));
        return;

      default:
        return new Error("Invalid action");
    }
  };

  return (
    <section className={appStyles["main-container"]}>
      <div className={appStyles["main-header"]}>
        <span>Table of contents</span>
      </div>
      <section className={appStyles["api-folder-wrapper-1"]}>
        {showApiFolder({ folder: "README" })}

        {openReadme &&
          showApiFiles([
            { method: "INFO", fileName: "Success response format" },
            { method: "INFO", fileName: "Error response format" },
          ])}
      </section>
      <section className={appStyles["api-folder-wrapper-1"]}>
        {showApiFolder({ folder: "Models" })}

        {openModels &&
          showApiFiles([
            { method: "INFO", fileName: "User" },
            { method: "INFO", fileName: "Endpoint" },
          ])}
      </section>
      <div className={appStyles["sub-header"]}>
        <span>APIs</span>
        <Tooltip title="Add Folder">
          <AddFolderIcon
            className={appStyles.addFolderIcon}
            onClick={(e) => {
              e.stopPropagation();
              setOpenTextfieldPopup(true);
            }}
          />
        </Tooltip>
      </div>

      {/* *********************************** API FOLDERS starts here ************************************* */}
      <section className={appStyles["api-folders"]}>
        {sortedApiFolders?.map((apiFolder, folderIndex) => {
          return (
            <section
              key={apiFolder?.folder}
              className={appStyles["api-folder-wrapper-1"]}
            >
              {showApiFolder(apiFolder, null, folderIndex)}

              {apiFolder?.opened &&
                apiFolder?.subfolders?.map((subFolder, subFolderIndex) => {
                  return (
                    <section
                      key={subFolder?.folder}
                      className={appStyles["api-folder-wrapper-2"]}
                    >
                      {showApiFolder(
                        apiFolder,
                        subFolder,
                        folderIndex,
                        subFolderIndex
                      )}

                      {subFolder?.opened && showApiFiles(subFolder?.files)}
                    </section>
                  );
                })}

              {apiFolder?.opened && showApiFiles(apiFolder?.files)}
            </section>
          );
        })}
      </section>
      {/* ************************************************************************************************* */}

      {/* ************************************** POPUP starts here **************************************** */}
      <TextfieldPopupComponent
        openPopup={openTextfieldPopup}
        setOpenPopup={setOpenTextfieldPopup}
        placeholder="Enter folder name"
        handleSave={(value) => {
          updateApiFolders("add", value);
        }}
      />
      {/* ************************************************************************************************* */}
    </section>
  );
};

export default tableOfContents;
