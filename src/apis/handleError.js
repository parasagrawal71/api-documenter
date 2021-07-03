// IMPORTS //
import { deleteAllCookies } from "utils/cookie";
import {
  NOT_FOUND,
  FORBIDDEN,
  UNAUTHORIZED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  REQUEST_TIMED_OUT,
} from "./httpConstants";

const handleError = (error) => {
  // console.log("handleError error:- ", error);
  // console.log("handleError error.response:- ", error.response);
  // console.log("handleError error.response:- ", error.message);
  const status = error.response ? error.response.status : null;
  switch (status) {
    case NOT_FOUND:
      // "Server could not find the requested information.";
      return error?.response?.data;

    case FORBIDDEN:
      // "FORBIDDEN";
      return error?.response?.data;

    case UNAUTHORIZED:
      deleteAllCookies();
      window.location.href = "/";
      // "UNAUTHORIZED";
      return error?.response?.data;

    case BAD_REQUEST:
      // "BAD REQUEST";
      return error?.response?.data;

    case INTERNAL_SERVER_ERROR:
      // "INTERNAL SERVER ERROR";
      return error?.response?.data;

    case REQUEST_TIMED_OUT:
      // "REQUEST TIMED OUT";
      return error?.response?.data;

    default:
      return error?.response?.data || error?.message;
  }
};

export default handleError;
