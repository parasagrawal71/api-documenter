import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import cx from "classnames";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";

// IMPORT USER-DEFINED COMPONENTS HERE
import { EMAIL_REGEX, PASSWORD_REGEX, NUMBERS_REGEX } from "utils/constants";
import { ThemeTextField, ThemeButton } from "utils/commonStyles/StyledComponents";
import apiService from "apis/apiService";
import { auth } from "apis/urls";
import { setCookie } from "utils/cookie";
import { startCountDown } from "utils/functions";
import { GOOGLE_CLIENT_ID } from "config";

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
  const [submitBtnText, setSubmitBtnText] = useState({ id: "login", value: "Login" });
  const [requiredFields, setRequiredFields] = useState({ email: true, password: true, confirmPassword: true });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [timer, setTimer] = useState();
  const [showGoogleBtn, setShowGoogleBtn] = useState(true);

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
    if (submitBtnText?.id === "send_otp") {
      const response = await apiService(auth().register, {
        email: getValues("email"),
      });
      if (response?.success) {
        toast.success(response?.message);
        setDisableFields({ email: true });
        setRequiredFields({ otp: true });
        setSubmitBtnText({ id: "verify_email", value: "Verify Email" });
        setShowResendOtp(true);
        startCountDown(1, setTimer);
      } else {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
    } else if (submitBtnText?.id === "verify_email") {
      const response = await apiService(auth().verifyEmail, {
        email: getValues("email"),
        otp: getValues("otp"),
      });
      if (response?.success) {
        toast.success(response?.message);
        setShowFields({ password: true, confirmPassword: true });
        setRequiredFields({ password: true, confirmPassword: true });
        setSubmitBtnText({ id: "set_password", value: "Set Password" });
      } else {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
    } else if (submitBtnText?.id === "set_password") {
      const response = await apiService(auth().setPassword, {
        email: getValues("email"),
        password: getValues("password"),
      });
      if (response?.success) {
        toast.success(response?.message);
        const { token, expiry } = response?.data;
        setCookie("token", token, expiry);
        props?.history?.push("/dashboard");
        resetForm();
      } else {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
    }
  };

  const handleResendOtp = async () => {
    const response = await apiService(auth().resendOtp, {
      email: getValues("email"),
    });
    if (response?.success) {
      toast.success(response?.message);
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
      setSubmitBtnText({ id: "login", value: "Login" });
      setShowFields({ email: true, password: true });
    } else {
      setSubmitBtnText({ id: "send_otp", value: "Send OTP" });
      setShowFields({ email: true, otp: true });
      setDisableFields({ otp: true });
    }
  };

  const resetForm = () => {
    reset();
    resetRef?.current?.click();
  };

  const onGoogleResponse = async (googleResponse) => {
    if (googleResponse?.tokenObj?.id_token) {
      const { id_token: idToken, expires_at: expiresAt } = googleResponse?.tokenObj;

      const response = await apiService(auth().googleLogin, null, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response?.success) {
        setCookie("token", idToken, expiresAt * 1000);
        props?.history?.push("/dashboard");
      } else {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
    } else {
      toast.error(googleResponse?.details);
      toast.clearWaitingQueue();
    }
  };

  // COMPONENTS HERE
  const emailComponent = () => {
    return (
      <ThemeTextField
        id="email"
        name="email"
        customlabel="Email"
        type="email"
        {...register("email", {
          required: { value: requiredFields?.email, message: "Required" },
          pattern: { value: EMAIL_REGEX, message: "Wrong Format" },
        })}
        error={!!errors?.email}
        className={appStyles.inputTextField}
        disabled={disableFields?.email}
        helperText={errors?.email?.message}
        ishelpertext="true"
      />
    );
  };

  const otpComponent = () => {
    return (
      <ThemeTextField
        id="otp"
        name="otp"
        customlabel="Otp"
        {...register("otp", {
          required: { value: requiredFields?.otp, message: "Required" },
          pattern: {
            value: mode === "register" ? NUMBERS_REGEX : "",
            message: "Numbers only",
          },
        })}
        error={!!errors?.otp}
        className={appStyles.inputTextField}
        disabled={disableFields?.otp}
        helperText={errors?.otp?.message}
        ishelpertext="true"
        inputProps={{ maxLength: 4 }}
      />
    );
  };

  const passwordComponent = () => {
    return (
      <ThemeTextField
        id="password"
        name="password"
        customlabel="Password"
        type="password"
        {...register("password", {
          required: { value: requiredFields?.password, message: "Required" },
          pattern: {
            value: mode === "register" ? PASSWORD_REGEX : "",
            message: "At least one upper case, lower case, digit, special character and Minimum eight in length",
          },
        })}
        error={!!errors?.password}
        className={appStyles.inputTextField}
        disabled={disableFields?.password}
        helperText={errors?.password?.message}
        ishelpertext="true"
        autoComplete="new-password"
        inputProps={{ maxLength: 50 }}
      />
    );
  };

  const confirmPasswordComponent = () => {
    return (
      <ThemeTextField
        id="confirmPassword"
        name="confirmPassword"
        customlabel="Confirm Password"
        type="password"
        {...register("confirmPassword", {
          required: { value: requiredFields?.confirmPassword, message: "Required" },
          pattern: {
            value: new RegExp(getValues("password")),
            message: "Passwords do not match",
          },
        })}
        error={!!errors?.confirmPassword}
        className={appStyles.inputTextField}
        disabled={disableFields?.confirmPassword}
        helperText={errors?.confirmPassword?.message}
        ishelpertext="true"
        autoComplete="new-password"
        inputProps={{ maxLength: 50 }}
      />
    );
  };

  const googleLoginButton = () => {
    return (
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        scope="profile email"
        buttonText="Login with Google"
        onSuccess={onGoogleResponse}
        onFailure={onGoogleResponse}
        cookiePolicy="single_host_origin"
        className={appStyles["google-login"]}
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

        {showFields?.email && emailComponent()}

        {showFields?.password && passwordComponent()}

        {showFields?.confirmPassword && confirmPasswordComponent()}

        {showFields?.otp && otpComponent()}

        <input type="reset" ref={resetRef} style={{ display: "none" }} />

        <ThemeButton type="submit" className={appStyles.submitBtn}>
          {submitBtnText?.value}
        </ThemeButton>

        {showGoogleBtn && googleLoginButton()}

        <div className={appStyles.footer}>
          {showForgotPassword && <span className={appStyles["forgot-pwd"]}>Forgot your password ?</span>}
          {showResendOtp && (
            <>
              <span
                className={cx(appStyles["resend-otp"], {
                  [appStyles.active]: !timer,
                })}
                onClick={handleResendOtp}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                Resend OTP
              </span>
              {timer && <span>&nbsp;in {timer}</span>}
            </>
          )}
        </div>
      </form>
    </section>
  );
};

export default Login;
