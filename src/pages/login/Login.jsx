import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import cx from "classnames";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";

// IMPORT USER-DEFINED COMPONENTS HERE
import { EMAIL_REGEX, PASSWORD_REGEX, NUMBERS_REGEX, APP_NAME } from "utils/constants";
import { ThemeTextField, ThemeButton } from "utils/commonStyles/StyledComponents";
import apiService from "apis/apiService";
import { auth } from "apis/urls";
import { setCookie } from "utils/cookie";
import { startCountDown } from "utils/functions";
import { GOOGLE_CLIENT_ID } from "config";
import { fetchLoggedInUserData } from "apis/apiCalls";
import useGlobal from "redux/globalHook";
import SnackbarComponent from "subComponents/snackBar/SnackBar";

// IMPORT ASSETS HERE
import googleIcon from "assets/images/google-icon.svg";
import apiLogo from "assets/images/api-logo-64px.png";
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
  const [globalState, globalActions] = useGlobal();
  const [tab, setTab] = useState("login");
  const [showFields, setShowFields] = useState({});
  const [disableFields, setDisableFields] = useState({});
  const [submitButton, setSubmitButton] = useState({});
  const [requiredFields, setRequiredFields] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showGoogleBtn, setShowGoogleBtn] = useState(false);
  const [pwdPatternValidation, setPwdPatternValidation] = useState(false);
  const [loaders, setLoaders] = useState({});
  const [snackBar, setSnackBar] = useState({});

  useEffect(() => {
    modifyStates("LOGIN");
  }, []);

  const login = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().login, null, {
      params: { email: getValues("email"), password: getValues("password") },
    });
    if (response?.success) {
      const { token, expiry, user } = response?.data;
      resetForm();
      setCookie("userToken", token, expiry);
      setCookie("tokenProvider", "documenter");
      setCookie("userMID", user?._id);
      fetchLoggedInUserData().then((userData) => {
        globalActions.updateLoggedInUser(userData);
      });
      props?.history?.push("/dashboard");
    } else {
      let isErrorToast = true;

      if (response?.errorCode === "PASSWORD_NOT_SET") {
        modifyStates("SET_PASSWORD");
      }

      if (response?.errorCode === "USER_NOT_VERIFIED") {
        setSnackBar({ show: true, message: `Your email is not verified yet.` });
        isErrorToast = false;
      }

      if (isErrorToast) {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
    }
    setLoaders({ submit: false });
  };

  const registerUser = async () => {
    setLoaders({ submit: true });
    const response = await apiService(auth().register, {
      email: getValues("email"),
      password: getValues("password"),
      name: getValues("name"),
    });
    if (response?.success) {
      toast.success(response?.message);
      resetForm();
      modifyStates("LOGIN");
    } else {
      let isErrorToast = true;

      if (response?.error?.code === "ALREADY_REGISTERED") {
        resetForm();
        modifyStates("LOGIN");
      }

      if (response?.error?.code === "USER_NOT_VERIFIED") {
        setSnackBar({ show: true, message: `Your email is not verified yet.` });
        isErrorToast = false;
      }

      if (isErrorToast) {
        toast.error(response?.message);
        toast.clearWaitingQueue();
      }
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
      const { token, expiry, user } = response?.data;
      setCookie("userToken", token, expiry);
      setCookie("tokenProvider", "documenter");
      setCookie("userMID", user?._id);
      fetchLoggedInUserData().then((userData) => {
        globalActions.updateLoggedInUser(userData);
      });
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
      modifyStates("SET_PASSWORD");
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
      modifyStates("VERIFY_EMAIL");
      startCountDown(1, setTimer);
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
    setLoaders({ submit: false });
  };

  const handleForgotPassword = async () => {
    resetForm();
    modifyStates("SEND_OTP");
  };

  const toggleMode = (newMode) => {
    resetForm();
    setTab(newMode);
    if (newMode === "login") {
      modifyStates("LOGIN");
    } else {
      modifyStates("REGISTER");
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
        setCookie("userToken", idToken, expiresAt * 1000);
        setCookie("tokenProvider", "google");
        setCookie("userMID", response?.data?._id);
        fetchLoggedInUserData().then((userData) => {
          globalActions.updateLoggedInUser(userData);
        });
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
    if (tab === "login") {
      if (submitButton?.id === "set_password") {
        handleSetPassword();
      }

      if (submitButton?.id === "login") {
        login();
      }

      if (submitButton?.id === "send_otp") {
        sendOtpToEmail();
      }

      if (submitButton?.id === "verify_email") {
        verifyEmailAdress();
      }
    } else {
      registerUser();
    }
  };

  const handleResendVerificationEmail = async () => {
    setSnackBar({ show: false });
    resetForm();
    modifyStates("LOGIN");
    const response = await apiService(auth().resendVerificationEmail, null, {
      params: {
        email: getValues("email"),
      },
    });
    if (response?.success) {
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
      toast.clearWaitingQueue();
    }
  };

  const modifyStates = (mode) => {
    if (mode === "LOGIN") {
      setTab("login");
      setSubmitButton({ id: "login", value: "Login" });
      setShowFields({ email: true, password: true });
      setRequiredFields({ email: true, password: true });
      setDisableFields({});
      setShowGoogleBtn(true);
      setShowForgotPassword(true);
      setShowResendOtp(false);
      setTimer(null);
      setPwdPatternValidation(false);
    } else if (mode === "REGISTER") {
      setTab("register");
      setSubmitButton({ id: "register", value: "Register" });
      setShowFields({ name: true, email: true, password: true, confirmPassword: true });
      setRequiredFields({ name: true, email: true, password: true, confirmPassword: true });
      setDisableFields({});
      setShowGoogleBtn(false);
      setShowForgotPassword(false);
      setShowResendOtp(false);
      setTimer(null);
      setPwdPatternValidation(true);
    } else if (mode === "SET_PASSWORD") {
      setTab("login");
      setSubmitButton({ id: "set_password", value: "Set Password" });
      setShowFields({ email: true, password: true, confirmPassword: true });
      setRequiredFields({ email: true, password: true, confirmPassword: true });
      setDisableFields({ email: true });
      setShowGoogleBtn(false);
      setShowForgotPassword(false);
      setShowResendOtp(false);
      setTimer(null);
      setPwdPatternValidation(true);
    } else if (mode === "SEND_OTP") {
      setTab("login");
      setSubmitButton({ id: "send_otp", value: "Send OTP" });
      setShowFields({ email: true });
      setRequiredFields({ email: true });
      setDisableFields({});
      setShowGoogleBtn(false);
      setShowForgotPassword(false);
      setShowResendOtp(false);
      setTimer(null);
      setPwdPatternValidation(false);
    } else if (mode === "VERIFY_EMAIL") {
      setTab("login");
      setSubmitButton({ id: "verify_email", value: "Verify Email" });
      setShowFields({ email: true, otp: true });
      setRequiredFields({ email: true, otp: true });
      setDisableFields({ email: true });
      setShowGoogleBtn(false);
      setShowForgotPassword(false);
      setShowResendOtp(true);
      setTimer("01:00");
    }
  };

  // COMPONENTS HERE
  const nameComponent = () => {
    return (
      <ThemeTextField
        id="name"
        name="name"
        customlabel="Name"
        {...register("name", {
          required: { value: requiredFields?.name, message: "Required" },
        })}
        error={!!errors?.name}
        className={appStyles.inputTextField}
        disabled={disableFields?.name}
        helperText={errors?.name?.message}
        ishelpertext="true"
      />
    );
  };

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
            value: tab === "register" ? NUMBERS_REGEX : "",
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
        <section className={appStyles["main-header"]}>
          <img src={apiLogo} alt="API" />
          <div className={appStyles["main-header__appName"]}>{APP_NAME}</div>
        </section>
        <section className={appStyles["form-header"]}>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: tab === "login",
            })}
            variant="text"
            onClick={() => toggleMode("login")}
          >
            Login
          </ThemeButton>
          <ThemeButton
            className={cx(appStyles["header-button"], {
              [appStyles.active]: tab === "register",
            })}
            variant="text"
            onClick={() => toggleMode("register")}
          >
            Register
          </ThemeButton>
        </section>

        {showFields?.name && nameComponent()}

        {showFields?.email && emailComponent()}

        {showFields?.password && passwordComponent()}

        {showFields?.confirmPassword && confirmPasswordComponent()}

        {showFields?.otp && otpComponent()}

        <input type="reset" ref={resetRef} style={{ display: "none" }} />

        <ThemeButton type="submit" className={appStyles.submitBtn} loader={String(loaders?.submit || false)}>
          {submitButton?.value}
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

      <SnackbarComponent
        snackBar={snackBar}
        stayOpen
        severity="warning"
        isButton
        buttonText="Resend Email Verification"
        buttonCallback={handleResendVerificationEmail}
        handleClose={() => {
          setSnackBar({ show: false });
        }}
      />
    </section>
  );
};

export default Login;
