import React, { useState, useEffect, useReducer } from "react";
import { Button, Tooltip } from "@material-ui/core";
import { AddCircleOutlined as AddIcon } from "@material-ui/icons";

// IMPORT USER-DEFINED COMPONENTS HERE
import AppTableComponent from "components/appTable/AppTable";
import apiService from "apis/apiService";
import { schema } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./Model.module.scss";

const Model = (props) => {
  // PROPS HERE
  // const {} = props;

  // REDUCERS HERE
  const modelReducers = (state, action) => {
    let payload = null;

    switch (action?.type) {
      case "add-modelField":
        const updatedFieldsAfterAddition = [...state?.fields];
        updatedFieldsAfterAddition?.push({
          name: "",
        });
        return { ...state, fields: updatedFieldsAfterAddition };

      case "update-modelField":
        payload = action?.payload;
        const updatedFields = state?.fields?.map((field, index) => {
          if (index === payload?.rowIndex) {
            field[payload?.headerKey] = payload?.value;
            return field;
          }
          return field;
        });
        payload = null;
        return { ...state, fields: updatedFields };

      case "remove-modelField":
        payload = action?.payload;
        const updatedModelAfterRemoval = state?.fields?.filter(
          (field, index) => index !== payload?.rowIndex
        );
        return { ...state, fields: updatedModelAfterRemoval };

      default:
        throw new Error("Unknown type");
    }
  };

  // HOOKS HERE
  const [editMode, setEditMode] = useState(false);
  const [model, dispatchModel] = useReducer(modelReducers, props?.model);

  useEffect(() => {
    if (!props?.model?.fields?.length) {
      dispatchModel({
        type: "add-modelField",
      });
    }
  }, [props?.model]);

  /* ########################### VARIABLES HERE ########################### */
  const tableHeaders = [
    {
      displayName: "Name",
      key: "name",
    },
    {
      displayName: "Type",
      key: "type",
    },
    {
      displayName: "Required",
      key: "required",
    },
    {
      displayName: "Unique",
      key: "unique",
    },
    {
      displayName: "Description",
      key: "description",
    },
  ];

  const modelFieldTypes = [
    {
      type: "string",
    },
    {
      type: "number",
    },
    {
      type: "boolean",
    },
    {
      type: "object",
    },
    {
      type: "array of primitives",
    },
    {
      type: "array of objects",
    },
    {
      type: "array of arrays",
    },
  ];

  /* ########################### FUNCTIONS HERE ########################### */
  const handleEditSaveBtn = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      const response = await apiService(schema(model?._id).put, model);
      if (response?.success) {
        //
      } else {
        //
      }
      setEditMode(false);
    }
  };

  return (
    <section id={model?.fileName} className={appStyles["main-cnt"]}>
      <section className={appStyles["main-header"]}>
        <div className={appStyles["main-header--left"]}>
          <span className={appStyles.title}>{model?.fileName}</span>
          {editMode && (
            <AddIcon
              className={appStyles.addIcon}
              onClick={() => {
                dispatchModel({ type: "add-modelField" });
              }}
            />
          )}
        </div>
        <div className={appStyles["main-header--right"]}>
          <Button variant="outlined" onClick={handleEditSaveBtn}>
            {!editMode ? "Edit" : "Save"}
          </Button>
        </div>
      </section>

      <section className={appStyles.content}>
        <AppTableComponent
          tableHeaders={tableHeaders}
          tableRows={model?.fields}
          arrayKey="modelFields"
          dispatchModel={dispatchModel}
          editMode={editMode}
          modelFieldTypes={modelFieldTypes}
        />
      </section>
    </section>
  );
};

export default Model;
