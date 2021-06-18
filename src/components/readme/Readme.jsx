import React, { useRef, useEffect, useState, useReducer } from "react";
import { Button, Tooltip } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import apiService from "apis/apiService";
import { readme } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./Readme.module.scss";

const Readme = (props) => {
  // PROPS HERE
  // const {} = props;

  // REFS HERE
  const readmeTextareaRef = useRef(null);

  // HOOKS HERE
  const [editMode, setEditMode] = useState(false);
  const [readmeFile, setReadmeFile] = useState(props?.readmeFile);

  useEffect(() => {
    enableTabIndentationInTextArea();

    // eslint-disable-next-line
  }, [editMode]);

  const enableTabIndentationInTextArea = () => {
    const textAreaEle = document.getElementById("readme-textarea");

    if (!textAreaEle) {
      return;
    }

    textAreaEle.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();

        // Get the cursor position
        const { selectionStart, selectionEnd } = e.target;

        // update the state
        const currentValue = e.target.value;
        setReadmeFile({
          ...readmeFile,
          content: `${currentValue.substring(0, selectionStart)}${"\t"}${currentValue.substring(selectionEnd)}`,
        });

        // update the cursor position after the state is updated
        // eslint-disable-next-line
        readmeTextareaRef.current.selectionStart = readmeTextareaRef.current.selectionEnd = selectionStart + 1;
      }
    });
  };

  const handleEditSaveBtn = () => {
    setEditMode(!editMode);
    if (editMode) {
      putReadme();
    }
  };

  const putReadme = async () => {
    const response = await apiService(readme(readmeFile?._id).put, readmeFile);
    if (response?.success) {
      //
    } else {
      //
    }
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <section className={appStyles["main-header"]}>
        <div className={appStyles.title}>{readmeFile?.fileName}</div>
        <div className={appStyles["main-header--right"]}>
          <Button variant="outlined" onClick={handleEditSaveBtn}>
            {!editMode ? "Edit" : "Save"}
          </Button>
        </div>
      </section>
      {editMode ? (
        <textarea
          ref={readmeTextareaRef}
          id="readme-textarea"
          className={appStyles["readme-textarea"]}
          rows="15"
          value={readmeFile?.content}
          onChange={(e) => {
            setReadmeFile({
              ...readmeFile,
              content: e?.target?.value,
            });
          }}
          // disabled={}
        />
      ) : (
        <pre className={appStyles["readme-value"]}>{readmeFile?.content}</pre>
      )}
    </section>
  );
};

export default Readme;
