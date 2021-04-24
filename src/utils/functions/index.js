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

export const sortObjectKeys = (obj) => {
  if (obj && typeof obj == 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    keys.sort();
    return keys;
  }
}
