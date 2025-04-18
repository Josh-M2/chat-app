import React, { useEffect, useState } from "react";
import errorImage from "/src/assets/circle-exclamation-solid.svg";
import api from "../services/api.ts";

interface SignupForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const isLogin = localStorage.getItem("isLogin");
  useEffect(() => {
    isLogin ? (window.location.href = "/chat") : "";
  }, [isLogin]);

  const [LogInIsLoading, setSignInIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignupForm>({
    email: "",
    password: "",
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

      default:
        break;
    }
  };

  const submitLogin = async () => {
    setSignInIsLoading(true);
    validateEmail(form.email);
    validatePassword(form.password);

    if (!errors.email || !errors.password) {
      try {
        if (!errors.email || !errors.password) {
          const response = await api.post(
            "/auth/login",
            {
              email: form.email,
              password: form.password,
            },
            {
              withCredentials: true,
            }
          );

          console.log("Login response", response.data);
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

    setSignInIsLoading(false);
  };

  const validateEmail = async (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email address is required",
      }));
      return;
    }

    if (!re.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      return;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: "",
    }));
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      return;
    }
    if (!(password.length >= 12)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 12 characters",
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      password: "",
    }));
  };

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

            <div>
              <button
                type="button"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  submitLogin();
                }}
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
