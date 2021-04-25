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
import { makeStyles } from "@material-ui/core/styles";

// IMPORT USER-DEFINED COMPONENTS HERE
import {
  ThemeTextField,
  ThemeCheckbox,
} from "utils/commonStyles/styledComponents";
import { capitalizeFirstLetter } from "utils/functions";

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
    if (headerKey === "required") {
      return addMode || editMode ? (
        <ThemeCheckbox
          color="primary"
          checked={Boolean(fieldValue)}
          onClick={(e) => {
            dispatchEndpoint({
              type: arrayKey,
              payload: [headerKey, rowIndex, e?.target?.checked],
            });
          }}
        />
      ) : fieldValue ? (
        "required"
      ) : (
        "optional"
      );
    } else if (headerKey === "value" || addMode || editMode) {
      return (
        <ThemeTextField
          variant="outlined"
          disabled={headerKey === "value" && (editMode || addMode)}
          value={headerKey === "value" || editMode ? fieldValue : ""}
          multiline={isMultiline === "multiline"}
          onChange={(e) => {
            dispatchEndpoint({
              type: arrayKey,
              payload: [headerKey, rowIndex, e?.target?.value],
            });
          }}
          rows={2}
        />
      );
    } else {
      return fieldValue;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders?.map((header, headerIndex) => {
              return (
                <TableCell key={headerIndex}>{header?.displayName}</TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows?.map((tableRow, rowIndex) => (
            <TableRow key={rowIndex}>
              {tableHeaders?.map((header, headerIndex) => {
                return (
                  <TableCell key={headerIndex}>
                    {TextFieldBoxOrValue(
                      header?.key,
                      rowIndex,
                      tableRow[header?.key]
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
