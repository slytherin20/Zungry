import { useFormik } from "formik";
import { Link } from "react-router-dom";
export default function LoginForm() {
  const validate = (values) => {
    let errors = {};
    if (!values.email) errors.email = "*Required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
      errors.email = "Invalid E-mail Address";
    if (!values.password) errors.password = "*Required";
    else if (values.password.length < 8)
      errors.password = "Must be atleast 8 characters long";
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="w-96 h-96 rounded-3xl border border-gray-200 font-sans lp m-2">
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
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="text-red-600">{formik.errors.email}</p>
        ) : null}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="h-8 mb-5 border border-gray-300 rounded-md outline-none"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="text-red-600">{formik.errors.password}</p>
        ) : null}
        <button type="submit" className="bg-red-600 text-white h-8 rounded-md">
          Login
        </button>
        <Link to="/signup">
          <p className="underline text-red-600 my-4">
            No Existing Account? Sign Up!
          </p>
        </Link>
      </form>
    </div>
  );
}
