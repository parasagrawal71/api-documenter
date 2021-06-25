import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import cx from "classnames";
import { toast } from "react-toastify";

// IMPORT USER-DEFINED COMPONENTS HERE
import { EMAIL_REGEX, PASSWORD_REGEX } from "utils/constants";
import { ThemeTextField, ThemeButton } from "utils/commonStyles/StyledComponents";
import apiService from "apis/apiService";
import { auth } from "apis/urls";
import { setCookie } from "utils/cookie";

// IMPORT ASSETS HERE
import appStyles from "./Login.module.scss";

const Login = (props) => {
  // REFS HERE
  const resetRef = useRef(null);

  // HOOKS HERE
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [mode, setMode] = useState("login");

  const login = async () => {
    const response = await apiService(auth().login, null, {
      params: { email: getValues("email"), password: getValues("password") },
    });
    if (response?.success) {
      const { token, expiry } = response?.data;
      resetForm();
      setCookie("token", token, expiry);
      props?.history?.push("/dashboard");
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const registerUser = async () => {
    resetForm();
    props?.history?.push("/dashboard");
  };

  const toggleMode = () => {
    resetForm();
    setMode(mode === "login" ? "register" : "login");
  };

  const resetForm = () => {
    reset();
    resetRef?.current?.click();
  };

  // COMPONENTS HERE
  const EmailComponent = () => {
    return (
      <>
        <label htmlFor="email" className={appStyles.label}>
          Email
        </label>
        <ThemeTextField
          id="email"
          {...register("email", {
            required: { value: true, message: "Required" },
            pattern: { value: EMAIL_REGEX, message: "Wrong Format" },
          })}
          iserror={errors?.email}
          className={appStyles.input}
        />
        <span className={appStyles["error-msg"]}>{errors?.email && errors?.email?.message}</span>
      </>
    );
  };

  const PasswordComponent = () => {
    return (
      <>
        <label htmlFor="password" className={appStyles.label}>
          Password
        </label>
        <ThemeTextField
          id="password"
          type="password"
          {...register("password", {
            required: { value: true, message: "Required" },
            maxLength: {
              value: mode === "register" ? 50 : undefined,
              message: "Max 50 Characters",
            },
            pattern: {
              value: mode === "register" ? PASSWORD_REGEX : "",
              message:
                "At least one upper case, one lower case, one digit, one special character and Minimum eight in length",
            },
          })}
          iserror={errors?.password}
          className={appStyles.input}
        />
        <span className={appStyles["error-msg"]}>{errors?.password && errors?.password?.message}</span>
      </>
    );
  };
  const ConfirmPasswordComponent = () => {
    return (
      <>
        <label htmlFor="confirmPassword" className={appStyles.label}>
          Confirm Password
        </label>
        <ThemeTextField
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: { value: true, message: "Required" },
            maxLength: { value: 50, message: "Max 50 Characters" },
            pattern: {
              value: new RegExp(getValues("password")),
              message: "Passwords do not match",
            },
          })}
          iserror={errors?.confirmPassword}
          className={appStyles.input}
        />
        <span className={appStyles["error-msg"]}>{errors?.confirmPassword && errors?.confirmPassword?.message}</span>
      </>
    );
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <form onSubmit={handleSubmit(mode === "login" ? login : registerUser)} className={appStyles.form}>
        <section className={appStyles["form-header"]}>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: mode === "login",
            })}
            variant="default"
            onClick={toggleMode}
          >
            Login
          </ThemeButton>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: mode === "register",
            })}
            variant="default"
            onClick={toggleMode}
          >
            Register
          </ThemeButton>
        </section>

        <EmailComponent />

        <PasswordComponent />

        {mode === "register" && <ConfirmPasswordComponent />}

        <input type="reset" ref={resetRef} style={{ display: "none" }} />

        <ThemeButton type="submit" className={appStyles.button}>
          {mode === "login" ? "Login" : "Register"}
        </ThemeButton>
      </form>
    </section>
  );
};

export default Login;
