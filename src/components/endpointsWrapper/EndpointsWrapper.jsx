import React from "react";
import cx from "classnames";
import { FolderOutlined as FolderIcon } from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";
import apiService from "apis/apiService";
import { apisTree } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./EndpointsWrapper.module.scss";

const EndpointsWrapper = (props) => {
  // PROPS HERE
  const { selectedEnv, sortedApisTree, updateSortedApisTree, enableEditMode, setEnableEditMode } = props;

  const updateFolderInApisTree = async (updatedApisTree, folderIndex) => {
    const updatedFolderObj = updatedApisTree?.[folderIndex];
    const response = await apiService(apisTree(updatedFolderObj?._id).put, updatedFolderObj);
    if (response?.success) {
      updateSortedApisTree(updatedApisTree);
    } else {
      //
    }
  };

  return sortedApisTree?.length ? (
    <section className={appStyles["endpoints-inner-cnt"]}>
      {sortedApisTree?.map((apiFolder, folderIndex) => {
        return (
          <section key={folderIndex}>
            <span id={apiFolder?.folderName} className="scroll-target">
              &nbsp;
            </span>
            <div className={cx(appStyles["main-folder-cnt"])}>
              <FolderIcon className={appStyles.folderIcon} />
              <span className={cx(appStyles["main-folder-name"])}>{apiFolder?.folderName}</span>
            </div>

            {apiFolder?.subfolders?.map((subFolder, subFolderIndex) => {
              return (
                <section key={subFolderIndex}>
                  <span id={subFolder?.folderName} className="scroll-target">
                    &nbsp;
                  </span>
                  <div className={cx(appStyles["subfolder-name"])}>{subFolder?.folderName}</div>
                  {subFolder?.files?.map((aFileObj, fileIndex) => {
                    return (
                      <EndpointComponent
                        key={fileIndex}
                        endpointMongoId={aFileObj?.endpointMID}
                        selectedEnv={selectedEnv}
                        updateApisTree={(fileName, method) => {
                          if (sortedApisTree?.[folderIndex]?.subfolders?.[subFolderIndex]?.files?.[fileIndex]) {
                            sortedApisTree[folderIndex].subfolders[subFolderIndex].files[fileIndex].fileName = fileName;
                            sortedApisTree[folderIndex].subfolders[subFolderIndex].files[fileIndex].method = method;
                          }
                          updateSortedApisTree([...sortedApisTree]);
                          updateFolderInApisTree(sortedApisTree, folderIndex);
                        }}
                        enableEditMode={enableEditMode}
                        setEnableEditMode={setEnableEditMode}
                      />
                    );
                  })}
                </section>
              );
            })}

            {apiFolder?.files?.map((aFileObj, fileIndex) => {
              return (
                <div key={fileIndex}>
                  <span>&nbsp;</span>
                  <EndpointComponent
                    endpointMongoId={aFileObj?.endpointMID}
                    selectedEnv={selectedEnv}
                    updateApisTree={(fileName, method) => {
                      if (sortedApisTree?.[folderIndex].files?.[fileIndex]) {
                        sortedApisTree[folderIndex].files[fileIndex].fileName = fileName;
                        sortedApisTree[folderIndex].files[fileIndex].method = method;
                      }
                      updateSortedApisTree([...sortedApisTree]);
                      updateFolderInApisTree(sortedApisTree, folderIndex);
                    }}
                    enableEditMode={enableEditMode}
                    setEnableEditMode={setEnableEditMode}
                  />
                </div>
              );
            })}
          </section>
        );
      })}
    </section>
  ) : (
    <div className={cx("zero-state-msg", appStyles["endpoints-zero-state"])}>No APIs added yet</div>
  );
};

export default EndpointsWrapper;
