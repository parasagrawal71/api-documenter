import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Popover } from "@material-ui/core";
import { AddCircleOutlined as AddIcon, RemoveCircleOutlined as RemoveIcon } from "@material-ui/icons";
import { useForm, useFieldArray } from "react-hook-form";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField } from "utils/commonStyles/StyledComponents";
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
    selectedEnvOldData,
    setSelectedEnvOldData,
  } = props;

  const classes = useStyles();

  // HOOKs HERE
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    setError,
    control,
    formState: { errors },
  } = useForm({
    mode: "all",
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "variables",
  });

  useEffect(() => {
    // console.log("selectedEnv?.variables: ", selectedEnv?.variables);

    // DOESN'T WORK
    // setValue("variables", [...(selectedEnv?.variables || [])], { shouldDirty: true });

    // WORKS
    // selectedEnv?.variables?.map((variable, index) => {
    //   setValue(`variables.${index}.key`, variable.key, { shouldDirty: true });
    //   setValue(`variables.${index}.value`, variable.value, { shouldDirty: true });
    //   return variable;
    // });

    // WORKS
    reset({ variables: [...(selectedEnv?.variables || [])] });
    setError("variables", {});
    // console.log("watch: ", watch("variables"));

    // eslint-disable-next-line
  }, [selectedEnv]);

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
      onClose={() => {
        const lastIndex = getValues("variables")?.length - 1;
        if (!getValues("variables")?.[lastIndex]?.key) {
          remove(lastIndex);
        }
        const selectedEnvTemp = { ...selectedEnv };
        selectedEnvTemp.variables = getValues("variables");
        handleCloseEnvPopover(selectedEnvTemp);
      }}
      disableRestoreFocus
    >
      <section>
        <div className={appStyles.envTitle}>
          <span>{selectedEnv?.envName}</span>
          <span>
            <AddIcon
              className={appStyles.addRemoveIcon}
              onClick={() => {
                const variablesTemp = getValues("variables");
                if (variablesTemp?.length && !variablesTemp?.[variablesTemp?.length - 1]?.key) {
                  setError(`variables.${variablesTemp?.length - 1}.key`, true);
                  return;
                }
                append({ key: "", value: "" });
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
              {fields?.map((field, rowIndex) => (
                <TableRow key={field.id}>
                  <TableCell className={appStyles.padding10px}>
                    <ThemeTextField
                      name={field.key}
                      {...register(`variables.${rowIndex}.key`, {
                        required: { value: true, message: "Required" },
                      })}
                      defaultValue={field.key}
                      error={!!errors?.variables?.[rowIndex]?.key}
                    />
                  </TableCell>
                  <TableCell className={appStyles.padding10px}>
                    <ThemeTextField
                      name={field.value}
                      {...register(`variables.${rowIndex}.value`)}
                      defaultValue={field.value}
                    />
                  </TableCell>
                  <TableCell>
                    <RemoveIcon
                      className={appStyles.addRemoveIcon}
                      onClick={() => {
                        remove(rowIndex);
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
