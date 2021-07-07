import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";
import { CreateNewFolderOutlined as AddFolderIcon } from "@material-ui/icons";
import cx from "classnames";
import { toast } from "react-toastify";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

// IMPORT USER-DEFINED COMPONENTS HERE
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import FolderOrFileComponent from "components/folderOrFile/FolderOrFile";
import ConfirmPopupComponent from "components/confirmPopup/ConfirmPopup";
import { arrayMove, getUrlParams } from "utils/functions";
import apiService from "apis/apiService";
import { readme, schema, apisTree, endpointUrl } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./tableOfContents.module.scss";

const tableOfContents = (props) => {
  // PROPS HERE
  const { models, setModels, readmeFiles, setReadmeFiles, sortedApisTree, updateSortedApisTree, enableEditMode } =
    props;

  // VARIABLES HERE
  const serviceMID = getUrlParams()?.serviceMID;

  // HOOKS HERE
  const [openReadme, setOpenReadme] = useState(false);
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
    folderObj: {},
    subFolderObj: {},
    fileObj: {},
  });

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
    updateSortedApisTree(updatedFolders);
  };

  const updateApisTree = async (actionType, folder, subFolder, file) => {
    const [folderName, folderIndex] = folder || [];
    const [subFolderName, subFolderIndex] = subFolder || [];
    const [fileName, method, fileIndex] = file || [];
    let response = null;
    let newEndpoint = null;

    switch (actionType) {
      case "add-folder":
        response = await apiService(apisTree().post, {
          folderName,
          serviceMID,
        });
        if (response?.success) {
          const updatedTreeAfterAddingFolder = [...sortedApisTree];
          updatedTreeAfterAddingFolder.push(response?.data);
          updateSortedApisTree(updatedTreeAfterAddingFolder);
        } else {
          //
        }
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
        await updateFolderInApisTree(updatedTreeAfterAddingSubFolder, folderIndex);
        break;

      case "add-file-in-folder":
        newEndpoint = await createEndpoint(fileName, method);
        const updatedTreeAfterAddingFileInFolder = [...sortedApisTree];
        if (updatedTreeAfterAddingFileInFolder?.[folderIndex]?.files) {
          updatedTreeAfterAddingFileInFolder?.[folderIndex]?.files?.push({
            method: method.toUpperCase(),
            fileName,
            endpointMID: newEndpoint?._id,
          });
        } else {
          updatedTreeAfterAddingFileInFolder[folderIndex].files = [];
          updatedTreeAfterAddingFileInFolder?.[folderIndex]?.files?.push({
            method: method.toUpperCase(),
            fileName,
            endpointMID: newEndpoint?._id,
          });
        }
        await updateFolderInApisTree(updatedTreeAfterAddingFileInFolder, folderIndex);
        break;

      case "add-file-in-subfolder":
        newEndpoint = await createEndpoint(fileName, method);
        const updatedTreeAfterAddingFileInSubFolder = [...sortedApisTree];
        if (updatedTreeAfterAddingFileInSubFolder?.[folderIndex]?.subfolders?.[subFolderIndex]?.files) {
          updatedTreeAfterAddingFileInSubFolder?.[folderIndex]?.subfolders?.[subFolderIndex]?.files?.push({
            method: method.toUpperCase(),
            fileName,
            endpointMID: newEndpoint?._id,
          });
        } else {
          updatedTreeAfterAddingFileInSubFolder[folderIndex].subfolders[subFolderIndex].files = [];
          updatedTreeAfterAddingFileInSubFolder?.[folderIndex]?.subfolders?.[subFolderIndex]?.files?.push({
            method: method.toUpperCase(),
            fileName,
            endpointMID: newEndpoint?._id,
          });
        }
        await updateFolderInApisTree(updatedTreeAfterAddingFileInSubFolder, folderIndex);
        break;

      case "delete-folder":
        const updatedTreeAfterFolderDeletion = [...sortedApisTree];
        deleteMultipleEndpoints(updatedTreeAfterFolderDeletion?.[folderIndex]?.files?.map((f) => f?.endpointMID));
        response = await apiService(apisTree(updatedTreeAfterFolderDeletion?.[folderIndex]?._id).delete);
        if (response?.success) {
          updatedTreeAfterFolderDeletion.splice(folderIndex, 1);
          updateSortedApisTree(updatedTreeAfterFolderDeletion);
        } else {
          //
        }
        break;

      case "delete-subfolder":
        const updatedTreeAfterSubFolderDeletion = [...sortedApisTree];
        deleteMultipleEndpoints(
          updatedTreeAfterSubFolderDeletion?.[folderIndex]?.subfolders?.[subFolderIndex]?.files?.map(
            (f) => f?.endpointMID
          )
        );
        updatedTreeAfterSubFolderDeletion?.[folderIndex]?.subfolders?.splice(subFolderIndex, 1);
        await updateFolderInApisTree(updatedTreeAfterSubFolderDeletion, folderIndex);
        break;

      case "delete-file-from-folder":
        const updatedTreeAfterFileDeletionInFolder = [...sortedApisTree];
        deleteEndpoint(updatedTreeAfterFileDeletionInFolder?.[folderIndex]?.files?.[fileIndex]?.endpointMID);
        updatedTreeAfterFileDeletionInFolder?.[folderIndex]?.files?.splice(fileIndex, 1);
        await updateFolderInApisTree(updatedTreeAfterFileDeletionInFolder, folderIndex);
        break;

      case "delete-file-from-subfolder":
        const updatedTreeAfterSubFileDeletionInFolder = [...sortedApisTree];
        deleteEndpoint(
          updatedTreeAfterSubFileDeletionInFolder?.[folderIndex]?.subfolders?.[subFolderIndex]?.files?.[fileIndex]
            ?.endpointMID
        );
        updatedTreeAfterSubFileDeletionInFolder?.[folderIndex]?.subfolders?.[subFolderIndex]?.files?.splice(
          fileIndex,
          1
        );
        await updateFolderInApisTree(updatedTreeAfterSubFileDeletionInFolder, folderIndex);
        break;

      case "add-readme-file":
        response = await apiService(readme().post, {
          fileName,
          serviceMID,
        });
        if (response?.success) {
          const updatedReadmeFiles = [...readmeFiles];
          updatedReadmeFiles?.push(response?.data);
          setReadmeFiles(updatedReadmeFiles);
        } else {
          //
        }
        break;

      case "delete-readme-file":
        response = await apiService(readme(openConfirmPopup?.fileObj?._id).delete);
        if (response?.success) {
          const updatedReadmeFilesAfterDeletion = [...readmeFiles];
          updatedReadmeFilesAfterDeletion?.splice(fileIndex, 1);
          setReadmeFiles(updatedReadmeFilesAfterDeletion);
        } else {
          //
        }
        break;

      case "add-model":
        response = await apiService(schema().post, {
          fileName,
          serviceMID,
        });

        if (response?.success) {
          const updatedModels = [...models];
          updatedModels?.push(response?.data);
          setModels(updatedModels);
        } else {
          //
        }
        break;

      case "delete-model":
        response = await apiService(schema(openConfirmPopup?.fileObj?._id).delete);
        if (response?.success) {
          const updatedModelsAfterDeletion = [...models];
          updatedModelsAfterDeletion?.splice(fileIndex, 1);
          setModels(updatedModelsAfterDeletion);
        } else {
          //
        }
        break;

      default:
        return new Error("Invalid action");
    }
    response = null;
  };

  const updateFolderInApisTree = async (updatedApisTree, folderIndex) => {
    const updatedFolderObj = updatedApisTree?.[folderIndex];
    const response = await apiService(apisTree(updatedFolderObj?._id).put, updatedFolderObj);
    if (response?.success) {
      updateSortedApisTree(updatedApisTree);
    } else {
      //
    }
  };

  const createEndpoint = async (fileName, method) => {
    const response = await apiService(endpointUrl().post, {
      title: fileName,
      method,
      serviceMID,
    });
    if (response?.success) {
      return response?.data;
    } else {
      toast.error("Couldn't create api");
      toast.clearWaitingQueue();
    }
  };

  const deleteEndpoint = async (mongoId) => {
    const response = await apiService(endpointUrl(mongoId).delete);
    if (response?.success) {
      return response?.data;
    }
  };

  const deleteMultipleEndpoints = async (mongoIds) => {
    const response = await apiService(endpointUrl().deleteMultiple, null, { params: { mongoIds } });
    if (response?.success) {
      return response?.data;
    }
  };

  /*  *************************************************** MAIN FOLDER's DRAGGABLE FILES  ******************************************************* */
  const handleOnSortMainFolderFilesEnd = (data, event, folderIndex) => {
    const { oldIndex, newIndex } = data;
    const currentFiles = sortedApisTree?.[folderIndex]?.files;
    sortedApisTree[folderIndex].files = arrayMove(currentFiles, oldIndex, newIndex);
    updateSortedApisTree([...sortedApisTree]);
    updateFolderInApisTree([...sortedApisTree], folderIndex);
  };

  const MainFolderFileRow = ({ aFileObj, folderIndex, fileIndex }) => {
    return (
      <FolderOrFileComponent
        key={fileIndex}
        type="file"
        fileObj={aFileObj}
        showActions={["delete"]}
        deleteCallback={() => {
          setOpenConfirmPopup({
            actionType: "delete-file-from-folder",
            open: true,
            folderIndex,
            fileIndex,
            fileObj: aFileObj,
          });
        }}
        href={aFileObj?.fileName}
        enableEditMode={enableEditMode}
      />
    );
  };

  const MainFolderFileSortableItem = SortableElement((subProps) => <MainFolderFileRow {...subProps} />);
  /*  ****************************************************************************************************************************************** */

  /*  **************************************************** SUB FOLDER's DRAGGABLE FILES  ******************************************************* */
  const handleOnSortSubFolderFilesEnd = (data, event, folderIndex, subFolderIndex) => {
    const { oldIndex, newIndex } = data;
    const currentFiles = sortedApisTree?.[folderIndex]?.subfolders?.[subFolderIndex]?.files;
    sortedApisTree[folderIndex].subfolders[subFolderIndex].files = arrayMove(currentFiles, oldIndex, newIndex);
    updateSortedApisTree([...sortedApisTree]);
    updateFolderInApisTree([...sortedApisTree], folderIndex);
  };

  const SubFolderFileRow = ({ aFileObj, folderIndex, subFolderIndex, fileIndex }) => {
    return (
      <FolderOrFileComponent
        key={fileIndex}
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
            fileObj: aFileObj,
          });
        }}
        href={aFileObj?.fileName}
        enableEditMode={enableEditMode}
      />
    );
  };

  const SubFolderFileSortableItem = SortableElement((subProps) => <SubFolderFileRow {...subProps} />);
  /*  ****************************************************************************************************************************************** */

  /*  ******************************************************** DRAGGABLE SUB FOLDERS  ********************************************************** */
  const handleOnSortSubFoldersEnd = (data, event, folderIndex) => {
    const { oldIndex, newIndex } = data;
    const currentSubfolders = sortedApisTree?.[folderIndex]?.subfolders;
    sortedApisTree[folderIndex].subfolders = arrayMove(currentSubfolders, oldIndex, newIndex);
    updateSortedApisTree([...sortedApisTree]);
    updateFolderInApisTree([...sortedApisTree], folderIndex);
  };

  const SubFolderRow = ({ apiFolder, subFolder, folderIndex, subFolderIndex }) => {
    return (
      <section key={subFolderIndex} className={appStyles["subfolder-wrapper"]}>
        <FolderOrFileComponent
          type="folder"
          isFolderOpen={subFolder?.opened}
          toggleFolder={() => {
            openCloseFolder(apiFolder?.folderName, subFolder?.folderName, folderIndex);
          }}
          folderObj={subFolder}
          showActions={["addFile", "delete"]}
          addFileText="Add Request"
          addFileCallback={() => {
            setOpenTextfieldPopup({
              actionType: "add-file-in-subfolder",
              open: true,
              placeholder1: "Enter Request Name",
              placeholder2: "Select Method",
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
              subFolderObj: subFolder,
            });
          }}
          href={subFolder?.folderName}
          enableEditMode={enableEditMode}
        />

        <SortableCont
          onSortEnd={(data, event) => handleOnSortSubFolderFilesEnd(data, event, folderIndex, subFolderIndex)}
          axis="y"
          lockAxis="y"
          lockToContainerEdges
          lockOffset={["30%", "50%"]}
          useDragHandle
        >
          {subFolder?.opened &&
            subFolder?.files?.map((aFileObj, fileIndex) => {
              return (
                <SubFolderFileSortableItem
                  key={`item-${fileIndex}`}
                  index={fileIndex}
                  aFileObj={aFileObj}
                  folderIndex={folderIndex}
                  subFolderIndex={subFolderIndex}
                  fileIndex={fileIndex}
                />
              );
            })}
        </SortableCont>
      </section>
    );
  };

  const SubFolderSortableItem = SortableElement((subProps) => <SubFolderRow {...subProps} />);
  /*  ****************************************************************************************************************************************** */

  const SortableCont = SortableContainer(({ children }) => {
    return <section>{children}</section>;
  });

  return (
    <section className={appStyles["main-container"]}>
      {/* <div className={appStyles["main-header"]}>
        <span>Table of contents</span>
      </div> */}

      {/* ************************************** README starts here **************************************** */}
      {/* <section className={appStyles["folder-wrapper"]}>
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
          href="readme"
          enableEditMode={enableEditMode}
        />

        {openReadme &&
          (readmeFiles?.length ? (
            readmeFiles?.map((aFileObj, aFileIndex) => {
              return (
                <FolderOrFileComponent
                  key={aFileIndex}
                  type="file"
                  fileObj={aFileObj}
                  showActions={["delete"]}
                  deleteCallback={() => {
                    setOpenConfirmPopup({
                      actionType: "delete-readme-file",
                      open: true,
                      fileIndex: aFileIndex,
                      fileObj: aFileObj,
                    });
                  }}
                  href={aFileObj?.fileName}
                  enableEditMode={enableEditMode}
                />
              );
            })
          ) : (
            <div className="zero-state-msg">No files added</div>
          ))}
      </section> */}
      {/* ************************************************************************************************* */}

      {/* ************************************** MODELS starts here **************************************** */}
      {/* <section className={cx(appStyles["folder-wrapper"], appStyles["model-wrapper"])}>
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
          href="models"
          enableEditMode={enableEditMode}
        />

        {openModels &&
          (models?.length ? (
            models?.map((aFileObj, aFileIndex) => {
              return (
                <FolderOrFileComponent
                  key={aFileIndex}
                  type="file"
                  fileObj={aFileObj}
                  showActions={["delete"]}
                  deleteCallback={() => {
                    setOpenConfirmPopup({
                      actionType: "delete-model",
                      open: true,
                      fileIndex: aFileIndex,
                      fileObj: aFileObj,
                    });
                  }}
                  href={aFileObj?.fileName}
                  enableEditMode={enableEditMode}
                />
              );
            })
          ) : (
            <div className="zero-state-msg">No model added</div>
          ))}
      </section> */}
      {/* ************************************************************************************************* */}

      <div className={appStyles["sub-header"]}>
        <span>APIs</span>
        <Tooltip title="Add Folder">
          <AddFolderIcon
            className={cx(appStyles.addFolderIcon, { visibilityHidden: !enableEditMode })}
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
      {sortedApisTree?.length ? (
        <section className={appStyles["api-folders"]}>
          {sortedApisTree?.map((apiFolder, folderIndex) => {
            return (
              <section className={appStyles["folder-wrapper"]} key={folderIndex}>
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
                      placeholder1: "Enter Request Name",
                      placeholder2: "Select Method",
                      folderIndex,
                    });
                  }}
                  deleteCallback={() => {
                    setOpenConfirmPopup({
                      actionType: "delete-folder",
                      open: true,
                      folderIndex,
                      folderObj: apiFolder,
                    });
                  }}
                  href={apiFolder?.folderName}
                  enableEditMode={enableEditMode}
                />

                <SortableCont
                  onSortEnd={(data, event) => handleOnSortSubFoldersEnd(data, event, folderIndex)}
                  axis="y"
                  lockAxis="y"
                  lockToContainerEdges
                  lockOffset={["30%", "50%"]}
                  useDragHandle
                >
                  {apiFolder?.opened &&
                    apiFolder?.subfolders?.map((subFolder, subFolderIndex) => {
                      return (
                        <SubFolderSortableItem
                          key={`item-${subFolderIndex}`}
                          index={subFolderIndex}
                          apiFolder={apiFolder}
                          subFolder={subFolder}
                          folderIndex={folderIndex}
                          subFolderIndex={subFolderIndex}
                        />
                      );
                    })}
                </SortableCont>

                <SortableCont
                  onSortEnd={(data, event) => handleOnSortMainFolderFilesEnd(data, event, folderIndex)}
                  axis="y"
                  lockAxis="y"
                  lockToContainerEdges
                  lockOffset={["30%", "50%"]}
                  useDragHandle
                >
                  {apiFolder?.opened &&
                    apiFolder?.files?.map((aFileObj, fileIndex) => {
                      return (
                        <MainFolderFileSortableItem
                          key={`item-${fileIndex}`}
                          index={fileIndex}
                          aFileObj={aFileObj}
                          folderIndex={folderIndex}
                          fileIndex={fileIndex}
                        />
                      );
                    })}
                </SortableCont>
              </section>
            );
          })}
        </section>
      ) : (
        <div className="zero-state-msg">No apis added</div>
      )}
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
