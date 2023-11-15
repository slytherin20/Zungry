import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { saveAccountDetails } from "../utils/firestore_utils";
import { CLOSE_BTN, EDIT_ICON, LOADING_ICON } from "../utils/constants";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Account() {
  const [, user] = useOutletContext();
  const [editType, setEditType] = useState({
    mobile: false,
    address: false,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const details = useSelector((store) => store.account.profileDetails);

  useEffect(() => {
    if (details.first) {
      setLoading(false);
    }
  }, [details]);
  function changeEditType(e) {
    setEditType({
      ...editType,
      [e.target.id]: !editType[e.target.id],
    });
    let field = e.target.id == "mobile" ? "mobileNumber" : "deliveryAddress";
    let value = details[e.target.id] ? details[e.target.id] : "";
    formik.setFieldValue(field, value);
  }
  const validate = (values) => {
    const errors = {};
    if (!details.mobile) {
      if (!values.mobileNumber) errors.mobileNumber = "*Required";
      else if (String(values.mobileNumber).length != 10)
        errors.mobileNumber = "Invalid phone number.";
      else if (typeof values.mobileNumber !== "number")
        errors.mobileNumber = "Only digits allowed.";
    }

    if (!values.deliveryAddress && !details.address)
      errors.deliveryAddress = "*Required";
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      deliveryAddress: "",
    },
    validate,
    onSubmit: async (values) => {
      if (
        !formik.errors.mobileNumber &&
        !formik.errors.deliveryAddress &&
        details.first
      ) {
        //Set loading to true
        setLoading(true);
        let res = await saveAccountDetails(user, {
          first: details.first,
          last: details.last,
          mobile: values.mobileNumber || details.mobile,
          email: details.email,
          address: values.deliveryAddress || details.address,
        });
        if (!res) {
          toast.error(
            "Unable to save details currently. Please try again later."
          );
        } else {
          setLoading(false);
          toast.success("Account Details Saved!");
          navigate("/");
        }
      }
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="h-95 w-96 rounded-3xl border border-gray-200 font-sans lp m-auto mt-9 p-5 mb-12"
    >
      <h1 className="text-lg font-bold mb-3 mt-3">Account Details</h1>
      <div className="flex justify-between items-center">
        <label htmlFor="first" className="w-2/5">
          <b>First Name</b>
          <p>{details.first}</p>
        </label>
        <label htmlFor="last" className="w-2/5">
          <b>Last Name</b>
          <p>{details.last}</p>
        </label>
      </div>
      <label htmlFor="mobileNumber">
        <p className="font-bold">Mobile Number</p>
        {details.mobile ? (
          !editType.mobile ? (
            <section className="flex">
              <p>{details.mobile}</p>
              <img
                src={EDIT_ICON}
                alt="edit mobile"
                id="mobile"
                width="16"
                height="16"
                onClick={changeEditType}
                className="w-4 h-4 ml-2"
              />
            </section>
          ) : (
            <section className="flex items-center">
              <input
                type="number"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id="mobileNumber"
                name="mobileNumber"
                className="w-60 h-7 outline outline-1 outline-red-700 rounded-sm "
              ></input>
              <img
                src={CLOSE_BTN}
                alt="cancel edit"
                id="mobile"
                onClick={changeEditType}
                width="16"
                height="16"
                className="w-4 h-4 ml-2"
              />
            </section>
          )
        ) : (
          <input
            type="number"
            id="mobileNumber"
            name="mobileNumber"
            value={formik.values.mobileNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-60 h-7 outline outline-1 outline-red-700 rounded-sm"
          ></input>
        )}
      </label>
      {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
        <p className="text-red-600" data-testid="mobileNumber-error">
          {formik.errors.mobileNumber}
        </p>
      ) : null}
      <label htmlFor="email">
        <p className="font-bold">E-mail Address </p>
        <p>{details.email}</p>
      </label>
      <label htmlFor="deliveryAddress">
        <p className="font-bold">Delivery Address</p>
        {details.address ? (
          !editType.address ? (
            <section className="flex">
              <p>{details.address}</p>
              <img
                src={EDIT_ICON}
                alt="Edit Delivery Address"
                id="address"
                onClick={changeEditType}
                width="16"
                height="16"
                className="w-4 h-4 ml-2"
              />
            </section>
          ) : (
            <section className="flex items-center">
              <textarea
                name="deliveryAddress"
                id="deliveryAddress"
                value={formik.values.deliveryAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-60 h-48 outline outline-1 outline-red-700 rounded-sm resize-none"
              ></textarea>
              <img
                src={CLOSE_BTN}
                alt="cancel edit"
                id="address"
                onClick={changeEditType}
                width="16"
                height="16"
                className="w-4 h-4 ml-2"
              />
            </section>
          )
        ) : (
          <textarea
            name="deliveryAddress"
            id="deliveryAddress"
            value={formik.values.deliveryAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-60 h-48 outline outline-1 outline-red-700 rounded-sm resize-none"
          ></textarea>
        )}
      </label>
      {formik.touched.deliveryAddress && formik.errors.deliveryAddress ? (
        <p className="text-red-600" data-testid="deliveryAddress-error">
          {formik.errors.deliveryAddress}
        </p>
      ) : null}
      <div className="flex items-center  w-full mt-4">
        <button
          type="submit"
          disabled={
            !details.first ||
            loading ||
            formik.errors.mobileNumber ||
            formik.errors.deliveryAddress
          }
          className={`w-32 h-8 text-white rounded-md mr-5 flex justify-center items-center ${
            formik.errors.mobileNumber ||
            formik.errors.deliveryAddress ||
            !details.first
              ? "bg-red-500 cursor-not-allowed"
              : "bg-red-700"
          }`}
        >
          {loading ? (
            <div className="spinner w-5 h-5 animate-spin">
              <img src={LOADING_ICON} alt="loading" width="20" height="20" />
            </div>
          ) : (
            <span>Save</span>
          )}
        </button>
        <Link to="/">
          <button
            type="button"
            className="w-32 h-8 bg-white border text-red-800 border-red-800 rounded-md"
          >
            Later
          </button>
        </Link>
      </div>
    </form>
  );
}
