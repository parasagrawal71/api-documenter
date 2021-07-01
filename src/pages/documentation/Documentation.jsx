import React, { useState, useEffect } from "react";
import { Tooltip } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import TableOfContentsComponent from "components/tableOfContents/tableOfContents";
import ModelComponent from "components/model/Model";
import ReadmeComponent from "components/readme/Readme";
import EndpointsWrapperComponent from "components/endpointsWrapper/EndpointsWrapper";
import apiService from "apis/apiService";
import { readme, schema, apisTree } from "apis/urls";
import { getUrlParams, sortArrayOfObjs } from "utils/functions";
import { ThemeSwitch } from "utils/commonStyles/StyledComponents";
import useGlobal from "redux/globalHook";

// IMPORT ASSETS HERE
import environments from "assets/environments.json";
import appStyles from "./Documentation.module.scss";

const Documentation = () => {
  // HOOKS HERE
  const [selectedEnv, setSelectedEnv] = useState({});
  const [models, setModels] = useState([]);
  const [readmeFiles, setReadmeFiles] = useState([]);
  const [sortedApisTree, setSortedApisTree] = useState([]);
  const [enableEditMode, setEnableEditMode] = useState(false);
  const [globalState] = useGlobal();

  useEffect(() => {
    setSelectedEnv(environments[0]);

    // fetchModels();
    // fetchReadmeFiles();
    fetchApisTree();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchModels = async () => {
    const response = await apiService(schema().getAll);
    if (response?.success) {
      setModels(response?.data);
    }
  };

  const fetchReadmeFiles = async () => {
    const response = await apiService(readme().getAll);
    if (response?.success) {
      setReadmeFiles(response?.data);
    }
  };

  const fetchApisTree = async () => {
    const response = await apiService(apisTree().getAll);
    if (response?.success) {
      updateSortedApisTree(response?.data);
    }
  };

  const updateSortedApisTree = (updatedValue) => {
    const sortedApisTreeTemp = sortArrayOfObjs(updatedValue, "folderName");
    setSortedApisTree(sortedApisTreeTemp);
  };

  return (
    <section className={appStyles["main-container"]}>
      <HeaderComponent selectedEnv={selectedEnv} setSelectedEnv={setSelectedEnv} />
      <section className={appStyles["content-cnt"]}>
        <section className={appStyles["table-of-contents"]}>
          <TableOfContentsComponent
            models={models}
            setModels={setModels}
            readmeFiles={readmeFiles}
            setReadmeFiles={setReadmeFiles}
            sortedApisTree={sortedApisTree}
            updateSortedApisTree={updateSortedApisTree}
            enableEditMode={
              globalState?.loggedInUser?.editAccess?.includes?.(getUrlParams?.()?.serviceName) && enableEditMode
            }
          />
        </section>
        <section className={appStyles["content-cnt--right"]}>
          {readmeFiles?.length ? (
            <section className={appStyles["readme-cnt"]}>
              <div id="readme" className={appStyles.title}>
                Readme
              </div>
              {readmeFiles?.map((readmeFile, index) => {
                return <ReadmeComponent key={index} readmeFile={readmeFile} />;
              })}
            </section>
          ) : null}

          {models?.length ? (
            <section className={appStyles["models-cnt"]}>
              <div id="models" className={appStyles.title}>
                Models
              </div>
              {models?.map((model, index) => {
                return <ModelComponent key={index} model={model} />;
              })}
            </section>
          ) : null}

          <section className={appStyles["endpoints-cnt"]}>
            <div id="endpoints" className={appStyles.title}>
              <div>APIs</div>
              <div className={appStyles["title--right"]}>
                {globalState?.loggedInUser?.editAccess?.includes?.(getUrlParams?.()?.serviceName) && (
                  <Tooltip title={enableEditMode ? "Edit Mode" : "View Mode"}>
                    <ThemeSwitch
                      checked={enableEditMode}
                      onChange={(e) => {
                        setEnableEditMode(e?.target.checked);
                      }}
                      className={appStyles["mode-switch"]}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
            <EndpointsWrapperComponent
              selectedEnv={selectedEnv}
              sortedApisTree={sortedApisTree}
              updateSortedApisTree={updateSortedApisTree}
              enableEditMode={enableEditMode}
              setEnableEditMode={setEnableEditMode}
            />
          </section>
        </section>
      </section>
    </section>
  );
};

export default Documentation;
