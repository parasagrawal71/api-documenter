import React, { useState, useEffect } from "react";
import { Tooltip, ClickAwayListener } from "@material-ui/core";
import { toast } from "react-toastify";
import { ListAlt as ListAltIcon } from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import TableOfContentsComponent from "components/tableOfContents/tableOfContents";
import ModelComponent from "components/model/Model";
import ReadmeComponent from "components/readme/Readme";
import EndpointsWrapperComponent from "components/endpointsWrapper/EndpointsWrapper";
import apiService from "apis/apiService";
import { readme, schema, apisTree, environment } from "apis/urls";
import { getUrlParams, sortArrayOfObjs } from "utils/functions";
import { ThemeSwitch, ThemeAutocomplete, ThemeTextField } from "utils/commonStyles/StyledComponents";
import useGlobal from "redux/globalHook";
import EnvPopoverComponent from "components/envPopover/EnvPopover";

// IMPORT ASSETS HERE
import appStyles from "./Documentation.module.scss";

const Documentation = (props) => {
  // VARIABLES HERE
  const serviceMID = getUrlParams()?.serviceMID;

  // HOOKS HERE
  const [selectedEnv, setSelectedEnv] = useState({});
  const [models, setModels] = useState([]);
  const [readmeFiles, setReadmeFiles] = useState([]);
  const [sortedApisTree, setSortedApisTree] = useState([]);
  const [enableEditMode, setEnableEditMode] = useState(false);
  const [globalState] = useGlobal();
  const [environments, setEnvironments] = useState([]);
  const [openEnvPopover, setOpenEnvPopover] = useState(null);
  const [selectedEnvOldData, setSelectedEnvOldData] = useState(null);

  useEffect(() => {
    // fetchModels();
    // fetchReadmeFiles();
    fetchApisTree();
    getEnvironments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updatedEnvironments = environments?.map((env) => {
      if (env?._id === selectedEnv?._id) {
        return selectedEnv;
      }

      return env;
    });
    setEnvironments(updatedEnvironments);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEnv]);

  const getEnvironments = async () => {
    const response = await apiService(environment().getAll);
    if (response?.success) {
      setEnvironments(response?.data);
      setSelectedEnv(response?.data?.[0]);
    }
  };

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

  const createEnvironment = async (reqBody) => {
    const response = await apiService(environment().post, { ...reqBody, serviceMID });
    if (response?.success) {
      // setEnvironments(); response?.data
    }
  };

  const editEnvironment = async (updatedEnvironment) => {
    const response = await apiService(environment(updatedEnvironment?._id).put, updatedEnvironment);
    if (response?.success) {
      setSelectedEnvOldData({});
    } else {
      setSelectedEnv(selectedEnvOldData);
      toast.error("Couldn't update environment!");
      toast.clearWaitingQueue();
    }
  };

  const deleteEnvironment = async (mongoId) => {
    const response = await apiService(environment(mongoId).delete);
    if (response?.success) {
      // setEnvironments(); response?.data
    }
  };

  const toggleOpenEnvPopover = (event) => {
    setOpenEnvPopover(openEnvPopover ? null : event?.currentTarget);
  };

  const handleCloseEnvPopover = () => {
    if (openEnvPopover) {
      editEnvironment(selectedEnv);
    }
    setOpenEnvPopover(null);
  };

  return (
    <section className={appStyles["main-container"]}>
      <HeaderComponent />
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
                <div className={appStyles.title__envs}>
                  <div className={appStyles["title__envs-dropdown"]}>
                    <ThemeAutocomplete
                      options={environments}
                      getOptionLabel={(option) => option?.envName || ""}
                      customStyle={{ width: "250px", padding: 0 }}
                      renderInput={(params) => (
                        <ThemeTextField
                          {...params}
                          InputLabelProps={{
                            focused: false,
                          }}
                        />
                      )}
                      onChange={(e, selectedOption) => {
                        setSelectedEnv(selectedOption);
                      }}
                      value={selectedEnv || ""}
                    />
                  </div>
                  <ClickAwayListener onClickAway={handleCloseEnvPopover}>
                    <div className={appStyles["title__edit-env"]}>
                      <ListAltIcon className={appStyles["title__edit-env__icon"]} onClick={toggleOpenEnvPopover} />
                      <EnvPopoverComponent
                        openEnvPopover={openEnvPopover}
                        handleCloseEnvPopover={handleCloseEnvPopover}
                        selectedEnv={selectedEnv}
                        setSelectedEnv={setSelectedEnv}
                        selectedEnvOldData={selectedEnvOldData}
                        setSelectedEnvOldData={setSelectedEnvOldData}
                      />
                    </div>
                  </ClickAwayListener>
                </div>

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
