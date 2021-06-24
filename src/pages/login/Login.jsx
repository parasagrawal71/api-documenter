import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import { EMAIL_REGEX, PASSWORD_REGEX } from "utils/constants";
import { ThemeTextField, ThemeButton } from "utils/commonStyles/StyledComponents";

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

  const login = () => {
    props?.history?.push("/dashboard");
  };

  const toggleMode = () => {
    reset();
    resetRef?.current?.click();
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <form onSubmit={handleSubmit(login)} className={appStyles.form}>
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

        {mode === "register" && (
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
            <span className={appStyles["error-msg"]}>
              {errors?.confirmPassword && errors?.confirmPassword?.message}
            </span>
          </>
        )}

        <input type="reset" ref={resetRef} style={{ display: "none" }} />

        <ThemeButton type="submit" className={appStyles.button}>
          {mode === "login" ? "Login" : "Register"}
        </ThemeButton>
      </form>
    </section>
  );
};

export default Login;
