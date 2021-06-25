import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { readCookie } from "utils/cookie";

const RouteWrapper = ({ component: Component, isPrivate, ...rest }) => {
  let signed = false;

  const token = readCookie("token");
  signed = !!token;

  if (isPrivate && !signed) {
    toast.error("Please login first");
    toast.clearWaitingQueue();
    return <Redirect to="/" />;
  }

  if (signed && rest?.path === "/") {
    return <Redirect to="/dashboard" />;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...rest} component={Component} />;
};

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.elementType]).isRequired,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};

export default RouteWrapper;
