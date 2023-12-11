import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { HIDE_PASSWORD, SHOW_PASSWORD } from "../utils/constants";
import { toast } from "react-toastify";
import { LOADING_ICON } from "../utils/constants";
import AppLogo from "./AppLogo";
export default function LoginForm() {
  const auth = getAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const validate = (values) => {
    let errors = {};
    if (!values.email) errors.email = "*Required";
    else if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        values.email
      )
    ) {
      errors.email = "Invalid E-mail Address";
    }
    if (!values.password) errors.password = "*Required";
    else if (values.password.length < 8)
      errors.password = "Password must be atleast 8 characters long";
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          setIsLoading(false);
          navigate("/");
        })
        .catch((e) => {
          setIsLoading(false);
          switch (e.code) {
            case "auth/user-not-found":
              toast.error("User not registered. Please signup.");
              navigate("/signup");
              break;
            case "auth/wrong-password":
              toast.error("Incorrect Password");
              break;
            default:
              toast.error("Unknown error encountered.Try again later.");
          }
        });
    },
  });
  function changePwdVisibility() {
    setPasswordVisible(!passwordVisible);
  }
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <AppLogo isHomepage={false} />
      <div className=" h-96 rounded-3xl border border-gray-200 font-sans lp m-2">
        <h1 className="text-center text-2xl">Login</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-10/12 m-auto"
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="h-8 mb-5 border border-gray-300 rounded-md outline-none"
            placeholder="Enter your E-mail address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            data-testid="email"
            autoComplete="email"
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="text-red-600" data-testid="email-error">
              {formik.errors.email}
            </p>
          ) : null}
          <label htmlFor="password">Password</label>
          <div className="flex h-8 mb-5 border border-gray-300 rounded-md outline-none items-center active:outline">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              data-testid="password"
              autoComplete="current-password"
            />
            {passwordVisible ? (
              <img
                src={HIDE_PASSWORD}
                alt="show password while typing"
                onClick={changePwdVisibility}
                className="w-6 h-6 mr-1"
              />
            ) : (
              <img
                src={SHOW_PASSWORD}
                alt="hide password while typing"
                onClick={changePwdVisibility}
                className="w-6 h-6 mr-1"
              />
            )}
          </div>
          {formik.touched.password && formik.errors.password ? (
            <p className="text-red-600" data-testid="password-error">
              {formik.errors.password}
            </p>
          ) : null}
          {isLoading ? (
            <button
              type="submit"
              className="bg-red-600 text-white h-8 rounded-md flex justify-center items-center"
            >
              <div className="spinner w-5 h-5 animate-spin" id="spinner">
                <img src={LOADING_ICON} alt="loading" width="20" height="20" />
              </div>
            </button>
          ) : (
            <button
              type="submit"
              className="bg-red-600 text-white h-8 rounded-md"
              data-testid="login-btn"
            >
              Login
            </button>
          )}

          <Link to="/signup">
            <p className="underline text-red-600 my-4">
              No Existing Account? Sign Up!
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
}
