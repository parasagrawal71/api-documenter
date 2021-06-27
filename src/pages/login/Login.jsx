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
import googleIcon from "assets/images/google-icon.svg";
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
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showGoogleBtn, setShowGoogleBtn] = useState(true);
  const [pwdPatternValidation, setPwdPatternValidation] = useState(false);
  const [loaders, setLoaders] = useState({});

  const login = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().login, null, {
      params: { email: getValues("email"), password: getValues("password") },
    });
    if (response?.success) {
      const { token, expiry } = response?.data;
      resetForm();
      setCookie("token", token, expiry);
      setCookie("tokenProvider", "documenter");
      props?.history?.push("/dashboard");
    } else {
      if (response?.errorCode === "PASSWORD_NOT_SET") {
        setMode("login");
        setSubmitBtnText({ id: "set_password", value: "Set Password" });
        setPwdPatternValidation(true);
        setShowFields({ email: true, password: true, confirmPassword: true });
        setDisableFields({ email: true });
        setShowGoogleBtn(false);
      }
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
    setLoaders({ submit: false });
  };

  const registerUser = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().register, {
      email: getValues("email"),
      password: getValues("password"),
    });
    if (response?.success) {
      toast.success(response?.message);
      resetForm();
      setMode("login");
      setSubmitBtnText({ id: "login", value: "Login" });
      setShowFields({ email: true, password: true });
      setShowGoogleBtn(true);
      setPwdPatternValidation(false);
    } else {
      if (response?.error?.code === "ALREADY_REGISTERED") {
        resetForm();
        setMode("login");
        setSubmitBtnText({ id: "login", value: "Login" });
        setShowFields({ email: true, password: true });
        setShowGoogleBtn(true);
        setPwdPatternValidation(false);
      }
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
    setLoaders({ submit: false });
  };

  const handleSetPassword = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().setPassword, null, {
      params: { email: getValues("email"), password: getValues("password") },
    });
    if (response?.success) {
      toast.success(response?.message);
      const { token, expiry } = response?.data;
      setCookie("token", token, expiry);
      setCookie("tokenProvider", "documenter");
      props?.history?.push("/dashboard");
      resetForm();
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
    setLoaders({ submit: false });
  };

  const verifyEmailAdress = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().verifyEmail, null, {
      params: {
        email: getValues("email"),
        otp: getValues("otp"),
      },
    });
    if (response?.success) {
      toast.success(response?.message);
      setShowFields({ password: true, confirmPassword: true });
      setRequiredFields({ password: true, confirmPassword: true });
      setSubmitBtnText({ id: "set_password", value: "Set Password" });
      setPwdPatternValidation(true);
      setTimer(null);
      setShowResendOtp(false);
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
    setLoaders({ submit: false });
  };

  const sendOtpToEmail = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().forgotPassword, null, {
      params: { email: getValues("email") },
    });
    if (response?.success) {
      toast.success(response?.message);
      setShowFields({ email: true, otp: true });
      setRequiredFields({ email: true, otp: true });
      setSubmitBtnText({ id: "verify_email", value: "Verify Email" });
      setDisableFields({ email: true });
      setShowResendOtp(true);
      startCountDown(1, setTimer);
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
    setLoaders({ submit: false });
  };

  const handleForgotPassword = async () => {
    setShowFields({ email: true });
    setRequiredFields({ email: true });
    setSubmitBtnText({ id: "send_otp", value: "Send OTP" });
    setShowGoogleBtn(false);
    setShowForgotPassword(false);
  };

  const toggleMode = (newMode) => {
    resetForm();
    setMode(newMode);
    if (newMode === "login") {
      setSubmitBtnText({ id: "login", value: "Login" });
      setShowFields({ email: true, password: true });
      setShowGoogleBtn(true);
      setShowForgotPassword(true);
      setPwdPatternValidation(false);
      setDisableFields({});
    } else {
      setSubmitBtnText({ id: "register", value: "Register" });
      setShowFields({ email: true, password: true, confirmPassword: true });
      setShowGoogleBtn(false);
      setShowForgotPassword(false);
      setPwdPatternValidation(true);
      setDisableFields({});
    }
  };

  const resetForm = () => {
    reset();
    resetRef?.current?.click();
  };

  const onGoogleResponse = async (googleResponse) => {
    setLoaders({ googleBtn: true });
    if (googleResponse?.tokenObj?.id_token) {
      const { id_token: idToken, expires_at: expiresAt } = googleResponse?.tokenObj;

      const response = await apiService(auth().googleLogin, null, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response?.success) {
        setCookie("token", idToken, expiresAt * 1000);
        setCookie("tokenProvider", "google");
        props?.history?.push("/dashboard");
      } else {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
    } else {
      toast.error(googleResponse?.details);
      toast.clearWaitingQueue();
    }
    setLoaders({ googleBtn: false });
  };

  const handleSubmitBtn = () => {
    if (mode === "login") {
      if (submitBtnText?.id === "set_password") {
        handleSetPassword();
      }

      if (submitBtnText?.id === "login") {
        login();
      }

      if (submitBtnText?.id === "send_otp") {
        sendOtpToEmail();
      }

      if (submitBtnText?.id === "verify_email") {
        verifyEmailAdress();
      }
    } else {
      registerUser();
    }
  };

  // COMPONENTS HERE
  const emailComponent = () => {
    return (
      <ThemeTextField
        id="email"
        name="email"
        customlabel="Email"
        {...register("email", {
          required: { value: requiredFields?.email, message: "Required" },
          pattern: { value: EMAIL_REGEX, message: "Invalid Email" },
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
            value: pwdPatternValidation ? PASSWORD_REGEX : "",
            message: "At least one upper case, lower case, digit, special character and minimum eight in length",
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
        render={(renderProps) => (
          <ThemeButton
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className={appStyles["google-login"]}
            loader={String(loaders?.googleBtn || false)}
          >
            <img src={googleIcon} alt="Google icon" />
            <span>Login with Google</span>
          </ThemeButton>
        )}
        clientId={GOOGLE_CLIENT_ID}
        scope="profile email"
        onSuccess={onGoogleResponse}
        onFailure={onGoogleResponse}
        cookiePolicy="single_host_origin"
      />
    );
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <form onSubmit={handleSubmit(handleSubmitBtn)} className={appStyles.form}>
        <section className={appStyles["form-header"]}>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: mode === "login",
            })}
            variant="text"
            onClick={() => toggleMode("login")}
          >
            Login
          </ThemeButton>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: mode === "register",
            })}
            variant="text"
            onClick={() => toggleMode("register")}
          >
            Register
          </ThemeButton>
        </section>

        {showFields?.email && emailComponent()}

        {showFields?.password && passwordComponent()}

        {showFields?.confirmPassword && confirmPasswordComponent()}

        {showFields?.otp && otpComponent()}

        <input type="reset" ref={resetRef} style={{ display: "none" }} />

        <ThemeButton type="submit" className={appStyles.submitBtn} loader={String(loaders?.submit || false)}>
          {submitBtnText?.value}
        </ThemeButton>

        {showGoogleBtn && googleLoginButton()}

        <div className={appStyles.footer}>
          {showForgotPassword && (
            <span
              className={appStyles["forgot-pwd"]}
              onClick={handleForgotPassword}
              role="button"
              onKeyDown={() => {}}
              tabIndex="0"
            >
              Forgot your password ?
            </span>
          )}
          {showResendOtp && (
            <>
              <span
                className={cx(appStyles["resend-otp"], {
                  [appStyles.active]: !timer,
                })}
                onClick={() => {
                  if (timer === null) {
                    sendOtpToEmail();
                  }
                }}
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
