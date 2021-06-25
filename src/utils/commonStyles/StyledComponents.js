import React from "react";
import styled from "styled-components";
import { TextField, Checkbox, Button, Switch } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

/* *********************************************************
 * TextField
 * *********************************************************
 */
export const ThemeTextField = styled(
  React.forwardRef((props, ref) => (
    <>
      {props?.customlabel && (
        <label
          style={{
            marginBottom: 5,
          }}
        >
          {props?.customlabel}
        </label>
      )}
      <TextField ref={ref} variant="outlined" size="small" {...props} />
    </>
  ))
)({
  // .MuiTextField-root
  width: ({ customStyle, ...props }) => customStyle?.width || "100%",
  maxWidth: ({ customStyle, ...props }) => customStyle?.maxWidth || "100%",
  minHeight: ({ customStyle, ...props }) => props?.ishelpertext && (customStyle?.minHeight || "60px"),

  ".MuiOutlinedInput-root": {
    fontSize: "0.9em",
    backgroundColor: ({ customStyle, ...props }) =>
      props?.disabled
        ? customStyle?.disabledBgColor || "lightgrey"
        : customStyle?.backgroundColor || "rgba(178, 190, 181, 0.15)",
    borderRadius: ({ customStyle, ...props }) => customStyle?.borderRadius || "5px",
    color: ({ customStyle, ...props }) => customStyle?.color || "#000000",
    // INPUT
    input: {
      padding: ({ customStyle, ...props }) => customStyle?.padding || 8,
      "&::-webkit-calendar-picker-indicator": {
        outline: "none",
        border: "none",
      },
    },
    // FIELDSET
    fieldset: {
      borderWidth: 0,
      border: ({ customStyle, ...props }) =>
        props?.error ? "1px solid var(--error) !important" : customStyle?.border || "",
    },
    "&:hover fieldset": {
      border: ({ customStyle, ...props }) =>
        props?.disabled ? "" : props?.error ? "1px solid var(--error)" : "1px solid lightgrey",
    },
    "&.Mui-focused fieldset": {
      border: ({ customStyle, ...props }) =>
        props?.disabled ? "" : props?.error ? "1px solid var(--error)" : "1px solid lightgrey",
    },
  },

  ".MuiFormHelperText-root": {
    margin: 0,
    fontSize: "0.7em",
    marginTop: 1,
    color: "grey",

    "&.Mui-error": {
      color: "var(--error)",
    },
  },

  ".MuiInputBase-input": {
    "&.Mui-disabled": {
      color: "#000000",
      opacity: 0.5,
    },
  },

  ".MuiInputBase-multiline": {
    padding: 8,
  },
});

/* *********************************************************
 * Checkbox
 * *********************************************************
 */
export const ThemeCheckbox = styled(
  React.forwardRef((props, ref) => (
    <Checkbox ref={ref} color={props?.issecondary ? "secondary" : "primary"} {...props} />
  ))
)({
  padding: 0,
  ".MuiSvgIcon-root": {
    fill: (props) => (!props.checked && props.error ? "var(--error) !important" : ""),
  },
});

/* *********************************************************
 * Switch
 * *********************************************************
 */
export const ThemeSwitch = styled(
  React.forwardRef((props, ref) => <Switch ref={ref} color={props?.issecondary ? "secondary" : "primary"} {...props} />)
)({});

/* *********************************************************
 * Autocomplete
 * *********************************************************
 */
export const ThemeAutocomplete = styled(React.forwardRef((props, ref) => <Autocomplete ref={ref} {...props} />))({
  width: ({ customStyle, ...props }) => customStyle.width || "100%",
  ".MuiInputBase-root": {
    padding: 0,
  },
  label: {
    transform: "translate(14px, 13px) scale(1)",
    fontSize: 12,
  },
  ".MuiAutocomplete-input": {
    fontSize: 13,
  },
});

/* *********************************************************
 * Button
 * *********************************************************
 */
export const ThemeButton = styled(
  React.forwardRef((props, ref) => (
    <Button
      ref={ref}
      variant="contained"
      color={props?.issecondary ? "secondary" : "primary"}
      disableTouchRipple
      {...props}
    />
  ))
)({
  width: ({ customStyle, ...props }) => customStyle?.width,
  boxShadow: "none",
  color: ({ customStyle, ...props }) => customStyle?.color,
});
