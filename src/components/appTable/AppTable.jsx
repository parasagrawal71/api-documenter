import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { RemoveCircleOutlined as RemoveIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// IMPORT USER-DEFINED COMPONENTS HERE
import {
  ThemeTextField,
  ThemeCheckbox,
} from "utils/commonStyles/styledComponents";

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
  } = props;

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();

  const TextFieldBoxOrValue = (
    headerKey,
    rowIndex,
    fieldValue,
    isMultiline
  ) => {
    if (["required", "unique"].includes(headerKey)) {
      return addMode || editMode ? (
        <ThemeCheckbox
          color="primary"
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
        />
      ) : fieldValue ? (
        "true"
      ) : (
        "false"
      );
    } else if (
      (headerKey === "value" && !disableValueTextbox) ||
      addMode ||
      editMode
    ) {
      return (
        <ThemeTextField
          variant="outlined"
          disabled={
            headerKey === "value" &&
            !disableValueTextbox &&
            (editMode || addMode)
          }
          value={
            (headerKey === "value" && !disableValueTextbox) || editMode
              ? fieldValue
              : ""
          }
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
        />
      );
    } else {
      return fieldValue;
    }
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
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders?.map((header, headerIndex) => {
              return (
                <TableCell key={headerIndex} style={{ padding: cellPadding }}>
                  {header?.displayName}
                </TableCell>
              );
            })}
            {(addMode || editMode) && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows?.map((tableRow, rowIndex) => (
            <TableRow key={rowIndex}>
              {tableHeaders?.map((header, headerIndex) => {
                return (
                  <TableCell key={headerIndex} style={{ padding: cellPadding }}>
                    {TextFieldBoxOrValue(
                      header?.key,
                      rowIndex,
                      tableRow[header?.key]
                    )}
                  </TableCell>
                );
              })}
              {(addMode || editMode) && (
                <TableCell>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
