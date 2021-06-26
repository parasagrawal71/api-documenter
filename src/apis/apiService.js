import axios from "axios";

// IMPORTS //
import { SERVER_URL_LOCAL, SERVER_URL_HEROKU } from "utils/constants";
import { getUrlParams } from "utils/functions";
import { readCookie } from "utils/cookie";
import { GET, POST, PUT, DELETE, PATCH } from "./httpConstants";
import handleError from "./handleError";

const request = axios.create({
  baseURL: window.location.origin?.includes("localhost") ? SERVER_URL_LOCAL : SERVER_URL_HEROKU,
});

const apiService = (apiResource, body, { params, headers, ...restConfig } = {}) => {
  const { method, endpoint } = apiResource;

  const paramsObj = getUrlParams();

  const configToRequest = {
    params: { serviceMID: paramsObj?.serviceMID, ...(params || {}) },
    headers: { Authorization: `Bearer ${readCookie("token")}`, ...(headers || {}) },
    ...(restConfig || {}),
  };

  switch (method.toUpperCase()) {
    case GET:
      return request
        .get(endpoint, configToRequest)
        .then((response) => {
          //   console.log("get response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case POST:
      return request
        .post(endpoint, body, configToRequest)
        .then((response) => {
          //   console.log("post response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case PUT:
      return request
        .put(endpoint, body, configToRequest)
        .then((response) => {
          //   console.log("put response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case DELETE:
      return request
        .delete(endpoint, configToRequest)
        .then((response) => {
          //   console.log("delete response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case PATCH:
      return request
        .patch(endpoint, body, configToRequest)
        .then((response) => {
          //   console.log("delete response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    default:
      return "Wrong call";
  }
};

export default apiService;

// endpoint example: /api/{id}

// config
// {
//   params,
//   headers
// }
