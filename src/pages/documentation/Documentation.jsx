import React, { useState, useEffect } from "react";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";
import HeaderComponent from "components/header/Header";
import TableOfContentsComponent from "components/tableOfContents/tableOfContents";
import ModelComponent from "components/model/Model";
import ReadmeComponent from "components/readme/Readme";
import apiService from "apis/apiService";
import { readme, schema, apisTree } from "apis/urls";
import { sortArrayOfObjs } from "utils/functions";

// IMPORT ASSETS HERE
// import endpoints from "assets/endpoints.json"; // TODO: REMOVE LATER
import environments from "assets/environments.json";
import appStyles from "./Documentation.module.scss";

const Documentation = () => {
  // HOOKS HERE
  const [selectedEnv, setSelectedEnv] = useState({});
  const [models, setModels] = useState([]);
  const [readmeFiles, setReadmeFiles] = useState([]);
  const [sortedApisTree, setSortedApisTree] = useState([]);
  const [endpoints, setEndpoints] = useState([]);

  useEffect(() => {
    setSelectedEnv(environments[0]);

    fetchModels();
    fetchReadmeFiles();
    fetchApisTree();
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
      const sortedApisTreeTemp = sortArrayOfObjs(response?.data, "folderName");
      setSortedApisTree(sortedApisTreeTemp);
    }
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
            setSortedApisTree={setSortedApisTree}
          />
        </section>
        <section className={appStyles["content-cnt--right"]}>
          {/* {readmeFiles?.length ? (
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
          ) : null} */}

          {endpoints?.length ? (
            <section className={appStyles["endpoints-cnt"]}>
              <div id="endpoints" className={appStyles.title}>
                Endpoints
              </div>
              {endpoints?.map((endpoint) => {
                return <EndpointComponent endpoint={endpoint} key={endpoint?.title} selectedEnv={selectedEnv} />;
              })}
            </section>
          ) : null}
        </section>
      </section>
    </section>
  );
};

export default Documentation;
