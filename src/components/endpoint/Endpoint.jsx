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

// IMPORT ASSETS HERE
import appStyles from "./Endpoint.module.scss";

const Endpoint = (props) => {
  // PROPS HERE
  const { endpoint } = props;
  const {
    method,
    path,
    title,
    description,
    parameters,
    requestHeaders,
    requestBody,
    responseBody,
  } = endpoint || {};

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();

  const prettyPrintJson = (jsonData) => (
    <pre>{JSON.stringify(jsonData, null, 2)}</pre>
  );

  return (
    <section className={appStyles["main-container"]}>
      <div className={appStyles.title}>{title}</div>
      <div className={appStyles["method-path"]}>
        {method && path && (
          <>
            <span className={appStyles.method}>{method}</span>
            <span className={appStyles.path}>{path}</span>
          </>
        )}
      </div>
      <div className={appStyles.description}>{description}</div>

      {/* PARAMETERS */}
      <section className={appStyles.parameters}>
        <div className={appStyles.parameters__title}>Parameters</div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Style</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parameters?.map((param) => (
                <TableRow key={param.name}>
                  <TableCell component="th" scope="row">
                    {param.name}
                  </TableCell>
                  <TableCell>{param.type}</TableCell>
                  <TableCell>{param.style}</TableCell>
                  <TableCell>{param.required}</TableCell>
                  <TableCell>{param.value}</TableCell>
                  <TableCell>{param.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      {/* REQUEST HEADERS */}
      <section className={appStyles["request-headers"]}>
        <div className={appStyles["request-headers__title"]}>Headers</div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestHeaders?.map((reqHeader) => (
                <TableRow key={reqHeader.name}>
                  <TableCell component="th" scope="row">
                    {reqHeader.name}
                  </TableCell>
                  <TableCell>{reqHeader.required}</TableCell>
                  <TableCell>{reqHeader.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      {/* REQUEST BODY */}
      <section className={appStyles["request-response-bodies"]}>
        <section className={appStyles["request-body"]}>
          <div className={appStyles["request-body__title"]}>Request Body</div>
          <div className={appStyles["request-body__json"]}>
            {prettyPrintJson(requestBody)}
          </div>
        </section>

        <section className={appStyles["response-body"]}>
          <div className={appStyles["response-body__title"]}>Response Body</div>
          <div className={appStyles["response-body__json"]}>
            {prettyPrintJson(responseBody)}
          </div>
        </section>
      </section>
    </section>
  );
};

export default Endpoint;
