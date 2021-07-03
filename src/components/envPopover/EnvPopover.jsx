import React, { useState, useEffect } from "react";
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
  Tooltip,
} from "@material-ui/core";
import {
  AddCircleOutlined as AddIcon,
  RemoveCircleOutlined as RemoveIcon,
  Delete as DeleteIcon,
  Restore as ResetIcon,
} from "@material-ui/icons";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

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
    setOpenConfirmPopup,
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

  const checkIfUniqueKeysAndSetError = () => {
    const variables = getValues("variables");
    const keyArr = variables.map((item) => item.key);

    let isDuplicate = false;
    keyArr.map((item, idx) => {
      if (keyArr.indexOf(item) !== idx) {
        setError(`variables.${idx}.key`, true);
        isDuplicate = true;
      }
      return item;
    });
    return isDuplicate;
  };

  const checkIfAnyKeysFieldEmpty = () => {
    const variables = getValues("variables");
    return variables?.some((variable) => !variable.key);
  };

  const handleReset = () => {
    reset({ variables: [...(selectedEnvOldData?.variables || [])] });
    setError("variables", {});
  };

  const handleDeleteEnv = () => {
    setOpenConfirmPopup({
      open: true,
      envMID: selectedEnv?._id,
      message: "Are you sure you want to delete the environment?",
    });
  };

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
        if (checkIfUniqueKeysAndSetError()) {
          toast.error("Duplicate keys!");
          return;
        }

        if (checkIfAnyKeysFieldEmpty()) {
          toast.error("Required fields are missing");
          return;
        }

        // const lastIndex = getValues("variables")?.length - 1;
        // if (!getValues("variables")?.[lastIndex]?.key) {
        //   remove(lastIndex);
        // }

        const selectedEnvTemp = { ...selectedEnv };
        selectedEnvTemp.variables = getValues("variables");
        handleCloseEnvPopover(selectedEnvTemp);
      }}
      disableRestoreFocus
    >
      <section>
        <div className={appStyles.envTitle}>
          <div className={appStyles["envTitle--left"]}>
            <span>{selectedEnv?.envName}</span>
            <span>
              <Tooltip title="Add New Variable">
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
              </Tooltip>
            </span>
          </div>
          <div className={appStyles["envTitle--right"]}>
            <Tooltip title="Delete Environment">
              <DeleteIcon className={appStyles.deleteIcon} onClick={handleDeleteEnv} />
            </Tooltip>
            <Tooltip title="Reset">
              <ResetIcon className={appStyles.resetIcon} onClick={handleReset} />
            </Tooltip>
          </div>
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
                  <TableCell style={{ paddingRight: 0 }}>
                    <Tooltip title="Remove Variable">
                      <RemoveIcon
                        className={appStyles.addRemoveIcon}
                        onClick={() => {
                          remove(rowIndex);
                        }}
                      />
                    </Tooltip>
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
