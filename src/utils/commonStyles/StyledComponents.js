import React from "react";
import styled from "styled-components";
import { TextField, Checkbox, Button, Switch } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const ThemeTextField = styled((props) => (
  <TextField {...props} variant={props?.variant || "outlined"} size="small" />
))({
  width: (props) => (props?.width ? props.width : "100%"),
  maxWidth: (props) => (props?.maxWidth ? props.maxWidth : "100%"),
  ".MuiOutlinedInput-root": {
    fontSize: "0.9em",
    backgroundColor: (props) =>
      props?.disabled
        ? props?.disabledBgColor || "lightgrey"
        : props?.backgroundColor
        ? props?.backgroundColor
        : "rgba(178, 190, 181, 0.15)",
    borderRadius: (props) => (props?.borderRadius ? props.borderRadius : "5px"),
    color: (props) => (props?.color ? props.color : "#000000"),
    "& fieldset": {
      borderWidth: 0,
      border: (props) => (props.iserror ? "1px solid var(--error)" : ""),
    },
    "&:hover fieldset": {
      border: (props) => (props.disabled ? "" : props.iserror ? "1px solid var(--error)" : "1px solid lightgrey"),
    },
    "&.Mui-focused fieldset": {
      border: (props) => (props.disabled ? "" : props.iserror ? "1px solid var(--error)" : "1px solid lightgrey"),
    },
    input: {
      padding: 8,

      "&::-webkit-calendar-picker-indicator": {
        outline: "none",
        border: "none",
      },
    },
  },
  ".MuiInputBase-input.Mui-disabled": {
    color: "#000000",
  },
  ".MuiInputBase-multiline": {
    padding: 8,
  },
});

export const ThemeCheckbox = styled((props) => (
  <Checkbox {...props} color={props?.backgroundColor || props?.issecondary ? "secondary" : "primary"} />
))({
  padding: 0,
  ".MuiSvgIcon-root": {
    fill: (props) => (!props.checked && props.iserror ? "var(--error) !important" : ""),
  },
});

export const ThemeSwitch = styled((props) => (
  <Switch {...props} color={props?.backgroundColor || props?.issecondary ? "secondary" : "primary"} />
))({});

export const ThemeAutocomplete = styled((props) => <Autocomplete {...props} />)({
  width: (props) => (props?.width ? props.width : "100%"),
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

export const ThemeButton = styled((props) => (
  <Button
    {...props}
    variant={props?.variant || "contained"}
    color={props?.backgroundColor || props?.issecondary ? "secondary" : "primary"}
    disableTouchRipple
  />
))({
  width: (props) => props?.width,
  boxShadow: "none",
  color: (props) => props?.color,
});
