import styled from "styled-components";
import { TextField, Checkbox } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const ThemeTextField = styled(TextField)({
  width: (props) => (props?.width ? props.width : "100%"),
  maxWidth: (props) => (props?.maxWidth ? props.maxWidth : "100%"),
  ".MuiOutlinedInput-root": {
    fontSize: "0.9em",
    backgroundColor: (props) =>
      props?.disabled ? "lightgrey" : "rgb(178, 190, 181, 0.15)",
    borderRadius: (props) => (props?.borderRadius ? props.borderRadius : "5px"),
    color: (props) => (props?.color ? props.color : "#000000"),
    "& fieldset": {
      borderWidth: 0,
      border: (props) => (props.isError ? "1px solid red" : ""),
    },
    "&:hover fieldset": {
      border: (props) => (props.disabled ? "" : "1px solid lightgrey"),
    },
    "&.Mui-focused fieldset": {
      border: (props) => (props.disabled ? "" : "1px solid lightgrey"),
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

export const ThemeCheckbox = styled(Checkbox)({
  padding: 0,
});

export const ThemeAutocomplete = styled(Autocomplete)({
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
