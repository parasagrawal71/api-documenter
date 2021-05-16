import React, { useState, useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import { CreateNewFolderOutlined as AddFolderIcon } from "@material-ui/icons";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import FolderOrFileComponent from "components/folderOrFile/FolderOrFile";
import ConfirmPopupComponent from "components/confirmPopup/ConfirmPopup";
import { sortArrayOfObjs } from "utils/functions";
import apiService from "apis/apiService";
import { readme, schema } from "apis/urls";

// IMPORT ASSETS HERE
import apisTree from "assets/apisTree.json";
import appStyles from "./tableOfContents.module.scss";

const tableOfContents = () => {
  // HOOKS HERE
  const [sortedApisTree, setSortedApisTree] = useState([]);
  const [readmeFiles, setReadmeFiles] = useState([]);
  const [openReadme, setOpenReadme] = useState(false);
  const [models, setModels] = useState([]);
  const [openModels, setOpenModels] = useState(false);
  const [openTextfieldPopup, setOpenTextfieldPopup] = useState({
    open: false,
    placeholder1: "",
    placeholder2: "",
    folderIndex: null,
    subFolderIndex: null,
    fileName: "",
    method: "",
  });
  const [openConfirmPopup, setOpenConfirmPopup] = useState({
    open: false,
    folderIndex: null,
    subFolderIndex: null,
    fileIndex: null,
  });

  useEffect(() => {
    const sortedApisTreeTemp = sortArrayOfObjs(apisTree, "folderName");
    setSortedApisTree(sortedApisTreeTemp);

    fetchReadmeFiles();
    fetchModels();
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

  const updateApisTree = (actionType, folder, subFolder, file) => {
    const [folderName, folderIndex] = folder || [];
    const [subFolderName, subFolderIndex] = subFolder || [];
    const [fileName, method, fileIndex] = file || [];

    switch (actionType) {
      case "add-folder":
        const updatedTreeAfterAddingFolder = [...sortedApisTree];
        updatedTreeAfterAddingFolder.push({ folderName });
        setSortedApisTree(
          sortArrayOfObjs(updatedTreeAfterAddingFolder, "folderName")
        );
        break;

      case "add-subfolder":
        const updatedTreeAfterAddingSubFolder = [...sortedApisTree];
        if (updatedTreeAfterAddingSubFolder?.[folderIndex]?.subfolders) {
          updatedTreeAfterAddingSubFolder?.[folderIndex]?.subfolders?.push({
            folderName: subFolderName,
          });
        } else {
          updatedTreeAfterAddingSubFolder[folderIndex].subfolders = [];
          updatedTreeAfterAddingSubFolder?.[folderIndex]?.subfolders?.push({
            folderName: subFolderName,
          });
        }
        setSortedApisTree(updatedTreeAfterAddingSubFolder);
        break;

      case "add-file-in-folder":
        const updatedTreeAfterAddingFileInFolder = [...sortedApisTree];
        if (updatedTreeAfterAddingFileInFolder?.[folderIndex]?.files) {
          updatedTreeAfterAddingFileInFolder?.[folderIndex]?.files?.push({
            method: method.toUpperCase(),
            fileName,
          });
        } else {
          updatedTreeAfterAddingFileInFolder[folderIndex].files = [];
          updatedTreeAfterAddingFileInFolder?.[folderIndex]?.files?.push({
            method: method.toUpperCase(),
            fileName,
          });
        }
        setSortedApisTree(updatedTreeAfterAddingFileInFolder);
        break;

      case "add-file-in-subfolder":
        const updatedTreeAfterAddingFileInSubFolder = [...sortedApisTree];
        if (
          updatedTreeAfterAddingFileInSubFolder?.[folderIndex]?.subfolders?.[
            subFolderIndex
          ]?.files
        ) {
          updatedTreeAfterAddingFileInSubFolder?.[folderIndex]?.subfolders?.[
            subFolderIndex
          ]?.files?.push({ method: method.toUpperCase(), fileName });
        } else {
          updatedTreeAfterAddingFileInSubFolder[folderIndex].subfolders[
            subFolderIndex
          ].files = [];
          updatedTreeAfterAddingFileInSubFolder?.[folderIndex]?.subfolders?.[
            subFolderIndex
          ]?.files?.push({ method: method.toUpperCase(), fileName });
        }
        setSortedApisTree(updatedTreeAfterAddingFileInSubFolder);
        break;

      case "delete-folder":
        const updatedTreeAfterFolderDeletion = [...sortedApisTree];
        updatedTreeAfterFolderDeletion.splice(folderIndex, 1);
        setSortedApisTree(updatedTreeAfterFolderDeletion);
        break;

      case "delete-subfolder":
        const updatedTreeAfterSubFolderDeletion = [...sortedApisTree];
        updatedTreeAfterSubFolderDeletion?.[folderIndex]?.subfolders?.splice(
          subFolderIndex,
          1
        );
        setSortedApisTree(updatedTreeAfterSubFolderDeletion);
        break;

      case "delete-file-from-folder":
        const updatedTreeAfterFileDeletionInFolder = [...sortedApisTree];
        updatedTreeAfterFileDeletionInFolder?.[folderIndex]?.files?.splice(
          fileIndex,
          1
        );
        setSortedApisTree(updatedTreeAfterFileDeletionInFolder);
        break;

      case "delete-file-from-subfolder":
        const updatedTreeAfterSubFileDeletionInFolder = [...sortedApisTree];
        updatedTreeAfterSubFileDeletionInFolder?.[folderIndex]?.subfolders?.[
          subFolderIndex
        ]?.files?.splice(fileIndex, 1);
        setSortedApisTree(updatedTreeAfterSubFileDeletionInFolder);
        break;

      case "add-readme-file":
        const updatedReadmeFiles = [...readmeFiles];
        updatedReadmeFiles?.push({
          fileName,
        });
        setReadmeFiles(updatedReadmeFiles);
        break;

      case "delete-readme-file":
        const updatedReadmeFilesAfterDeletion = [...readmeFiles];
        updatedReadmeFilesAfterDeletion?.splice(fileIndex, 1);
        setReadmeFiles(updatedReadmeFilesAfterDeletion);
        break;

      case "add-model":
        const updatedModels = [...models];
        updatedModels?.push({
          fileName,
        });
        setModels(updatedModels);
        break;

      case "delete-model":
        const updatedModelsAfterDeletion = [...models];
        updatedModelsAfterDeletion?.splice(fileIndex, 1);
        setModels(updatedModelsAfterDeletion);
        break;

      default:
        return new Error("Invalid action");
    }
  };

  const fetchReadmeFiles = async () => {
    const readmeFilesRes = await apiService(readme().getAll);
    if (readmeFilesRes?.success) {
      setReadmeFiles(readmeFilesRes?.data);
      // setReadmeFiles([
      //   { fileName: "Success response format" },
      //   { fileName: "Error response format" },
      // ]);
    }
  };

  const fetchModels = async () => {
    const schemaRes = await apiService(schema().getAll);
    if (schemaRes?.success) {
      setModels(schemaRes?.data);
      // setModels([
      //   { fileName: "User" },
      //   { fileName: "Endpoint" },
      // ]);
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
          addFileCallback={() => {
            setOpenTextfieldPopup({
              actionType: "add-readme-file",
              open: true,
              placeholder1: "Enter File Name",
            });
          }}
        />

        {openReadme &&
          (readmeFiles?.length ? (
            readmeFiles?.map((aFileObj, aFileIndex) => {
              return (
                <FolderOrFileComponent
                  type="file"
                  fileObj={aFileObj}
                  showActions={["delete"]}
                  deleteCallback={() => {
                    setOpenConfirmPopup({
                      actionType: "delete-readme-file",
                      open: true,
                      fileIndex: aFileIndex,
                    });
                  }}
                />
              );
            })
          ) : (
            <div className="zero-state-msg">No files added</div>
          ))}
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
          addFileCallback={() => {
            setOpenTextfieldPopup({
              actionType: "add-model",
              open: true,
              placeholder1: "Enter File Name",
            });
          }}
        />

        {openModels &&
          (models?.length ? (
            models?.map((aFileObj, aFileIndex) => {
              return (
                <FolderOrFileComponent
                  type="file"
                  fileObj={aFileObj}
                  showActions={["delete"]}
                  deleteCallback={() => {
                    setOpenConfirmPopup({
                      actionType: "delete-model",
                      open: true,
                      fileIndex: aFileIndex,
                    });
                  }}
                />
              );
            })
          ) : (
            <div className="zero-state-msg">No model added</div>
          ))}
      </section>
      {/* ************************************************************************************************* */}

      <div className={appStyles["sub-header"]}>
        <span>APIs</span>
        <Tooltip title="Add Folder">
          <AddFolderIcon
            className={appStyles.addFolderIcon}
            onClick={(e) => {
              e.stopPropagation();
              setOpenTextfieldPopup({
                actionType: "add-folder",
                open: true,
                placeholder1: "Enter Folder Name",
              });
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
                addFolderCallback={() => {
                  setOpenTextfieldPopup({
                    actionType: "add-subfolder",
                    open: true,
                    placeholder1: "Enter Folder Name",
                    folderIndex,
                  });
                }}
                addFileCallback={() => {
                  setOpenTextfieldPopup({
                    actionType: "add-file-in-folder",
                    open: true,
                    placeholder1: "Enter File Name",
                    placeholder2: "Enter Method",
                    folderIndex,
                  });
                }}
                deleteCallback={() => {
                  setOpenConfirmPopup({
                    actionType: "delete-folder",
                    open: true,
                    folderIndex,
                  });
                }}
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
                        addFileCallback={() => {
                          setOpenTextfieldPopup({
                            actionType: "add-file-in-subfolder",
                            open: true,
                            placeholder1: "Enter File Name",
                            placeholder2: "Enter Method",
                            folderIndex,
                            subFolderIndex,
                          });
                        }}
                        deleteCallback={() => {
                          setOpenConfirmPopup({
                            actionType: "delete-subfolder",
                            open: true,
                            folderIndex,
                            subFolderIndex,
                          });
                        }}
                      />

                      {subFolder?.opened &&
                        subFolder?.files?.map((aFileObj, fileIndex) => {
                          return (
                            <FolderOrFileComponent
                              key={aFileObj?.folderName}
                              type="file"
                              fileObj={aFileObj}
                              showActions={["delete"]}
                              deleteCallback={() => {
                                setOpenConfirmPopup({
                                  actionType: "delete-file-from-subfolder",
                                  open: true,
                                  folderIndex,
                                  subFolderIndex,
                                  fileIndex,
                                });
                              }}
                            />
                          );
                        })}
                    </section>
                  );
                })}

              {apiFolder?.opened &&
                apiFolder?.files?.map((aFileObj, fileIndex) => {
                  return (
                    <FolderOrFileComponent
                      key={aFileObj?.folderName}
                      type="file"
                      fileObj={aFileObj}
                      showActions={["delete"]}
                      deleteCallback={() => {
                        setOpenConfirmPopup({
                          actionType: "delete-file-from-folder",
                          open: true,
                          folderIndex,
                          fileIndex,
                        });
                      }}
                    />
                  );
                })}
            </section>
          );
        })}
      </section>
      {/* ************************************************************************************************* */}

      {/* ************************************** POPUPs starts here **************************************** */}
      <TextfieldPopupComponent
        openPopup={openTextfieldPopup?.open}
        setOpenPopup={setOpenTextfieldPopup}
        placeholder1={openTextfieldPopup?.placeholder1}
        placeholder2={openTextfieldPopup?.placeholder2}
        handleSave={(value1, value2) => {
          updateApisTree(
            openTextfieldPopup?.actionType,
            [value1, openTextfieldPopup?.folderIndex],
            [value1, openTextfieldPopup?.subFolderIndex],
            [value1, value2]
          );
        }}
      />

      <ConfirmPopupComponent
        openPopup={openConfirmPopup?.open}
        setOpenPopup={setOpenConfirmPopup}
        confirmText="Delete"
        confirmCallback={() => {
          updateApisTree(
            openConfirmPopup?.actionType,
            [null, openConfirmPopup?.folderIndex],
            [null, openConfirmPopup?.subFolderIndex],
            [null, null, openConfirmPopup?.fileIndex]
          );
        }}
      />
      {/* ************************************************************************************************* */}
    </section>
  );
};

export default tableOfContents;
