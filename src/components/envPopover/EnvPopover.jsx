import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Popover } from "@material-ui/core";
import { AddCircleOutlined as AddIcon, RemoveCircleOutlined as RemoveIcon } from "@material-ui/icons";

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
  const { openEnvPopover, handleCloseEnvPopover, selectedEnv, setSelectedEnv } = props;

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
      <section>
        <div className={appStyles.envTitle}>
          <span>{selectedEnv?.envName}</span>
          <span>
            <AddIcon
              className={appStyles.addRemoveIcon}
              onClick={() => {
                const selectedEnvTemp = { ...selectedEnv };
                selectedEnvTemp.variables?.push({
                  key: "",
                  value: "",
                });
                setSelectedEnv(selectedEnvTemp);
              }}
            />
          </span>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={appStyles.padding10px}>Name</TableCell>
                <TableCell className={appStyles.padding10px}>Value</TableCell>
                <TableCell />
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
                  <TableCell>
                    <RemoveIcon
                      className={appStyles.addRemoveIcon}
                      onClick={() => {
                        const selectedEnvTemp = { ...selectedEnv };
                        selectedEnvTemp.variables = selectedEnvTemp.variables?.filter(
                          (variable, index) => index !== rowIndex
                        );
                        setSelectedEnv(selectedEnvTemp);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </Popover>
  );
}
