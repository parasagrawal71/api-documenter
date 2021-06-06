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

  /* ########################### VARIABLES HERE ########################### */
  const tableHeaders = [
    {
      displayName: "Name",
      key: "name",
      required: true,
    },
    {
      displayName: "Type",
      key: "type",
      required: true,
    },
    {
      displayName: "Required",
      key: "required",
    },
    {
      displayName: "Unique",
      key: "unique",
      required: true,
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
            if (field?.error) {
              field.error[payload?.headerKey] = undefined;
            }
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

  /* ########################### FUNCTIONS HERE ########################### */
  const handleEditSaveBtn = async () => {
    if (!editMode) {
      if (!model?.fields?.length) {
        dispatchModel({
          type: "add-modelField",
        });
      }
      setEditMode(true);
    } else {
      const requiredFields = [];
      tableHeaders?.filter((h) => {
        if (h.required) {
          requiredFields.push(h.key);
        }
        return h;
      });

      let isError = false;
      model?.fields?.map((fieldObj, index) => {
        const isErrorObj = {};

        requiredFields?.map((reqFieldName) => {
          if (!fieldObj?.[reqFieldName]) {
            isErrorObj.rowIndex = index;
            isErrorObj.value = {
              ...isErrorObj?.value,
              [reqFieldName]: true,
            };
            isError = true;
          }
          return reqFieldName;
        });

        dispatchModel({
          type: "update-modelField",
          payload: {
            headerKey: "error",
            rowIndex: isErrorObj?.rowIndex,
            value: isErrorObj?.value,
          },
        });

        return fieldObj;
      });

      if (isError) {
        return;
      }

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
          zeroStateText="No Fields added yet"
        />
      </section>
    </section>
  );
};

export default Model;
