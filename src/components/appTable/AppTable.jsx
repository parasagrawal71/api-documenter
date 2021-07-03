import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import { RemoveCircleOutlined as RemoveIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import cx from "classnames";
import ReactHtmlParser from "react-html-parser";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField, ThemeCheckbox, ThemeAutocomplete } from "utils/commonStyles/StyledComponents";

// IMPORT ASSETS HERE
import appStyles from "./AppTable.module.scss";

const AppTable = (props) => {
  // PROPS HERE
  const {
    tableHeaders,
    tableRows,
    addMode,
    editMode,
    dispatchEndpoint,
    arrayKey,
    disableValueTextbox,
    cellPadding,
    dispatchModel,
    modelFieldTypes,
    zeroStateText,
  } = props;

  const useStyles = makeStyles({
    tableCnt: {
      boxShadow: "0 0 2px darkgrey",
    },
    table: {
      minWidth: 650,
    },
    tableHeaderCell: {
      padding: "5px 16px",
      height: "40px",
    },
    tableBodyCell: {
      padding: "5px 16px",
      height: "45px",
    },
    zeroStateMsg: {
      textAlign: "center",
    },
    centerAlign: {
      textAlign: "center",
    },
    widthToNameField: {
      width: 120,
    },
  });
  const classes = useStyles();

  const TextFieldBoxOrValue = (tableRowData, headerObj, rowIndex, fieldValue, isMultiline) => {
    const headerKey = headerObj?.key;

    if (["required", "unique"].includes(headerKey)) {
      return addMode || editMode ? (
        <ThemeCheckbox
          checked={Boolean(fieldValue)}
          onClick={(e) => {
            if (dispatchEndpoint) {
              dispatchEndpoint({
                type: arrayKey,
                payload: {
                  headerKey,
                  rowIndex,
                  value: e?.target?.checked,
                },
              });
            }

            if (dispatchModel) {
              dispatchModel({
                type: "update-modelField",
                payload: {
                  headerKey,
                  rowIndex,
                  value: e?.target?.checked,
                },
              });
            }
          }}
          error={tableRowData?.error?.[headerObj?.key]?.toString()}
          onBlur={() => {
            if (dispatchEndpoint) {
              dispatchEndpoint({
                type: arrayKey,
                payload: {
                  headerKey: "error",
                  rowIndex,
                  value: {
                    ...(tableRowData?.error || {}),
                    [headerKey]: headerObj?.required && !tableRowData?.[headerKey] ? true : undefined,
                  },
                },
              });
            }

            if (dispatchModel) {
              dispatchModel({
                type: "update-modelField",
                payload: {
                  headerKey: "error",
                  rowIndex,
                  value: {
                    ...(tableRowData?.error || {}),
                    [headerKey]: headerObj?.required && !tableRowData?.[headerKey] ? true : undefined,
                  },
                },
              });
            }

            if (dispatchEndpoint) {
              // TODO: ADD ENDPOINT FIELD VALIDATIONS
              // dispatchEndpoint({
              //   type: "",
              //   payload: {
              //     headerKey: "error",
              //     rowIndex,
              //     value: {
              //       ...(tableRowData?.error || {}),
              //       [headerKey]: headerObj?.required ? true : undefined,
              //     },
              //   },
              // });
            }
          }}
        />
      ) : fieldValue ? (
        "Yes"
      ) : (
        "No"
      );
    } else if (["type"].includes(headerKey) && (addMode || editMode)) {
      return (
        <ThemeAutocomplete
          options={modelFieldTypes}
          getOptionLabel={(option) => option?.type || ""}
          customStyle={{ width: "250px" }}
          renderInput={(params) => (
            <ThemeTextField
              {...params}
              InputLabelProps={{
                focused: false,
              }}
              error={tableRowData?.error?.[headerObj?.key]?.toString()}
              onBlur={() => {
                if (dispatchEndpoint) {
                  dispatchEndpoint({
                    type: arrayKey,
                    payload: {
                      headerKey: "error",
                      rowIndex,
                      value: {
                        ...(tableRowData?.error || {}),
                        [headerKey]: headerObj?.required && !tableRowData?.[headerKey] ? true : undefined,
                      },
                    },
                  });
                }

                if (dispatchModel) {
                  dispatchModel({
                    type: "update-modelField",
                    payload: {
                      headerKey: "error",
                      rowIndex,
                      value: {
                        ...(tableRowData?.error || {}),
                        [headerKey]: headerObj?.required && !tableRowData?.[headerKey] ? true : undefined,
                      },
                    },
                  });
                }
              }}
            />
          )}
          onChange={(e, selectedOption) => {
            if (dispatchModel) {
              dispatchModel({
                type: "update-modelField",
                payload: {
                  headerKey,
                  rowIndex,
                  value: selectedOption?.type,
                },
              });
            }
          }}
          value={{ type: fieldValue } || ""}
        />
      );
    } else if ((headerKey === "value" && !disableValueTextbox) || addMode || editMode) {
      return (
        <ThemeTextField
          disabled={headerKey === "value" && !disableValueTextbox && (editMode || addMode)}
          value={(headerKey === "value" && !disableValueTextbox) || editMode ? fieldValue : ""}
          multiline={isMultiline === "multiline"}
          onChange={(e) => {
            if (dispatchEndpoint) {
              dispatchEndpoint({
                type: arrayKey,
                payload: {
                  headerKey,
                  rowIndex,
                  value: e?.target?.value,
                },
              });
            }

            if (dispatchModel) {
              dispatchModel({
                type: "update-modelField",
                payload: {
                  headerKey,
                  rowIndex,
                  value: e?.target?.value,
                },
              });
            }
          }}
          rows={2}
          error={tableRowData?.error?.[headerObj?.key]?.toString()}
          onBlur={() => {
            if (dispatchEndpoint) {
              dispatchEndpoint({
                type: arrayKey,
                payload: {
                  headerKey: "error",
                  rowIndex,
                  value: {
                    ...(tableRowData?.error || {}),
                    [headerKey]: headerObj?.required && !tableRowData?.[headerKey] ? true : undefined,
                  },
                },
              });
            }

            if (dispatchModel) {
              dispatchModel({
                type: "update-modelField",
                payload: {
                  headerKey: "error",
                  rowIndex,
                  value: {
                    ...(tableRowData?.error || {}),
                    [headerKey]: headerObj?.required && !tableRowData?.[headerKey] ? true : undefined,
                  },
                },
              });
            }
          }}
          customStyle={{
            disabledBgColor: "rgba(178, 190, 181, 0.15)",
          }}
        />
      );
    } else {
      if (["value"].includes(headerKey)) {
        return getColoredEnvVariable(fieldValue);
      }

      return fieldValue || "-";
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

  const decideDispatchRemoveType = () => {
    switch (arrayKey) {
      case "parameters":
        return "remove-parameter";

      case "requestHeaders":
        return "remove-requestHeader";

      case "modelFields":
        return "remove-modelField";

      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper} className={classes.tableCnt}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders?.map((header, headerIndex) => {
              return (
                <TableCell
                  key={headerIndex}
                  className={cx(classes.tableHeaderCell, {
                    [classes.centerAlign]: ["required", "unique"].includes(header?.key),
                    [classes.widthToNameField]: ["name"].includes(header?.key),
                  })}
                  style={{ padding: cellPadding }}
                >
                  {header?.displayName}
                  {header?.required ? <span className={appStyles["required-asterisk"]}>*</span> : ""}
                </TableCell>
              );
            })}
            {(addMode || editMode) && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows?.length ? (
            tableRows?.map((tableRow, rowIndex) => (
              <TableRow key={rowIndex}>
                {tableHeaders?.map((header, headerIndex) => {
                  return (
                    <TableCell
                      key={headerIndex}
                      className={cx(classes.tableBodyCell, {
                        [classes.centerAlign]: ["required", "unique"].includes(header?.key),
                        [classes.widthToNameField]: ["name"].includes(header?.key),
                      })}
                      style={{ padding: cellPadding }}
                    >
                      {TextFieldBoxOrValue(tableRow, header, rowIndex, tableRow[header?.key])}
                    </TableCell>
                  );
                })}
                {(addMode || editMode) && (
                  <TableCell className={classes.tableBodyCell} style={{ padding: 0 }}>
                    <RemoveIcon
                      className={appStyles.removeIcon}
                      onClick={() => {
                        if (dispatchEndpoint) {
                          dispatchEndpoint({
                            type: decideDispatchRemoveType(),
                            payload: { rowIndex },
                          });
                        }
                        if (dispatchModel) {
                          dispatchModel({
                            type: decideDispatchRemoveType(),
                            payload: { rowIndex },
                          });
                        }
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className={classes.zeroStateMsg} colSpan={tableHeaders?.length}>
                {zeroStateText || "No data"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
