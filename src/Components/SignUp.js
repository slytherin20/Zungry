import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
export default function SignUp() {
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
      email: Yup.string().email("Invalid E-mail Address").required("Required"),
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
      console.log(values);
    },
  });
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
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <p className="text-red-600">{formik.errors.firstName}</p>
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
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <p className="text-red-600">{formik.errors.lastName}</p>
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
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="text-red-600">{formik.errors.email}</p>
        ) : null}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="h-8 mb-5 border border-gray-300 rounded-md outline-none"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="text-red-600">{formik.errors.password}</p>
        ) : null}
        <label htmlFor="reenterPassword">Re-Enter the Password</label>
        <input
          type="password"
          name="reenterPassword"
          id="reenterPassword"
          className="h-8 mb-5 border border-gray-300 rounded-md outline-none"
          value={formik.values.reenterPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.reenterPassword && formik.errors.reenterPassword ? (
          <p className="text-red-600">{formik.errors.reenterPassword}</p>
        ) : null}
        <button type="submit" className="bg-red-600 h-8 text-white rounded-md">
          Sign Up
        </button>
        <Link to="/login">
          <p className="underline text-red-600 my-4">Existing User? Login!</p>
        </Link>
      </form>
    </div>
  );
}
