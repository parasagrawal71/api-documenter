/* eslint-disable */

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const prettyPrintJson = (jsonData) => {
  if (jsonData && typeof jsonData === "object") {
    const prettyJson = JSON.stringify(typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData, undefined, 2);
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

// Function to move two items in an array
export const arrayMove = (array, from, to) => {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
};

export const getUrlParams = () => {
  let searchStr = window?.location?.search;
  searchStr = searchStr?.substring(1, searchStr?.length);
  const params = searchStr?.split("&");
  const paramsObj = {};

  for (let i = 0; i < params?.length; i++) {
    let tmpArr = params[i]?.split("=");
    paramsObj[tmpArr[0]] = decodeURIComponent(tmpArr[1]);
  }
  return paramsObj || {};
};

export const startCountDown = (duration, setTimer, onCompleteCallback) => {
  // Duration (in minutes)
  let timer = duration * 60;
  let minutes;
  let seconds;
  const timerInterval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    setTimer(minutes + ":" + seconds);
    --timer;

    if (timer < 0) {
      setTimer(null);
      onCompleteCallback?.();
      clearInterval(timerInterval);
    }
  }, 1000);
};
