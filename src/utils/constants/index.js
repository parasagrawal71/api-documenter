/*
 * URLs
 */
export const SERVER_URL_LOCAL = "http://localhost:5001/api/v1";
export const SERVER_URL_HEROKU = "https://api-documenter-server.herokuapp.com/api/v1";

/*
 * REGEXs
 */
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
// PASSWORD_REGEX: At least one upper case, one lower case, one digit, one special character and Minimum eight in length
