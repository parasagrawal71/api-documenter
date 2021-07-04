import React, { useReducer, useState, useEffect, useRef } from "react";
import {
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDownIcon,
  AddCircleOutlined as AddIcon,
  RemoveCircleOutlined as RemoveIcon,
  Save as SaveIcon,
} from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import cx from "classnames";
import { toast } from "react-toastify";
import ReactHtmlParser from "react-html-parser";
import _ from "lodash";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField, ThemeAutocomplete, ThemeButton } from "utils/commonStyles/StyledComponents";
import GenericActionsPopoverComponent from "subComponents/genericActionsPopover/GenericActionsPopover";
import { capitalizeFirstLetter, getStatusText, prettyPrintJson, validateJSON } from "utils/functions";
import AppTableComponent from "components/appTable/AppTable";
import ViewMorePopupComponent from "components/viewMorePopup/ViewMorePopup";
import TextfieldPopupComponent from "components/textfieldPopup/TextfieldPopup";
import apiService from "apis/apiService";
import { endpointUrl } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./Endpoint.module.scss";

const Endpoint = (props) => {
  /* ########################### PROPS HERE ########################### */
  const { selectedEnv, endpointMongoId, updateApisTree, enableEditMode, setEnableEditMode } = props;

  /* ########################### HOOKS HERE ########################### */
  // REFs HERE
  const jsonTextareaRef = useRef(null);

  // STATE VARIABLES HERE
  const [endpointOldState, setEndpointOldState] = useState({});
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openExamples, setOpenExamples] = useState({});
  const [openTextfieldPopup, setOpenTextfieldPopup] = useState({ open: false });
  const [openViewMorePopup, setOpenViewMorePopup] = useState(false);
  const [popupContent, setPopupContent] = useState(false);
  const [requestBody, setRequestBody] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [invalidReqBody, setInvalidReqBody] = useState(false);
  const [openSendOptions, setOpenSendOptions] = useState(false);

  // REDUCERS HERE
  const endpointReducers = (state, action) => {
    let payload = null;

    switch (action?.type) {
      case "all":
        return { ...action?.payload };

      case "method":
        return { ...state, method: action?.payload };

      case "path":
        return { ...state, path: action?.payload };

      case "title":
        return { ...state, title: action?.payload };

      case "description":
        return { ...state, description: action?.payload };

      case "parameters":
        payload = action?.payload;
        const updatedParameters = state?.parameters?.map((param, index) => {
          if (index === payload?.rowIndex) {
            param[payload?.headerKey] = payload?.value;
            if (param?.error) {
              param.error[payload?.headerKey] = undefined;
            }
            return param;
          }
          return param;
        });
        payload = null;
        return { ...state, parameters: updatedParameters };

      case "add-parameter":
        const updatedParametersAfterAddingNew = [...(state?.parameters || [])];
        const paramLastIndex = updatedParametersAfterAddingNew?.length - 1;
        if (paramLastIndex >= 0 && !updatedParametersAfterAddingNew?.[paramLastIndex]?.name) {
          if (!updatedParametersAfterAddingNew?.[paramLastIndex]?.error) {
            updatedParametersAfterAddingNew[paramLastIndex].error = {};
          }
          updatedParametersAfterAddingNew[paramLastIndex].error.name = true;
          return { ...state, parameters: updatedParametersAfterAddingNew };
        }

        updatedParametersAfterAddingNew?.push({
          name: "",
          required: false,
          description: "",
          value: "",
        });
        return { ...state, parameters: updatedParametersAfterAddingNew };

      case "remove-parameter":
        payload = action?.payload;
        const updatedParametersAfterRemoval = state?.parameters?.filter((param, index) => index !== payload?.rowIndex);
        return { ...state, parameters: updatedParametersAfterRemoval };

      case "requestHeaders":
        payload = action?.payload;
        const updatedReqHeaders = state?.requestHeaders?.map((reqHeader, index) => {
          if (index === payload?.rowIndex) {
            reqHeader[payload?.headerKey] = payload?.value;
            if (reqHeader?.error) {
              reqHeader.error[payload?.headerKey] = undefined;
            }
            return reqHeader;
          }
          return reqHeader;
        });
        payload = null;
        return { ...state, requestHeaders: updatedReqHeaders };

      case "add-requestHeader":
        const updatedRequestHeadersAfterAddingNew = [...(state?.requestHeaders || [])];
        const headerLastIndex = updatedRequestHeadersAfterAddingNew?.length - 1;
        if (headerLastIndex >= 0 && !updatedRequestHeadersAfterAddingNew?.[headerLastIndex]?.name) {
          if (!updatedRequestHeadersAfterAddingNew?.[headerLastIndex]?.error) {
            updatedRequestHeadersAfterAddingNew[headerLastIndex].error = {};
          }
          updatedRequestHeadersAfterAddingNew[headerLastIndex].error.name = true;
          return { ...state, requestHeaders: updatedRequestHeadersAfterAddingNew };
        }

        updatedRequestHeadersAfterAddingNew?.push({
          name: "",
          required: false,
          value: "",
        });
        return {
          ...state,
          requestHeaders: updatedRequestHeadersAfterAddingNew,
        };

      case "remove-requestHeader":
        payload = action?.payload;
        const updatedRequestHeadersAfterRemoval = state?.requestHeaders?.filter(
          (reqHeader, index) => index !== payload?.rowIndex
        );
        return { ...state, requestHeaders: updatedRequestHeadersAfterRemoval };

      case "examples":
        payload = action?.payload;
        const updatedExamples = state?.examples?.map((example, index) => {
          if (index === payload?.rowIndex) {
            example[payload?.headerKey] = payload?.value;
            return example;
          }
          return example;
        });
        payload = null;
        return { ...state, examples: updatedExamples };

      case "save-example":
        payload = action?.payload;
        const currentEndpoint = payload?.endpoint;
        const newExample = {
          title: payload?.title,
          parameters: currentEndpoint?.parameters,
          requestHeaders: currentEndpoint?.requestHeaders,
          requestBody,
          response: apiResponse,
        };
        const updatedExamplesAfterAddingNew = [...state?.examples, newExample];
        payload?.updateEndpointFunc({
          ...state,
          examples: updatedExamplesAfterAddingNew,
        });
        return {
          ...state,
          examples: updatedExamplesAfterAddingNew,
        };

      case "remove-example":
        payload = action?.payload;
        const updatedExamplesAfterRemoval = state?.examples?.filter((example, index) => index !== payload?.rowIndex);
        return { ...state, examples: updatedExamplesAfterRemoval };

      default:
        throw new Error("Unknown type");
    }
  };
  const [endpoint, dispatchEndpoint] = useReducer(endpointReducers, {});

  useEffect(() => {
    enableTabIndentationInTextArea();
  }, []);

  useEffect(() => {
    fetchEndpoint(endpointMongoId);
  }, [endpointMongoId]);

  /* ########################### VARIABLES HERE ########################### */
  const parameterTableHeaders = [
    {
      displayName: "Name",
      key: "name",
      required: true,
    },
    {
      displayName: "Required",
      key: "required",
    },
    {
      displayName: "Description",
      key: "description",
      required: true,
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
      required: true,
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

  const exampleTableHeaders = [
    {
      displayName: "Name",
      key: "name",
    },
    {
      displayName: "Value",
      key: "value",
    },
  ];

  /* ########################### FUNCTIONS HERE ########################### */
  const TextFieldBoxOrValue = (fieldName, fieldValue, isMultiline, arrayIndex) => {
    if (addMode || editMode) {
      if (fieldName === "method") {
        return (
          <ThemeAutocomplete
            disableClearable
            options={["GET", "POST", "PUT", "DELETE", "PATCH"]}
            getOptionLabel={(option) => option || ""}
            customStyle={{ width: "150px" }}
            renderInput={(params) => (
              <ThemeTextField
                {...params}
                InputLabelProps={{
                  // shrink: false,
                  focused: false,
                }}
                customStyle={{
                  backgroundColor: "#FFFFFF",
                }}
              />
            )}
            onChange={(e, selectedOption) => {
              dispatchEndpoint({
                type: "method",
                payload: selectedOption,
              });
            }}
            value={endpoint?.method?.toUpperCase() || ""}
          />
        );
      }

      return (
        <ThemeTextField
          value={editMode ? fieldValue : ""}
          placeholder={fieldName === "examples" ? "Example title" : capitalizeFirstLetter(fieldName)}
          multiline={isMultiline === "multiline"}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            dispatchEndpoint({
              type: fieldName,
              payload:
                fieldName === "examples"
                  ? {
                      headerKey: "title",
                      rowIndex: arrayIndex,
                      value: e?.target?.value,
                    }
                  : e?.target?.value,
            });
          }}
          rows={2}
          customStyle={{
            backgroundColor: "#FFFFFF",
          }}
        />
      );
    } else {
      if (["path"].includes(fieldName)) {
        return getColoredEnvVariable(fieldValue);
      }

      return fieldValue;
    }
  };

  const getColoredEnvVariable = (value) => {
    const mapObj = {
      "{{": `<span class="envVariable">{{`,
      "}}": "}}</span>",
    };
    const coloredFieldValue = value && value.replaceAll(/{{|}}/gi, (matched) => mapObj[matched]);
    return ReactHtmlParser(coloredFieldValue);
  };

  const isValidationsErrors = () => {
    const requiredParameters = [];
    parameterTableHeaders?.filter((p) => {
      if (p.required) {
        requiredParameters.push(p.key);
      }
      return p;
    });

    const requiredReqHeaders = [];
    reqHeadTableHeaders?.filter((h) => {
      if (h.required) {
        requiredReqHeaders.push(h.key);
      }
      return h;
    });

    let isError = false;
    endpoint?.parameters?.map((paramObj, index) => {
      const isErrorObj = {};

      requiredParameters?.map((requiredParamName) => {
        if (!paramObj?.[requiredParamName]) {
          isErrorObj.rowIndex = index;
          isErrorObj.value = {
            ...isErrorObj?.value,
            [requiredParamName]: true,
          };
          isError = true;
        }
        return requiredParamName;
      });

      dispatchEndpoint({
        type: "parameters",
        payload: {
          headerKey: "error",
          rowIndex: isErrorObj?.rowIndex,
          value: isErrorObj?.value,
        },
      });

      return paramObj;
    });

    endpoint?.requestHeaders?.map((reqHeaderObj, index) => {
      const isErrorObj = {};

      requiredReqHeaders?.map((requiredHeaderName) => {
        if (!reqHeaderObj?.[requiredHeaderName]) {
          isErrorObj.rowIndex = index;
          isErrorObj.value = {
            ...isErrorObj?.value,
            [requiredHeaderName]: true,
          };
          isError = true;
        }
        return requiredHeaderName;
      });

      dispatchEndpoint({
        type: "requestHeaders",
        payload: {
          headerKey: "error",
          rowIndex: isErrorObj?.rowIndex,
          value: isErrorObj?.value,
        },
      });

      return reqHeaderObj;
    });

    return isError;
  };

  const handleEditSaveBtn = () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      if (isValidationsErrors()) {
        return;
      }
      updateEndpoint();
      setEditMode(false);
    }
  };

  const handleCancelBtn = () => {
    dispatchEndpoint({
      type: "all",
      payload: _.cloneDeep(endpointOldState),
    });
    setEditMode(false);
  };

  const updateEndpoint = async (updatedEndpoint) => {
    const requestBodyToPutApi = updatedEndpoint || endpoint;

    const response = await apiService(endpointUrl(endpoint?._id).put, requestBodyToPutApi);
    if (response?.success) {
      // IMPORTANT: Nested array or objects (eg. parameters, requestHeaders, etc) had same reference because of that values were mutating
      setEndpointOldState(_.cloneDeep(response?.data));
      updateApisTree(endpoint?.title, endpoint?.method);
    }
  };

  const fetchEndpoint = async (mongoId) => {
    if (!mongoId) {
      return;
    }

    const response = await apiService(endpointUrl(mongoId).getById);
    if (response?.success) {
      dispatchEndpoint({
        type: "all",
        payload: response?.data,
      });
      setEndpointOldState(_.cloneDeep(response?.data));
    }
  };

  const putEnvVariablesValues = (endpointData, paramsToSend, headersToSend) => {
    let modifiedPath = "";

    const getEnvVarValue = (varName) => {
      let varValue = "";
      selectedEnv?.variables?.map((variable) => {
        if (varName === variable?.key) {
          varValue = variable?.value;
        }
        return variable;
      });
      return varValue;
    };

    if (endpointData?.path?.includes("{{")) {
      const url = endpointData?.path;
      const variableName = url?.substring(url.indexOf("{") + 2, url.indexOf("}"));
      const variableValue = getEnvVarValue(variableName);
      const regex = new RegExp(`{{${variableName}}}`, "");
      modifiedPath = url.replace(regex, variableValue);
    }

    if (headersToSend && Object.keys(headersToSend)?.length) {
      Object.keys(headersToSend)?.map((headerKey) => {
        const value = headersToSend?.[headerKey];
        if (value?.includes?.("{{")) {
          const variableName = value?.substring(value.indexOf("{") + 2, value.indexOf("}"));
          const variableValue = getEnvVarValue(variableName);
          const regex = new RegExp(`{{${variableName}}}`, "");
          headersToSend[headerKey] = headersToSend[headerKey].replace(regex, variableValue);
        }
        return headerKey;
      });
    }

    if (paramsToSend && Object.keys(paramsToSend)?.length) {
      Object.keys(paramsToSend)?.map((paramKey) => {
        const value = paramsToSend?.[paramKey];
        if (value?.includes?.("{{")) {
          const variableName = value?.substring(value.indexOf("{") + 2, value.indexOf("}"));
          const variableValue = getEnvVarValue(variableName);
          const regex = new RegExp(`{{${variableName}}}`, "");
          paramsToSend[paramKey] = paramsToSend[paramKey].replace(regex, variableValue);
        }
        return paramKey;
      });
    }

    return [modifiedPath, paramsToSend, headersToSend];
  };

  const sendApiCall = () => {
    const headersToSend = {};
    let isError = false;

    const requestHeadersTemp = endpoint?.requestHeaders?.map((header) => {
      if (header?.required && !header?.value) {
        if (!header.error) {
          header.error = {};
        }
        header.error.value = true;
        isError = true;
      } else if (header.error) {
        header.error.value = undefined;
      }

      headersToSend[header?.name] = header?.value;
      return header;
    });
    endpoint.requestHeaders = requestHeadersTemp;

    const paramsToSend = {};
    const parametersTemp = endpoint?.parameters?.map((param) => {
      if (param?.required && !param?.value) {
        if (!param.error) {
          param.error = {};
        }
        param.error.value = true;
        isError = true;
      } else if (param.error) {
        param.error.value = undefined;
      }

      paramsToSend[param?.name] = param?.value;
      return param;
    });
    endpoint.parameters = parametersTemp;

    if (requestBody && !validateJSON(requestBody)) {
      setInvalidReqBody(true);
      isError = true;
    }

    dispatchEndpoint({
      type: "all",
      payload: endpoint,
    });
    if (isError) {
      toast.error("Couldn't send request!!");
      toast.clearWaitingQueue();
      return;
    }

    const [modifiedPath] = putEnvVariablesValues(endpoint, paramsToSend, headersToSend);
    // IMPORTANT: Modifying the same object reference works, no need to assign new variable for params and header

    axios
      .request({
        method: endpoint?.method,
        url: modifiedPath,
        data: requestBody,
        params: paramsToSend,
        headers: {
          ...headersToSend,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log("response: ", response);
        // console.log("response?.data: ", response?.data);
        // console.log("response?.data?.message: ", response?.data?.message);
        toast.success(`API Response: ${response?.data?.message || "No message"}`);
        toast.clearWaitingQueue();
        const apiResponseTemp = {
          statusCode: response?.status,
          data: response?.data,
        };
        setApiResponse(apiResponseTemp);
      })
      .catch((apiError) => {
        toast.error(`API Response: ${apiError?.message}`);
        toast.clearWaitingQueue();
      });
  };

  const enableTabIndentationInTextArea = () => {
    document.getElementById("json-textarea").addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();

        // Get the cursor position
        const { selectionStart, selectionEnd } = e.target;

        // update the state
        const currentValue = e.target.value;
        setRequestBody(`${currentValue.substring(0, selectionStart)}${"\t"}${currentValue.substring(selectionEnd)}`);

        // update the cursor position after the state is updated
        // eslint-disable-next-line
        jsonTextareaRef.current.selectionStart = jsonTextareaRef.current.selectionEnd = selectionStart + 1;
      }
    });
  };

  const prettifyRequestBody = () => {
    if (!validateJSON(requestBody)) {
      return setInvalidReqBody(true);
    }

    const prettyReqBody = JSON.stringify(JSON.parse(requestBody), undefined, 4);
    setRequestBody(prettyReqBody);
  };

  return (
    <section className={appStyles["main-container"]}>
      <span id={endpoint?.title} className={cx("scroll-target")}>
        &nbsp;
      </span>
      <section
        className={cx(appStyles["main-header"], {
          [appStyles.editMode]: editMode || addMode,
        })}
      >
        <div className={appStyles["main-header--left"]}>
          <span className={appStyles.title}>{TextFieldBoxOrValue("title", endpoint?.title)}</span>
          <span className={appStyles.updatedAt}>
            Updated At: {moment(endpoint?.updatedAt).format("DD-MM-YYYY hh:mm A")}
          </span>
        </div>
        <div className={appStyles["action-btns"]}>
          {!editMode && !addMode && (
            <>
              <ThemeButton
                className={cx(appStyles["send-request-btn"], {
                  [appStyles.viewMode]: !enableEditMode,
                })}
                onClick={sendApiCall}
                customStyle={{ width: "85px" }}
              >
                Send
              </ThemeButton>
              {enableEditMode && (
                <ThemeButton
                  className={appStyles["dropdown-arrow-btn"]}
                  onClick={() => {
                    setOpenSendOptions(!openSendOptions);
                  }}
                >
                  <div className={cx("dropdown-arrow")} />
                  <GenericActionsPopoverComponent
                    openPopover={openSendOptions}
                    setOpenPopover={(val) => {
                      setOpenSendOptions(val);
                    }}
                    options={["Save as example"]}
                    optionsCallbacks={[
                      () => {
                        setOpenTextfieldPopup({ open: true });
                      },
                    ]}
                    containerClass={appStyles.sendOptionsCnt}
                    optionCntClass={appStyles.sendOption}
                  />
                </ThemeButton>
              )}
            </>
          )}
          {enableEditMode ? (
            !editMode ? (
              <ThemeButton onClick={handleEditSaveBtn} customStyle={{ width: "75px" }}>
                Edit
              </ThemeButton>
            ) : (
              <>
                <ThemeButton issecondary="true" onClick={handleCancelBtn} customStyle={{ width: "85px" }}>
                  Cancel
                </ThemeButton>
                <ThemeButton onClick={handleEditSaveBtn} customStyle={{ width: "75px" }}>
                  Save
                </ThemeButton>
              </>
            )
          ) : null}
        </div>
      </section>
      <div
        className={cx(appStyles["method-path"], {
          [appStyles.padding0]: editMode || addMode,
        })}
      >
        <div
          className={cx(appStyles.method, {
            [appStyles.get]: endpoint?.method === "GET",
            [appStyles.post]: endpoint?.method === "POST",
            [appStyles.put]: endpoint?.method === "PUT",
            [appStyles.patch]: endpoint?.method === "PATCH",
            [appStyles.delete]: endpoint?.method === "DELETE",
          })}
        >
          {TextFieldBoxOrValue("method", endpoint?.method)}
        </div>
        <div className={appStyles.path}>{TextFieldBoxOrValue("path", endpoint?.path)}</div>
      </div>
      <div className={appStyles.description}>
        {TextFieldBoxOrValue("description", endpoint?.description, "multiline")}
      </div>

      {/* ************************************* PARAMETERS starts here ************************************ */}
      <section className={appStyles.parameters}>
        <div className={appStyles.parameters__title}>
          <span>Query Parameters</span>
          {(addMode || editMode) && (
            <AddIcon
              className={appStyles.addIcon}
              onClick={() => {
                dispatchEndpoint({ type: "add-parameter" });
              }}
            />
          )}
        </div>
        <AppTableComponent
          tableHeaders={parameterTableHeaders}
          tableRows={endpoint?.parameters}
          arrayKey="parameters"
          dispatchEndpoint={dispatchEndpoint}
          editMode={editMode}
          addMode={addMode}
          zeroStateText="No parameters"
        />
      </section>
      {/* ************************************************************************************************* */}

      {/* ********************************** REQUEST HEADERS starts here ********************************** */}
      <section className={appStyles["request-headers"]}>
        <div className={appStyles["request-headers__title"]}>
          <span>Headers</span>
          {(addMode || editMode) && (
            <AddIcon
              className={appStyles.addIcon}
              onClick={() => {
                dispatchEndpoint({ type: "add-requestHeader" });
              }}
            />
          )}
        </div>
        <AppTableComponent
          tableHeaders={reqHeadTableHeaders}
          tableRows={endpoint?.requestHeaders}
          arrayKey="requestHeaders"
          dispatchEndpoint={dispatchEndpoint}
          editMode={editMode}
          addMode={addMode}
          zeroStateText="No headers"
        />
      </section>
      {/* ************************************************************************************************* */}

      {/* *************************** REQUEST and RESPONSE BODY starts here ******************************* */}
      <section className={appStyles["request-response-bodies"]}>
        <section className={appStyles["request-body"]}>
          <div className={appStyles["request-body__title"]}>
            <span>Request Body</span>
            <span
              className={appStyles.prettify}
              role="button"
              tabIndex="0"
              onKeyDown={() => {}}
              onClick={prettifyRequestBody}
            >
              Prettify
            </span>
          </div>
          <textarea
            ref={jsonTextareaRef}
            id="json-textarea"
            className={cx(appStyles["request-body__json"], {
              // [appStyles.disabled]: addMode || editMode,
            })}
            rows="15"
            value={requestBody}
            onChange={(e) => {
              setInvalidReqBody(false);
              setRequestBody(e?.target?.value);
            }}
            // disabled={addMode || editMode}
          />
          <span className={appStyles.invalidJSONErr}>{invalidReqBody ? "Invalid JSON" : ""}</span>
        </section>

        <section className={appStyles["response-body"]}>
          <div className={appStyles["response-body__title"]}>
            <span>Response Body</span>
            <span className={String(apiResponse?.statusCode)?.startsWith("2") ? appStyles.success : appStyles.error}>
              {apiResponse ? `${apiResponse?.statusCode} ${getStatusText(apiResponse?.statusCode)}` : null}
            </span>
          </div>
          <div className={appStyles["response-body__json"]}>
            <pre>{prettyPrintJson(apiResponse?.data)}</pre>
          </div>
          <ThemeButton
            variant="outlined"
            disabled={apiResponse === ""}
            className={appStyles["response-view-more-btn"]}
            onClick={() => {
              setOpenViewMorePopup(true);
              setPopupContent({
                title: "Response Body",
                statusCode: apiResponse?.statusCode,
                json: apiResponse?.data,
              });
            }}
          >
            View More
          </ThemeButton>
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
                  {openExamples?.[exampleIndex] ? (
                    <ArrowDownIcon style={{ padding: 0 }} />
                  ) : (
                    <ArrowRightIcon style={{ padding: 0 }} />
                  )}
                </span>
                <span>Example {exampleIndex + 1}:&nbsp;&nbsp;</span>
                <span className={appStyles.flex1}>
                  {TextFieldBoxOrValue("examples", example?.title, "", exampleIndex)}
                </span>
                {(editMode || addMode) && (
                  <span>
                    <RemoveIcon
                      className={appStyles.removeIcon}
                      onClick={() => {
                        dispatchEndpoint({
                          type: "remove-example",
                          payload: { rowIndex: exampleIndex },
                        });
                      }}
                    />
                  </span>
                )}
              </section>

              {openExamples?.[exampleIndex] && (
                <section className={appStyles["example-all-cnt"]}>
                  <section className={appStyles["example-paramters-reqHeaders"]}>
                    {example?.parameters?.length ? (
                      <div className={appStyles["example-paramters"]}>
                        <div className={appStyles["example-paramters__title"]}>Query Parameters</div>
                        <AppTableComponent
                          tableHeaders={exampleTableHeaders}
                          tableRows={example?.parameters}
                          disableValueTextbox
                          cellPadding="5px 10px"
                        />
                      </div>
                    ) : null}
                    {example?.requestHeaders?.length ? (
                      <div className={appStyles["example-reqHeaders"]}>
                        <div className={appStyles["example-reqHeaders__title"]}>Headers</div>
                        <AppTableComponent
                          tableHeaders={exampleTableHeaders}
                          tableRows={example?.requestHeaders}
                          disableValueTextbox
                          cellPadding="5px 10px"
                        />
                      </div>
                    ) : null}
                  </section>

                  <section className={appStyles["example-request-response-bodies"]}>
                    <section className={appStyles["example-request-body"]}>
                      <div className={appStyles["example-request-body__title"]}>Request Body</div>
                      <div className={appStyles["example-request-body__json"]}>
                        <pre>{prettyPrintJson(example?.requestBody)}</pre>
                      </div>
                      <ThemeButton
                        className={appStyles["view-more-btn"]}
                        onClick={() => {
                          setOpenViewMorePopup(true);
                          setPopupContent({
                            title: `Example ${exampleIndex + 1}: ${example?.title}`,
                            json: example?.requestBody,
                          });
                        }}
                      >
                        View More
                      </ThemeButton>
                    </section>

                    <section className={appStyles["example-response-body"]}>
                      <div className={appStyles["example-response-body__title"]}>
                        <span>Response Body</span>
                        <span
                          className={
                            String(example?.response?.statusCode)?.startsWith("2") ? appStyles.success : appStyles.error
                          }
                        >
                          {example?.response
                            ? `${example?.response?.statusCode} ${getStatusText(example?.response?.statusCode)}`
                            : null}
                        </span>
                      </div>
                      <div className={appStyles["example-response-body__json"]}>
                        <pre>{prettyPrintJson(example?.response?.data)}</pre>
                      </div>
                      <ThemeButton
                        className={appStyles["view-more-btn"]}
                        onClick={() => {
                          setOpenViewMorePopup(true);
                          setPopupContent({
                            title: `Example ${exampleIndex + 1}: ${example?.title}`,
                            statusCode: example?.response?.statusCode,
                            json: example?.response?.data,
                          });
                        }}
                      >
                        View More
                      </ThemeButton>
                    </section>
                  </section>
                </section>
              )}
            </section>
          );
        })}
      </section>
      {/* ************************************************************************************************* */}

      {/* ************************************** POPUP starts here **************************************** */}
      <ViewMorePopupComponent
        openPopup={openViewMorePopup}
        setOpenPopup={setOpenViewMorePopup}
        title={popupContent?.title}
        content={popupContent?.json}
        statusCode={popupContent?.statusCode}
      />

      <TextfieldPopupComponent
        openPopup={openTextfieldPopup?.open}
        setOpenPopup={setOpenTextfieldPopup}
        placeholder1="Enter title"
        handleSave={(value1) => {
          dispatchEndpoint({
            type: "save-example",
            payload: { endpoint, updateEndpointFunc: updateEndpoint, title: value1 },
          });
        }}
      />
      {/* ************************************************************************************************* */}
    </section>
  );
};

export default Endpoint;
