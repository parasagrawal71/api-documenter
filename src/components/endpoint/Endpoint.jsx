import React, { useReducer, useState, useEffect, useRef } from "react";
import { Button } from "@material-ui/core";
import { ArrowRight as ArrowRightIcon } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField } from "utils/commonStyles/styledComponents";
import {
  capitalizeFirstLetter,
  getStatusText,
  prettyPrintJson,
} from "utils/functions";
import AppTableComponent from "components/appTable/AppTable";
import PopupComponent from "components/popup/Popup";

// IMPORT ASSETS HERE
import appStyles from "./Endpoint.module.scss";

const Endpoint = (props) => {
  /* ########################### PROPS HERE ########################### */
  // const {} = props;

  /* ########################### HOOKS HERE ########################### */
  const jsonTextareaRef = useRef(null);

  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openExamples, setOpenExamples] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(false);
  const [requestBody, setRequestBody] = useState("");
  const [apiResponse, setApiResponse] = useState("");

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

      case "examples":
        updateArr = action?.payload;
        const updatedExamples = state?.examples?.map((example, index) => {
          if (index === updateArr?.[1]) {
            example[updateArr?.[0]] = updateArr?.[2];
            return example;
          }
          return example;
        });
        updateArr = [];
        return { ...state, examples: updatedExamples };

      default:
        throw new Error("Unknown type");
    }
  };
  const [endpoint, dispatchEndpoint] = useReducer(
    endpointReducers,
    props?.endpoint
  );

  useEffect(() => {
    enableTabIndentationInTextArea();
  }, []);

  /* ########################### VARIABLES HERE ########################### */
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
  const TextFieldBoxOrValue = (
    fieldName,
    fieldValue,
    isMultiline,
    arrayIndex
  ) => {
    return addMode || editMode ? (
      <ThemeTextField
        variant="outlined"
        width={
          fieldName === "method"
            ? "100px"
            : fieldName === "path"
            ? "calc(100% - 110px)"
            : "100%"
        }
        value={editMode ? fieldValue : ""}
        placeholder={capitalizeFirstLetter(fieldName)}
        multiline={isMultiline === "multiline"}
        onChange={(e) => {
          dispatchEndpoint({
            type: fieldName,
            payload:
              fieldName === "examples"
                ? ["title", arrayIndex, e?.target?.value]
                : e?.target?.value,
          });
        }}
        rows={2}
      />
    ) : (
      fieldValue
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
    const headersToSend = {};
    endpoint?.requestHeaders?.map((header) => {
      headersToSend[header?.name] = header?.value;
      return header;
    });

    const paramsToSend = {};
    endpoint?.parameters?.map((param) => {
      paramsToSend[param?.name] = param?.value;
      return param;
    });

    axios
      .request({
        method: endpoint?.method,
        url: endpoint?.path,
        data: requestBody,
        params: paramsToSend,
        headers: {
          ...headersToSend,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response", response);
        const apiResponseTemp = {
          statusCode: response?.status,
          data: response?.data,
        };
        setApiResponse(apiResponseTemp);
      })
      .catch((apiError) => {
        console.log("apiError", apiError);
      });
  };

  const enableTabIndentationInTextArea = () => {
    document
      .getElementById("json-textarea")
      .addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();

          // Get the cursor position
          const { selectionStart, selectionEnd } = e.target;

          // update the state
          const currentValue = e.target.value;
          setRequestBody(
            `${currentValue.substring(
              0,
              selectionStart
            )}${"\t"}${currentValue.substring(selectionEnd)}`
          );

          // update the cursor position after the state is updated
          // eslint-disable-next-line
          jsonTextareaRef.current.selectionStart = jsonTextareaRef.current.selectionEnd =
            selectionStart + 1;
        }
      });
  };

  return (
    <section className={appStyles["main-container"]}>
      <section className={appStyles["main-header"]}>
        <div className={appStyles["main-header--left"]}>
          <span className={appStyles.title}>
            {TextFieldBoxOrValue("title", endpoint?.title)}
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
          {TextFieldBoxOrValue("method", endpoint?.method)}
        </span>
        <span className={appStyles.path}>
          {TextFieldBoxOrValue("path", endpoint?.path)}
        </span>
      </div>
      <div className={appStyles.description}>
        {TextFieldBoxOrValue("description", endpoint?.description, "multiline")}
      </div>

      {/* ************************************* PARAMETERS starts here ************************************ */}
      <section className={appStyles.parameters}>
        <div className={appStyles.parameters__title}>Parameters</div>
        <AppTableComponent
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
        <AppTableComponent
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
          <textarea
            ref={jsonTextareaRef}
            id="json-textarea"
            className={appStyles["request-body__json"]}
            rows="15"
            value={requestBody}
            onChange={(e) => {
              setRequestBody(e?.target?.value);
            }}
            disabled={addMode || editMode}
          />
        </section>

        <section className={appStyles["response-body"]}>
          <div className={appStyles["response-body__title"]}>
            <span>Response Body</span>
            <span
              className={
                String(apiResponse?.statusCode)?.startsWith("2")
                  ? appStyles.green
                  : appStyles.red
              }
            >
              {apiResponse
                ? `${apiResponse?.statusCode} ${getStatusText(
                    apiResponse?.statusCode
                  )}`
                : null}
            </span>
          </div>
          <div className={appStyles["response-body__json"]}>
            <pre>{prettyPrintJson(apiResponse?.data)}</pre>
          </div>
          <Button
            variant="outlined"
            disabled={apiResponse === ""}
            className={appStyles["response-view-more-btn"]}
            onClick={() => {
              setOpenPopup(true);
              setPopupContent({
                title: "Response Body",
                statusCode: apiResponse?.statusCode,
                json: apiResponse?.data,
              });
            }}
          >
            View More
          </Button>
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
                <span className={appStyles.flex1}>
                  {TextFieldBoxOrValue(
                    "examples",
                    example?.title,
                    "",
                    exampleIndex
                  )}
                </span>
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
                    <Button
                      variant="outlined"
                      className={appStyles["view-more-btn"]}
                      onClick={() => {
                        setOpenPopup(true);
                        setPopupContent({
                          title: `Example ${exampleIndex + 1}: ${
                            example?.title
                          }`,
                          json: endpoint?.requestBody,
                        });
                      }}
                    >
                      View More
                    </Button>
                  </section>

                  <section className={appStyles["example-response-body"]}>
                    <div className={appStyles["example-response-body__title"]}>
                      <span>Response Body</span>
                      <span
                        className={
                          String(example?.response?.statusCode)?.startsWith("2")
                            ? appStyles.green
                            : appStyles.red
                        }
                      >
                        {example?.response
                          ? `${example?.response?.statusCode} ${getStatusText(
                              example?.response?.statusCode
                            )}`
                          : null}
                      </span>
                    </div>
                    <div className={appStyles["example-response-body__json"]}>
                      <pre>{prettyPrintJson(example?.response?.data)}</pre>
                    </div>
                    <Button
                      variant="outlined"
                      className={appStyles["view-more-btn"]}
                      onClick={() => {
                        setOpenPopup(true);
                        setPopupContent({
                          title: `Example ${exampleIndex + 1}: ${
                            example?.title
                          }`,
                          statusCode: example?.response?.statusCode,
                          json: example?.response?.data,
                        });
                      }}
                    >
                      View More
                    </Button>
                  </section>
                </section>
              )}
            </section>
          );
        })}
      </section>
      {/* ************************************************************************************************* */}

      {/* ************************************** POPUP starts here **************************************** */}
      <PopupComponent
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title={popupContent?.title}
        content={popupContent?.json}
        statusCode={popupContent?.statusCode}
      />
      {/* ************************************************************************************************* */}
    </section>
  );
};

export default Endpoint;
