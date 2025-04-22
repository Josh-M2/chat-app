import React, { useEffect, useMemo, useState } from "react";
import errorImage from "/src/assets/circle-exclamation-solid.svg";
import {
  validateEmail,
  validatePassword,
  validateRepeatPassword,
} from "../lib/validator.ts";
import { signupServ } from "../services/signupServ.ts";
import { SignupForm } from "../types/form.types.ts";
import eyeopen from "./../assets/eye-regular.svg";
import eyeclose from "./../assets/eye-slash-regular.svg";
import ReCAPTCHA from "react-google-recaptcha";

const Signup: React.FC = () => {
  const componentName = "signup";
  const isLogin = useMemo(() => localStorage.getItem("isLogin"), []);
  const reCaptchaSiteKey = useMemo(
    () => import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    []
  );
  const [signUpIsLoading, setSignUpIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    repeat_password: "",
  });
  const [errors, setErrors] = useState<SignupForm>({
    email: "",
    password: "",
    repeat_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const [errorsMain, setErrorsMain] = useState("");

  // const [showCaptcha, setShowCaptcha] = useState(true);
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
      case "repeat_password":
        const repeat_passwordError = validateRepeatPassword(
          value,
          form.password
        );
        setErrors((prev) => ({
          ...prev,
          repeat_password: repeat_passwordError,
        }));

        break;
      default:
        break;
    }
  };

  const submitSignUP = async () => {
    console.log("clicked");

    const emailerror = validateEmail(form.email);
    const passwordError = validatePassword(form.password, componentName);
    const repeatPassError = validateRepeatPassword(
      form.repeat_password,
      form.password
    );
    if (
      emailerror.trim() === "" &&
      passwordError.trim() === "" &&
      repeatPassError.trim() === ""
    ) {
      if (!captchaToken) {
        setErrorsMain("Please verify the captcha first");
        return;
      } else {
        setErrorsMain("");
      }
      setSignUpIsLoading(true);
      try {
        const response = await signupServ(
          form.email,
          form.password,
          captchaToken || ""
        );

        console.log("singup resp type: ", response);

        if (response?.success) {
          localStorage.setItem("isLogin", String(response.success));
          localStorage.setItem("userID", response.userId as string);
          window.location.href = "/chat";
        } else if (response?.email_taken) {
          setErrors((prev) => ({ ...prev, email: "Email already taken" }));
        }
      } catch (err: any) {
        console.error(err);
      }
    } else {
      setErrors({
        email: emailerror,
        password: passwordError,
        repeat_password: repeatPassError,
      });
    }

    setSignUpIsLoading(false);
  };

  useEffect(() => {
    isLogin && (window.location.href = "/chat");
  }, [isLogin]);

  return (
    <>
      <div className="flex min-h-full min-w-[50vh] max-w-[80vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to Universal Chat App
          </h2>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submitSignUP} className="space-y-6">
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
                  className={`block w-full rounded-md border py-1.5 pr-[45px] text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
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
            <div className="!mt-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="repeat_password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Repeat password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  id="repeat_password"
                  name="repeat_password"
                  type={showPasswordRepeat ? "text" : "password"}
                  value={form.repeat_password}
                  onChange={handleChange}
                  className={`block w-full rounded-md border py-1.5 pr-[45px] text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.repeat_password
                      ? "border-rose-600 ring-rose-600"
                      : "border-gray-300 ring-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent"
                >
                  <img
                    src={showPasswordRepeat ? eyeopen : eyeclose}
                    alt="toggle visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            {errors.repeat_password && (
              <label className="flex items-center !mt-1 text-rose-600 text-xs">
                <img
                  src={errorImage}
                  alt="error exclamatory"
                  className="max-w-[5%] mr-1"
                />
                {errors.repeat_password}
              </label>
            )}

            <div className="flex flex-col items-center">
              <ReCAPTCHA sitekey={reCaptchaSiteKey!} onChange={handleCaptcha} />
            </div>

            <div>
              <button
                type="button"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  submitSignUP();
                }}
                disabled={signUpIsLoading}
              >
                {signUpIsLoading ? "Signing up" : "Sign up"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member? login{" "}
            <a
              href="/"
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

export default Signup;
