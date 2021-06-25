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
  } = useForm({ mode: "all" });
  const [mode, setMode] = useState("login");
  const [showFields, setShowFields] = useState({ email: true, password: true });
  const [disableFields, setDisableFields] = useState({});

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
      // resetForm({}, { keepValues: true, keepErrors: true });
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const registerUser = async () => {
    const response = await apiService(auth().register); // { email: getValues("email"), password: getValues("password") }
    if (response?.success) {
      const { token, expiry } = response?.data;
      resetForm();
      // setCookie("token", token, expiry);
      // props?.history?.push("/dashboard");
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const toggleMode = () => {
    resetForm();
    const newMode = mode === "login" ? "register" : "login";
    setMode(newMode);
    if (newMode === "login") {
      setShowFields({ email: true, password: true });
    } else {
      setShowFields({ email: true, password: true, confirmPassword: true });
    }
  };

  const resetForm = () => {
    reset();
    resetRef?.current?.click();
  };

  // COMPONENTS HERE
  const EmailComponent = () => {
    return (
      <ThemeTextField
        id="email"
        name="email"
        customlabel="Email"
        {...register("email", {
          required: { value: true, message: "Required" },
          pattern: { value: EMAIL_REGEX, message: "Wrong Format" },
        })}
        error={errors?.email}
        className={appStyles.inputTextField}
        disabled={disableFields?.email}
        helperText={errors?.email?.message}
        ishelpertext="true"
      />
    );
  };

  const PasswordComponent = () => {
    return (
      <ThemeTextField
        id="password"
        name="password"
        customlabel="Password"
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
        error={errors?.password}
        className={appStyles.inputTextField}
        disabled={disableFields?.password}
        helperText={errors?.password?.message}
        ishelpertext="true"
      />
    );
  };
  const ConfirmPasswordComponent = () => {
    return (
      <ThemeTextField
        id="confirmPassword"
        name="confirmPassword"
        customlabel="Confirm Password"
        type="password"
        {...register("confirmPassword", {
          required: { value: true, message: "Required" },
          maxLength: { value: 50, message: "Max 50 Characters" },
          pattern: {
            value: new RegExp(getValues("password")),
            message: "Passwords do not match",
          },
        })}
        error={errors?.confirmPassword}
        className={appStyles.inputTextField}
        disabled={disableFields?.confirmPassword}
        helperText={errors?.confirmPassword?.message}
        ishelpertext="true"
      />
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
            variant="text"
            onClick={toggleMode}
          >
            Login
          </ThemeButton>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: mode === "register",
            })}
            variant="text"
            onClick={toggleMode}
          >
            Register
          </ThemeButton>
        </section>

        {showFields?.email && <EmailComponent />}

        {showFields?.password && <PasswordComponent />}

        {showFields?.confirmPassword && <ConfirmPasswordComponent />}

        <input type="reset" ref={resetRef} style={{ display: "none" }} />

        <ThemeButton type="submit" className={appStyles.submitBtn}>
          {mode === "login" ? "Login" : "Register"}
        </ThemeButton>
      </form>
    </section>
  );
};

export default Login;
