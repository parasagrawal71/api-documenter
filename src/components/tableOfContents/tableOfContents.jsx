import React, { useState, useEffect } from "react";
import {
  ArrowRight as ArrowRightIcon,
  FolderOutlined as FolderOutlinedIcon,
} from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import { sortObjectKeys } from "utils/functions";

// IMPORT ASSETS HERE
import apiList from "assets/apiList.json";
import appStyles from "./tableOfContents.module.scss";

const tableOfContents = () => {
  // HOOKS HERE
  const [sortedApiKeys, setSortedApiKeys] = useState([]);

  useEffect(() => {
    const sortedKeys = sortObjectKeys(apiList);
    setSortedApiKeys(sortedKeys);
  }, []);

  return (
    <section className={appStyles["main-container"]}>
      <div className={appStyles["main-header"]}>Table of contents</div>
      <section className={appStyles["api-folder"]}>
        <ArrowRightIcon />
        <FolderOutlinedIcon />
        <span className={appStyles["api-folder-name"]}>Readme</span>
      </section>
      <section className={appStyles["api-folders"]}>
        {sortedApiKeys?.map((api) => {
          return (
            <section className={appStyles["api-folder"]} key={api}>
              <ArrowRightIcon />
              <FolderOutlinedIcon />
              <span className={appStyles["api-folder-name"]}>{api}</span>
            </section>
          );
        })}
      </section>
    </section>
  );
};

export default tableOfContents;
