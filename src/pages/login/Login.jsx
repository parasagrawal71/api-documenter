import React from "react";

// IMPORT USER-DEFINED COMPONENTS HERE

// IMPORT ASSETS HERE
import appStyles from "./Login.module.scss";

const Login = (props) => {
  const login = () => {
    props?.history?.push("/dashboard");
  };

  return (
    <div>
      <button type="button" onClick={login}>
        Login
      </button>
    </div>
  );
};

export default Login;
