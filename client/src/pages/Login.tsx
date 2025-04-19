import React, { useEffect, useMemo, useState } from "react";
import errorImage from "/src/assets/circle-exclamation-solid.svg";
import { validateEmail, validatePassword } from "../lib/validator.ts";
import { loginServ } from "../services/loginServ.ts";
import { LoginForm } from "../types/form.types.ts";
import eyeopen from "./../assets/eye-regular.svg";
import eyeclose from "./../assets/eye-slash-regular.svg";
import ReCAPTCHA from "react-google-recaptcha";

const Login: React.FC = () => {
  const componentName = "login";
  const reCaptchaSiteKey = useMemo(
    () => import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    []
  );
  const isLogin = useMemo(() => localStorage.getItem("isLogin"), []);
  const [showPassword, setShowPassword] = useState(false);
  const [LogInIsLoading, setSignInIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errorsMain, setErrorsMain] = useState("");

  const [showCaptcha, setShowCaptcha] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | null>("");

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    switch (name) {
      case "email":
        const emailError = validateEmail(value);
        setErrors((prev) => ({ ...prev, email: emailError }));

        break;
      case "password":
        const passwordError = validatePassword(value, componentName);
        setErrors((prev) => ({ ...prev, password: passwordError }));

        break;

      default:
        break;
    }
  };

  const submitLogin = async () => {
    console.log("clicked");

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password, componentName);

    if (emailError.trim() === "" && passwordError.trim() === "") {
      if (!captchaToken) {
        setErrorsMain("Please verify the captcha first");
        return;
      } else {
        setErrorsMain("");
      }
      setSignInIsLoading(true);
      try {
        const response = await loginServ(
          form.email,
          form.password,
          captchaToken || ""
        );

        console.log("Login response", response);
        if (response) {
          if (response.success) {
            localStorage.setItem("isLogin", String(response.success));
            localStorage.setItem("userID", response.userId as string);
            localStorage.removeItem("_grecaptcha");
            window.location.href = "/chat";
          } else if (response.emailError) {
            setErrors((prev) => ({ ...prev, email: "Email not found" }));
          } else if (response.passwordError) {
            setErrors((prev) => ({
              ...prev,
              password: "Password is incorrect",
            }));
          } else if (response.limiter) {
            setErrorsMain(response.limiter);
            console.log("response.requiresCaptcha", response.requiresCaptcha);
            setShowCaptcha(response.requiresCaptcha as boolean);
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    } else {
      setErrors({
        email: emailError,
        password: passwordError,
      });
    }

    setSignInIsLoading(false);
  };

  useEffect(() => {
    isLogin ? (window.location.href = "/chat") : "";
  }, [isLogin]);

  return (
    <>
      <div className="flex min-h-full min-w-[50vh] max-w-[80vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to Universal Chat App
          </h2>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submitLogin} className="space-y-6">
            {errorsMain && (
              <label className="text-[rgb(218,44,44)] !mt-0 text-[13px] flex items-center">
                <img
                  src={errorImage}
                  alt="error exclamatory"
                  className="max-w-[5%] mr-1"
                />
                {errorsMain}
              </label>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.email
                      ? "border-rose-600 ring-rose-600"
                      : "border-gray-300 ring-gray-300"
                  }`}
                />
              </div>
            </div>
            {errors.email && (
              <label className="flex items-center !mt-1 text-rose-600 text-xs">
                <img
                  src={errorImage}
                  alt="error exclamatory"
                  className="max-w-[5%] mr-1"
                />
                {errors.email}
              </label>
            )}

            <div className="!mt-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.password
                      ? "border-rose-600 ring-rose-600"
                      : "border-gray-300 ring-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent"
                >
                  <img
                    src={showPassword ? eyeopen : eyeclose}
                    alt="toggle visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            {errors.password && (
              <label className="flex items-center !mt-1 text-rose-600 text-xs">
                <img
                  src={errorImage}
                  alt="error exclamatory"
                  className="max-w-[5%] mr-1"
                />
                {errors.password}
              </label>
            )}
            <div className="flex flex-col items-center">
              {showCaptcha && (
                <ReCAPTCHA
                  sitekey={reCaptchaSiteKey!}
                  onChange={handleCaptcha}
                />
              )}
            </div>

            <div>
              <button
                type="button"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  submitLogin();
                }}
                disabled={LogInIsLoading}
              >
                {LogInIsLoading ? "Signing in" : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Dont have account yet? Signup{" "}
            <a
              href="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
