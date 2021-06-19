import React from "react";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";

// IMPORT ASSETS HERE
import appStyles from "./EndpointsWrapper.module.scss";

const EndpointsWrapper = (props) => {
  // PROPS HERE
  const { selectedEnv, sortedApisTree, setSortedApisTree } = props;

  return sortedApisTree?.length ? (
    <section className={appStyles["endpoints-inner-cnt"]}>
      {sortedApisTree?.map((apiFolder, folderIndex) => {
        return (
          <section key={folderIndex}>
            {apiFolder?.folderName}

            {apiFolder?.subfolders?.map((subFolder, subFolderIndex) => {
              return (
                <section key={subFolderIndex}>
                  {subFolder?.folderName}

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
                          setSortedApisTree([...sortedApisTree]);
                        }}
                      />
                    );
                  })}
                </section>
              );
            })}

            {apiFolder?.files?.map((aFileObj, fileIndex) => {
              return (
                <EndpointComponent
                  key={fileIndex}
                  endpointMongoId={aFileObj?.endpointMID}
                  selectedEnv={selectedEnv}
                  updateApisTree={(fileName, method) => {
                    if (sortedApisTree?.[folderIndex].files?.[fileIndex]) {
                      sortedApisTree[folderIndex].files[fileIndex].fileName = fileName;
                      sortedApisTree[folderIndex].files[fileIndex].method = method;
                    }
                    setSortedApisTree([...sortedApisTree]);
                  }}
                />
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
