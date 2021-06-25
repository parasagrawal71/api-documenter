import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY } from "config";

/**
 * @description Function to store cookie
 * @param {String} cname cookie name
 * @param {*} cvalue cookie value
 */
export const setCookie = (cname, cvalue, expiry) => {
  if (cname === "token") {
    cvalue = CryptoJS.AES.encrypt(cvalue, ENCRYPTION_KEY).toString();
  }

  const expiryTime = new Date(expiry || 2147483647 * 1000).toUTCString();
  document.cookie = `${cname}=${encodeURIComponent(cvalue)};expires=${expiryTime};path=/;`;
};

/**
 * @description Function to read cookie value by name
 * @param {String} cname cookie name
 */
export const readCookie = (cname) => {
  const cookieName = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i += 1) {
    const cookieItem = cookieArray[i].trim();
    if (cookieItem.indexOf(cookieName) === 0) {
      let cookieValue = cookieItem.substring(cookieName.length, cookieItem.length);

      if (cname === "token") {
        const bytes = CryptoJS.AES.decrypt(cookieValue, ENCRYPTION_KEY);
        cookieValue = bytes && bytes.toString(CryptoJS.enc.Utf8);
      }
      return cookieValue;
    }
  }
};

/**
 * @description Function to delete cookie by its name
 * @param {String} cname cookie name
 */
export const deleteCookie = (cname) => {
  const currentTime = new Date();
  currentTime.setTime(currentTime.getTime() - 12 * 60 * 60 * 1000);
  document.cookie = `${cname}=;expires=${currentTime.toUTCString()};path=/;`;
};

/**
 * @description Function to clear session by deleting data from cookies and localStorage
 *
 */
export const clearSession = () => {
  window.localStorage.clear();
  deleteAllCookies();
};

/**
 * @description Function to delete all cookies
 *
 */
export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i];
    const cookieName = cookie.split("=")[0];
    deleteCookie(cookieName);
  }
};
