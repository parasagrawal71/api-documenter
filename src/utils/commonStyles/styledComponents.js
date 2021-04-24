import styled from "styled-components";
import { TextField } from "@material-ui/core";

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
