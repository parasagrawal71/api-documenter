import React, { useState, useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import { CreateNewFolderOutlined as AddFolderIcon } from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import FolderOrFileComponent from "components/folderOrFile/FolderOrFile";
import { sortArrayOfObjs } from "utils/functions";

// IMPORT ASSETS HERE
import apisTree from "assets/apisTree.json";
import appStyles from "./tableOfContents.module.scss";

const tableOfContents = () => {
  // HOOKS HERE
  const [sortedApisTree, setSortedApisTree] = useState([]);
  const [openReadme, setOpenReadme] = useState(false);
  const [openModels, setOpenModels] = useState(false);
  const [openTextfieldPopup, setOpenTextfieldPopup] = useState(false);

  useEffect(() => {
    const sortedApisTreeTemp = sortArrayOfObjs(apisTree, "folderName");
    setSortedApisTree(sortedApisTreeTemp);
  }, []);

  const openCloseFolder = (folderName, subFolderName, folderIndex) => {
    const updatedFolders = sortedApisTree?.map((folderObj, index) => {
      if (folderObj?.folderName === folderName && !subFolderName) {
        folderObj.opened = !folderObj.opened;
      }

      if (subFolderName && index === folderIndex) {
        const updatedSubfolders = folderObj?.subfolders?.map((subFolderObj) => {
          if (subFolderObj?.folderName === subFolderName) {
            subFolderObj.opened = !subFolderObj.opened;
          }
          return subFolderObj;
        });
        folderObj.subfolders = updatedSubfolders;
      }

      return folderObj;
    });
    setSortedApisTree(updatedFolders);
  };

  const updateApisTree = (actionType, folderName) => {
    switch (actionType) {
      case "add":
        const updatedApisTree = [...sortedApisTree];
        updatedApisTree.push({ folder: folderName });
        setSortedApisTree(sortArrayOfObjs(updatedApisTree, "folderName"));
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

      {/* ************************************** README starts here **************************************** */}
      <section className={appStyles["folder-wrapper"]}>
        <FolderOrFileComponent
          type="folder"
          isFolderOpen={openReadme}
          toggleFolder={() => {
            setOpenReadme(!openReadme);
          }}
          folderObj={{ folderName: "README" }}
          showActions={["addFile"]}
        />

        {openReadme &&
          [
            { fileName: "Success response format" },
            { fileName: "Error response format" },
          ].map((aFileObj) => {
            return (
              <FolderOrFileComponent
                type="file"
                fileObj={aFileObj}
                showActions={["delete"]}
              />
            );
          })}
      </section>
      {/* ************************************************************************************************* */}

      {/* ************************************** MODELS starts here **************************************** */}
      <section className={appStyles["folder-wrapper"]}>
        <FolderOrFileComponent
          type="folder"
          isFolderOpen={openModels}
          toggleFolder={() => {
            setOpenModels(!openModels);
          }}
          folderObj={{ folderName: "Models" }}
          showActions={["addFile"]}
          addFileText="Add Model"
        />

        {openModels &&
          [{ fileName: "User" }, { fileName: "Endpoint" }].map((aFileObj) => {
            return (
              <FolderOrFileComponent
                type="file"
                fileObj={aFileObj}
                showActions={["delete"]}
              />
            );
          })}
      </section>
      {/* ************************************************************************************************* */}

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
        {sortedApisTree?.map((apiFolder, folderIndex) => {
          return (
            <section
              className={appStyles["folder-wrapper"]}
              key={apiFolder?.folderName}
            >
              <FolderOrFileComponent
                type="folder"
                isFolderOpen={apiFolder?.opened}
                toggleFolder={() => {
                  openCloseFolder(apiFolder?.folderName, null, folderIndex);
                }}
                folderObj={apiFolder}
                showActions={["addFile", "addFolder", "delete"]}
                addFileText="Add Request"
              />

              {apiFolder?.opened &&
                apiFolder?.subfolders?.map((subFolder, subFolderIndex) => {
                  return (
                    <section
                      key={subFolder?.folder}
                      className={appStyles["subfolder-wrapper"]}
                    >
                      <FolderOrFileComponent
                        type="folder"
                        isFolderOpen={subFolder?.opened}
                        toggleFolder={() => {
                          openCloseFolder(
                            apiFolder?.folderName,
                            subFolder?.folderName,
                            folderIndex
                          );
                        }}
                        folderObj={subFolder}
                        showActions={["addFile", "delete"]}
                        addFileText="Add Request"
                      />

                      {subFolder?.opened &&
                        subFolder?.files?.map((aFileObj) => {
                          return (
                            <FolderOrFileComponent
                              key={aFileObj?.folderName}
                              type="file"
                              fileObj={aFileObj}
                              showActions={["delete"]}
                            />
                          );
                        })}
                    </section>
                  );
                })}

              {apiFolder?.opened &&
                apiFolder?.files?.map((aFileObj) => {
                  return (
                    <FolderOrFileComponent
                      key={aFileObj?.folderName}
                      type="file"
                      fileObj={aFileObj}
                      showActions={["delete"]}
                    />
                  );
                })}
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
          updateApisTree("add", value);
        }}
      />
      {/* ************************************************************************************************* */}
    </section>
  );
};

export default tableOfContents;
