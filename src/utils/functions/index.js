/* eslint-disable */

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const prettyPrintJson = (jsonData) => {
  if (jsonData && typeof jsonData === "object" && !Array.isArray(jsonData)) {
    const prettyJson = JSON.stringify(
      typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData,
      undefined,
      2
    );
    return prettyJson;
  }

  return jsonData;
};

export const sortObjectKeys = (obj) => {
  if (obj && typeof obj == "object" && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    keys.sort();
    return keys;
  }
};

export const sortArrayOfObjs = (arr, byKey) => {
  if (arr && byKey && Array.isArray(arr)) {
    return arr.sort((a, b) => a?.[byKey]?.localeCompare(b?.[byKey]));
  }
};

export const getStatusText = (statusCode) => {
  const statuses = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    501: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  return statuses[Number(statusCode)];
};

export const validateJSON = (jsonStringToValidate) => {
  try {
    JSON.parse(jsonStringToValidate);
  } catch (e) {
    return false;
  }
  return true;
};
