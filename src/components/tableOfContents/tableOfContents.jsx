import React, { useState, useEffect } from "react";
import {
  ArrowRight as ArrowRightIcon,
  FolderOutlined as FolderOutlinedIcon,
} from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import { sortArrayOfObjs } from "utils/functions";

// IMPORT ASSETS HERE
import apiList from "assets/apiList.json";
import appStyles from "./tableOfContents.module.scss";

const tableOfContents = () => {
  // HOOKS HERE
  const [sortedApiFolders, setSortedApiFolders] = useState([]);
  const [openReadme, setOpenReadme] = useState(false);

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

  const showApiFolder = (apiObj, subApiObj, subApiIndex) => {
    return (
      <section
        className={appStyles["api-folder"]}
        key={subApiObj ? subApiObj?.folder : apiObj?.folder}
      >
        <ArrowRightIcon
          className={appStyles["arrow-right-icon"]}
          onClick={(e) => {
            e.stopPropagation();
            if (apiObj?.folder === "README") {
              setOpenReadme(!openReadme);
            } else {
              openFolder(apiObj?.folder, subApiObj?.folder, subApiIndex);
            }
          }}
        />
        <FolderOutlinedIcon />
        <span className={appStyles["api-folder-name"]}>
          {subApiObj ? subApiObj?.folder : apiObj?.folder}
        </span>
      </section>
    );
  };

  const showApiFiles = (apiFiles) => {
    return apiFiles?.map((file) => {
      return (
        <div className={appStyles["api-file"]} key={file?.fileName}>
          <span className={appStyles["api-file-method"]}>{file?.method}</span>
          <span className={appStyles["api-file-name"]}>{file?.fileName}</span>
        </div>
      );
    });
  };

  return (
    <section className={appStyles["main-container"]}>
      <div className={appStyles["main-header"]}>Table of contents</div>
      <section className={appStyles["api-folder-wrapper-1"]}>
        {showApiFolder({ folder: "README" })}

        {openReadme &&
          showApiFiles([
            { method: "INFO", fileName: "Success response format" },
            { method: "INFO", fileName: "Error response format" },
          ])}
      </section>

      <section className={appStyles["api-folders"]}>
        {sortedApiFolders?.map((apiFolder, folderIndex) => {
          return (
            <section
              key={apiFolder?.folder}
              className={appStyles["api-folder-wrapper-1"]}
            >
              {showApiFolder(apiFolder)}

              {apiFolder?.opened &&
                apiFolder?.subfolders?.map((subFolder, subFolderIndex) => {
                  return (
                    <section
                      key={subFolder?.folder}
                      className={appStyles["api-folder-wrapper-2"]}
                    >
                      {showApiFolder(apiFolder, subFolder, folderIndex)}

                      {subFolder?.opened && showApiFiles(subFolder?.files)}
                    </section>
                  );
                })}

              {apiFolder?.opened && showApiFiles(apiFolder?.files)}
            </section>
          );
        })}
      </section>
    </section>
  );
};

export default tableOfContents;
