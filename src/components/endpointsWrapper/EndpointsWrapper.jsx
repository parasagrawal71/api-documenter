import React from "react";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";

// IMPORT ASSETS HERE
import appStyles from "./EndpointsWrapper.module.scss";

const EndpointsWrapper = (props) => {
  // PROPS HERE
  const { selectedEnv, sortedApisTree, setSortedApisTree } = props;

  return (
    <section className={appStyles["endpoint-inner-cnt"]}>
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
                      />
                    );
                  })}
                </section>
              );
            })}

            {apiFolder?.files?.map((aFileObj, fileIndex) => {
              return (
                <EndpointComponent key={fileIndex} endpointMongoId={aFileObj?.endpointMID} selectedEnv={selectedEnv} />
              );
            })}
          </section>
        );
      })}
    </section>
  );
};

export default EndpointsWrapper;
