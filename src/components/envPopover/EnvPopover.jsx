import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popover,
} from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField } from "utils/commonStyles/styledComponents";
import appStyles from "./EnvPopover.module.scss";

const useStyles = makeStyles((theme) => ({
  popover: {
    marginTop: 5,
  },
  paper: {},
  table: {
    minWidth: 650,
  },
}));

export default function EnvPopover(props) {
  // PROPS HERE
  const {
    openEnvPopover,
    handleCloseEnvPopover,
    selectedEnv,
    setSelectedEnv,
  } = props;

  const classes = useStyles();

  return (
    <Popover
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={Boolean(openEnvPopover)}
      anchorEl={openEnvPopover}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={handleCloseEnvPopover}
      disableRestoreFocus
    >
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={appStyles.padding10px}>Name</TableCell>
              <TableCell className={appStyles.padding10px}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedEnv?.variables?.map((tableRow, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className={appStyles.padding10px}>
                  <ThemeTextField
                    variant="outlined"
                    value={tableRow?.key}
                    onChange={(e) => {
                      const selectedEnvTemp = { ...selectedEnv };
                      selectedEnvTemp.variables[rowIndex] = {
                        key: e?.target?.value,
                        value: tableRow?.value,
                      };
                      setSelectedEnv(selectedEnvTemp);
                    }}
                  />
                </TableCell>
                <TableCell className={appStyles.padding10px}>
                  <ThemeTextField
                    variant="outlined"
                    value={tableRow?.value}
                    onChange={(e) => {
                      const selectedEnvTemp = { ...selectedEnv };
                      selectedEnvTemp.variables[rowIndex] = {
                        key: tableRow?.key,
                        value: e?.target?.value,
                      };
                      setSelectedEnv(selectedEnvTemp);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Popover>
  );
}
