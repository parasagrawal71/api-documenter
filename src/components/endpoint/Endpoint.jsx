import React, { useReducer, useState } from "react";
import { Button } from "@material-ui/core";
import { ArrowRight as ArrowRightIcon } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField } from "utils/commonStyles/styledComponents";
import { capitalizeFirstLetter, prettyPrintJson } from "utils/functions";
import AppTable from "components/appTable/AppTable";

// IMPORT ASSETS HERE
import appStyles from "./Endpoint.module.scss";

const Endpoint = (props) => {
  /* ########################### PROPS HERE ########################### */
  // const {} = props;

  /* ########################### HOOKS HERE ########################### */
  const endpointReducers = (state, action) => {
    let updateArr = [];

    switch (action?.type) {
      case "method":
        return { ...state, method: action?.payload };

      case "path":
        return { ...state, path: action?.payload };

      case "title":
        return { ...state, title: action?.payload };

      case "description":
        return { ...state, description: action?.payload };

      case "parameters":
        updateArr = action?.payload;
        const updatedParameters = state?.parameters?.map((param, index) => {
          if (index === updateArr?.[1]) {
            param[updateArr?.[0]] = updateArr?.[2];
            return param;
          }
          return param;
        });
        updateArr = [];
        return { ...state, parameters: updatedParameters };

      case "requestHeaders":
        updateArr = action?.payload;
        const updatedReqHeaders = state?.requestHeaders?.map(
          (reqHeader, index) => {
            if (index === updateArr?.[1]) {
              reqHeader[updateArr?.[0]] = updateArr?.[2];
              return reqHeader;
            }
            return reqHeader;
          }
        );
        updateArr = [];
        return { ...state, requestHeaders: updatedReqHeaders };

      default:
        throw new Error("Unknown type");
    }
  };
  const [endpoint, dispatchEndpoint] = useReducer(
    endpointReducers,
    props?.endpoint
  );
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openExamples, setOpenExamples] = useState({});

  /* ########################### VARIABLES HERE ########################### */
  const allFields = {
    title: {
      value: endpoint?.title,
      width: "100%",
    },
    method: {
      value: endpoint?.method,
      width: "100px",
    },
    path: {
      value: endpoint?.path,
      width: "calc(100% - 110px)",
    },
    description: {
      value: endpoint?.description,
    },
  };

  const parameterTableHeaders = [
    {
      displayName: "Name",
      key: "name",
    },
    {
      displayName: "Type",
      key: "type",
    },
    {
      displayName: "Style",
      key: "style",
    },
    {
      displayName: "Required",
      key: "required",
    },
    {
      displayName: "Description",
      key: "description",
    },
    {
      displayName: "Value",
      key: "value",
    },
  ];

  const reqHeadTableHeaders = [
    {
      displayName: "Name",
      key: "name",
    },
    {
      displayName: "Required",
      key: "required",
    },
    {
      displayName: "Value",
      key: "value",
    },
  ];

  /* ########################### FUNCTIONS HERE ########################### */
  const TextFieldBoxOrValue = (fieldName, isMultiline) => {
    return addMode || editMode ? (
      <ThemeTextField
        variant="outlined"
        width={allFields?.[fieldName]?.width}
        value={editMode ? allFields?.[fieldName]?.value : ""}
        placeholder={capitalizeFirstLetter(fieldName)}
        multiline={isMultiline === "multiline"}
        onChange={(e) => {
          dispatchEndpoint({
            type: fieldName,
            payload: e?.target?.value,
          });
        }}
        rows={2}
      />
    ) : (
      allFields?.[fieldName]?.value
    );
  };

  const handleEditSaveBtn = () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  };

  const sendApiCall = () => {
    axios
      .request({
        method: endpoint?.method,
        url: endpoint?.path,
      })
      .then((apiResponse) => {
        console.log("apiResponse", apiResponse);
      })
      .catch((apiError) => {
        console.log("apiError", apiError);
      });
  };

  return (
    <section className={appStyles["main-container"]}>
      <section className={appStyles["main-header"]}>
        <div className={appStyles["main-header--left"]}>
          <span className={appStyles.title}>
            {TextFieldBoxOrValue("title")}
          </span>
          <span className={appStyles.updatedAt}>
            Updated At:{" "}
            {moment(endpoint?.updatedAt).format("DD-MM-YYYY hh:mm A")}
          </span>
        </div>
        <div className={appStyles["action-btns"]}>
          <Button variant="outlined" onClick={handleEditSaveBtn}>
            {!editMode ? "Edit" : "Save"}
          </Button>
          {!editMode && (
            <Button variant="outlined" onClick={sendApiCall}>
              Send
            </Button>
          )}
        </div>
      </section>
      <div className={appStyles["method-path"]}>
        <span className={appStyles.method}>
          {TextFieldBoxOrValue("method")}
        </span>
        <span className={appStyles.path}>{TextFieldBoxOrValue("path")}</span>
      </div>
      <div className={appStyles.description}>
        {TextFieldBoxOrValue("description", "multiline")}
      </div>

      {/* ************************************* PARAMETERS starts here ************************************ */}
      <section className={appStyles.parameters}>
        <div className={appStyles.parameters__title}>Parameters</div>
        <AppTable
          tableHeaders={parameterTableHeaders}
          tableRows={endpoint?.parameters}
          arrayKey="parameters"
          dispatchEndpoint={dispatchEndpoint}
          editMode={editMode}
          addMode={addMode}
        />
      </section>
      {/* ************************************************************************************************* */}

      {/* ********************************** REQUEST HEADERS starts here ********************************** */}
      <section className={appStyles["request-headers"]}>
        <div className={appStyles["request-headers__title"]}>Headers</div>
        <AppTable
          tableHeaders={reqHeadTableHeaders}
          tableRows={endpoint?.requestHeaders}
          arrayKey="requestHeaders"
          dispatchEndpoint={dispatchEndpoint}
          editMode={editMode}
          addMode={addMode}
        />
      </section>
      {/* ************************************************************************************************* */}

      {/* *************************** REQUEST and RESPONSE BODY starts here ******************************* */}
      <section className={appStyles["request-response-bodies"]}>
        <section className={appStyles["request-body"]}>
          <div className={appStyles["request-body__title"]}>Request Body</div>
          <div className={appStyles["request-body__json"]}>
            <pre>{prettyPrintJson(endpoint?.requestBody)}</pre>
          </div>
        </section>

        <section className={appStyles["response-body"]}>
          <div className={appStyles["response-body__title"]}>Response Body</div>
          <div className={appStyles["response-body__json"]}>
            <pre>{prettyPrintJson(endpoint?.responseBody)}</pre>
          </div>
        </section>
      </section>
      {/* ************************************************************************************************* */}

      {/* ************************************** EXAMPLES starts here ************************************* */}
      <section className={appStyles["examples-cnt"]}>
        {endpoint?.examples?.map((example, exampleIndex) => {
          return (
            <section key={exampleIndex} className={appStyles["example-cnt"]}>
              <section
                className={appStyles["example-row"]}
                role="button"
                tabIndex="0"
                onKeyDown={() => {}}
                onClick={() => {
                  console.log(!openExamples?.[exampleIndex]);
                  setOpenExamples({
                    ...openExamples,
                    [exampleIndex]: !openExamples?.[exampleIndex],
                  });
                }}
              >
                <span>
                  <ArrowRightIcon style={{ padding: 0 }} />
                </span>
                <span>Example {exampleIndex + 1}:&nbsp;&nbsp;</span>
                <span>{example?.title}</span>
              </section>

              {openExamples?.[exampleIndex] && (
                <section
                  className={appStyles["example-request-response-bodies"]}
                >
                  <section className={appStyles["example-request-body"]}>
                    <div className={appStyles["example-request-body__title"]}>
                      Request Body
                    </div>
                    <div className={appStyles["example-request-body__json"]}>
                      <pre>{prettyPrintJson(endpoint?.requestBody)}</pre>
                    </div>
                  </section>

                  <section className={appStyles["example-response-body"]}>
                    <div className={appStyles["example-response-body__title"]}>
                      Response Body
                    </div>
                    <div className={appStyles["example-response-body__json"]}>
                      <pre>{prettyPrintJson(endpoint?.responseBody)}</pre>
                    </div>
                  </section>
                </section>
              )}
            </section>
          );
        })}
      </section>
      {/* ************************************************************************************************* */}
    </section>
  );
};

export default Endpoint;
