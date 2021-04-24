/* eslint-disable */

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const prettyPrintJson = (jsonData) => {
  const prettyJson = JSON.stringify(jsonData, undefined, 2);
  return prettyJson;
};
