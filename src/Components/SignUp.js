import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase_config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { saveAccountDetails } from "../utils/firestore_utils";
import { useState } from "react";
import { SHOW_PASSWORD, HIDE_PASSWORD } from "../utils/constants";
export default function SignUp() {
  const [visiblePwd, setVisiblePwd] = useState(false);
  const [visibleCofirmPwd, setVisibleConfirmPwd] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      reenterPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Maximum 20 characters allowed.")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Maximum 20 characters allowed.")
        .required("Required"),
      email: Yup.string()
        .email("Invalid E-mail Address")
        .matches(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
          "Invalid E-mail Address"
        ) //Used RFC2821 Email validation regex
        .required("Required"),
      password: Yup.string()
        .min(8, "Password should be atleast 8 characters long")
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
          "Password should contain atleast one Capital Letter, one digit and one special character"
        )
        .required("Required"),
      reenterPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      createUser(values);
    },
  });

  function createUser(values) {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async () => {
        const user = auth.currentUser.uid;
        try {
          await saveAccountDetails(user, {
            first: formik.values.firstName,
            last: formik.values.lastName,
            email: formik.values.email,
          });
          navigate("/account");
        } catch (err) {
          console.log(err);
        }
      })
      .catch(() => {
        //  notify("Error creating user. Please try again later.");
      });
  }
  function changePwdVisibility() {
    setVisiblePwd(!visiblePwd);
  }

  function changeConfirmPwdVisibility() {
    setVisibleConfirmPwd(!visibleCofirmPwd);
  }
  return (
    <div className="w-96 h-[600px] rounded-3xl border border-gray-200 font-sans sp m-2">
      <h1 className="text-center text-2xl">Sign Up</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col w-10/12 m-auto"
      >
        <div className="flex flex-col">
          <label htmlFor="firstName">
            First Name:
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="h-8 mb-5 border border-gray-300 rounded-md outline-none w-full"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              data-testid="first"
              autoComplete="first-name"
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <p className="text-red-600" data-testid="firstname-error">
                {formik.errors.firstName}
              </p>
            ) : null}
          </label>
          <label htmlFor="lastName">
            Last Name:
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="h-8 mb-5 border border-gray-300 rounded-md outline-none w-full"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              data-testid="last"
              autoComplete="name"
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <p className="text-red-600" data-testid="lastname-error">
                {formik.errors.lastName}
              </p>
            ) : null}
          </label>
        </div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="h-8 mb-5 border border-gray-300 rounded-md outline-none"
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
        <div className="flex h-8 mb-5 border border-gray-300 rounded-md  items-center">
          <input
            type={visiblePwd ? "text" : "password"}
            name="password"
            id="password"
            className="w-full outline-none"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            data-testid="password"
            autoComplete="off"
          />
          {visiblePwd ? (
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
        <label htmlFor="reenterPassword">Re-Enter the Password</label>
        <div className="flex h-8 mb-5 border border-gray-300 rounded-md  items-center">
          <input
            type={visibleCofirmPwd ? "text" : "password"}
            name="reenterPassword"
            id="reenterPassword"
            className="w-full outline-none"
            value={formik.values.reenterPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            data-testid="repassword"
            autoComplete="off"
          />
          {visibleCofirmPwd ? (
            <img
              src={HIDE_PASSWORD}
              alt="show password while typing"
              onClick={changeConfirmPwdVisibility}
              className="w-6 h-6 mr-1"
            />
          ) : (
            <img
              src={SHOW_PASSWORD}
              alt="hide password while typing"
              onClick={changeConfirmPwdVisibility}
              className="w-6 h-6 mr-1"
            />
          )}
        </div>
        {formik.touched.reenterPassword && formik.errors.reenterPassword ? (
          <p className="text-red-600" data-testid="repassword-error">
            {formik.errors.reenterPassword}
          </p>
        ) : null}
        <button
          type="submit"
          className="bg-red-600 h-8 text-white rounded-md"
          data-testid="signup-btn"
        >
          Sign Up
        </button>
        <Link to="/login" data-testid="login-link">
          <p className="underline text-red-600 my-4">Existing User? Login!</p>
        </Link>
      </form>
    </div>
  );
}
