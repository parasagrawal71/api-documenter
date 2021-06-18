import React, { useState, useEffect } from "react";
import { Dialog, Button } from "@material-ui/core";

// IMPORT USER-DEFINED COMPONENTS HERE
import { ThemeTextField } from "utils/commonStyles/styledComponents";

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
      open={openPopup}
      classes={{ paper: appStyles["dialog-cnt"] }}
      className={appStyles["main-cnt"]}
      onClose={() => {
        setOpenPopup({});
      }}
    >
      <section>
        <div className={appStyles["field-cnt"]}>
          <ThemeTextField
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

        {placeholder2 && (
          <div className={appStyles["field-cnt"]}>
            <ThemeTextField
              variant="outlined"
              size="small"
              InputLabelProps={{
                focused: false,
              }}
              placeholder={placeholder2}
              value={fieldTwo}
              onChange={(e) => setFieldTwo(e?.target?.value)}
            />
          </div>
        )}
      </section>

      <section className={appStyles["action-btns"]}>
        <div>
          <Button
            variant="outlined"
            onClick={() => {
              handleSave(fieldOne, fieldTwo);
              setOpenPopup({});
              setFieldOne("");
              setFieldTwo("");
            }}
          >
            Save
          </Button>
        </div>
      </section>
    </Dialog>
  );
};

export default TextfieldPopup;
