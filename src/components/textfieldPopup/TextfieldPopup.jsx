import React, { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField, ThemeAutocomplete, ThemeButton } from "utils/commonStyles/styledComponents";

// IMPORT ASSETS HERE
import appStyles from "./TextfieldPopup.module.scss";

const TextfieldPopup = (props) => {
  // PROPS HERE
  const { openPopup, setOpenPopup, handleSave, placeholder1, placeholder2, endpoint } = props;

  // HOOKS HERE
  const [fieldOne, setFieldOne] = useState("");
  const [fieldTwo, setFieldTwo] = useState("");

  useEffect(() => {
    // return () => {
    //   setOpenPopup({});
    // };
    // eslint-disable-next-line
  }, []);

  return (
    <Dialog
      open={Boolean(openPopup)}
      classes={{ paper: appStyles["dialog-cnt"] }}
      className={appStyles["main-cnt"]}
      onClose={() => {
        setOpenPopup({});
      }}
    >
      <section className={appStyles["fields-wrapper"]}>
        {placeholder2 && (
          <div className={cx(appStyles["field-cnt"], appStyles["method-cnt"])}>
            <ThemeAutocomplete
              options={["GET", "POST", "PUT", "DELETE", "PATCH"]}
              getOptionLabel={(option) => option || ""}
              width="200px"
              renderInput={(params) => (
                <ThemeTextField
                  {...params}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    focused: false,
                  }}
                  placeholder={placeholder2}
                />
              )}
              onChange={(e, selectedOption) => {
                setFieldTwo(selectedOption);
              }}
              value={fieldTwo || ""}
            />
          </div>
        )}

        <div className={appStyles["field-cnt"]}>
          <ThemeTextField
            autoFocus
            variant="outlined"
            size="small"
            InputLabelProps={{
              focused: false,
            }}
            placeholder={placeholder1}
            value={fieldOne}
            onChange={(e) => setFieldOne(e?.target?.value)}
          />
        </div>
      </section>

      <section className={appStyles["action-btns"]}>
        <div>
          <ThemeButton
            disabled={!fieldOne || (placeholder2 && !fieldTwo)}
            onClick={() => {
              handleSave(fieldOne, fieldTwo);
              setOpenPopup({});
              setFieldOne("");
              setFieldTwo("");
            }}
          >
            Save
          </ThemeButton>
        </div>
      </section>
    </Dialog>
  );
};

export default TextfieldPopup;
