import React, { useEffect, useState } from "react";
import errorImage from "/src/assets/circle-exclamation-solid.svg";
import api from "../services/api.ts";
import {
  validateEmail,
  validatePassword,
  validateRepeatPassword,
} from "../lib/validator.ts";

interface SignupForm {
  email: string;
  password: string;
  repeat_password: string;
}

const Signup: React.FC = () => {
  const isLogin = localStorage.getItem("isLogin");
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    switch (name) {
      case "email":
        validateEmail(value);

        break;
      case "password":
        validatePassword(value);

        break;
      case "repeat_password":
        validateRepeatPassword(value, form.password);

        break;
      default:
        break;
    }
  };

  const submitSignUP = async () => {
    setSignUpIsLoading(true);
    const emailerror = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const repeatPassError = validateRepeatPassword(
      form.repeat_password,
      form.password
    );
    if (
      emailerror.trim() !== "" ||
      passwordError.trim() !== "" ||
      repeatPassError.trim() !== ""
    ) {
      try {
        if (!errors.email || !errors.password || !errors.repeat_password) {
          const response = await api.post(
            "/auth/signup",
            {
              email: form.email,
              password: form.password,
            },
            {
              withCredentials: true,
            }
          );

          console.log("signup response", response.data);
          if (response.data.success) {
            localStorage.setItem("isLogin", response.data.success);
            localStorage.setItem("userID", response.data.userId);
            window.location.href = "/chat";
          }
        }
      } catch (err: any) {
        console.error(err.response.data.message);
      }
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
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.password
                      ? "border-rose-600 ring-rose-600"
                      : "border-gray-300 ring-gray-300"
                  }`}
                />
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
              <div className="mt-2">
                <input
                  id="repeat_password"
                  name="repeat_password"
                  type="password"
                  value={form.repeat_password}
                  onChange={handleChange}
                  className={`block w-full rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                    errors.repeat_password
                      ? "border-rose-600 ring-rose-600"
                      : "border-gray-300 ring-gray-300"
                  }`}
                />
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

            <div>
              <button
                type="button"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  submitSignUP();
                }}
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
