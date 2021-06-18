import axios from "axios";

// IMPORTS //
import { SERVER_URL_LOCAL, SERVER_URL_HEROKU } from "utils/constants";
import { GET, POST, PUT, DELETE } from "./httpConstants";
import handleError from "./handleError";

const request = axios.create({
  baseURL: window.location.origin?.includes("localhost") ? SERVER_URL_LOCAL : SERVER_URL_HEROKU,
});

const apiService = (apiResource, body, config) => {
  const { method, endpoint } = apiResource;

  switch (method.toUpperCase()) {
    case GET:
      return request
        .get(endpoint, config)
        .then((response) => {
          //   console.log("get response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case POST:
      return request
        .post(endpoint, body, config)
        .then((response) => {
          //   console.log("post response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case PUT:
      return request
        .put(endpoint, body, config)
        .then((response) => {
          //   console.log("put response:- ", response);
          return response?.data;
        })
        .catch((e) => handleError(e));

    case DELETE:
      return request
        .delete(endpoint, config)
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
