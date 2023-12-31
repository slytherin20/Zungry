import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { saveAccountDetails } from "../utils/firestore_utils";
import {
  CHECK_ICON,
  CLOSE_BTN,
  EDIT_ICON,
  LOADING_BLACK,
} from "../utils/constants";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";

export default function Account() {
  const [, user] = useOutletContext();
  const [err, setErr] = useState("");
  const [editType, setEditType] = useState({
    mobile: false,
    address: false,
  });
  const [inpVals, setInpVals] = useState({
    mobile: 0,
    address: "",
  });
  const [loading, setLoading] = useState({
    mobile: false,
    address: false,
  });
  const navigate = useNavigate();
  const details = useSelector((store) => store.account.profileDetails);

  function changeMobileEditMode() {
    setEditType({
      ...editType,
      mobile: !editType.mobile,
    });
  }

  function changeAddressEditMode() {
    setEditType({
      ...editType,
      address: !editType.address,
    });
  }
  function clearError() {
    setErr("");
  }
  function validateMobileNumber() {
    if (!/^[6-9][0-9]{9}$/.test(inpVals.mobile)) {
      setErr("Invalid Mobile Number");
      return false;
    }
    clearError();
    return true;
  }
  function changeInpHandler(e) {
    setInpVals({
      ...inpVals,
      [e.target.id]: e.target.value,
    });
  }
  async function submitDetails(type) {
    setLoading({
      ...loading,
      [type]: true,
    });
    //validateField
    if (type == "mobile") {
      let isValid = validateMobileNumber();
      if (!isValid) {
        setLoading({
          ...loading,
          mobile: false,
        });
        return;
      }
    }

    //Save details in db
    let obj = {
      ...details,
    };
    obj[type] = inpVals[type];
    let res = await saveAccountDetails(user, obj);

    setLoading({
      ...loading,
      [type]: false,
    });
    setEditType({
      ...editType,
      [type]: !editType[type],
    });
    if (res) {
      toast.success("Account details successfully updated!");
    } else {
      toast.error("Unable to save details.Please try agai later");
    }
  }

  if (user === null) navigate("/route-error");
  else if (!user) return null;
  return (
    <form className="h-95 w-96 rounded-3xl border border-gray-200 font-sans lp m-auto mt-9 p-5 mb-12">
      <h1 className="text-lg font-bold mb-3 mt-3">Account Details</h1>
      <hr></hr>
      <div className="flex justify-between items-center mb-3 mt-3">
        <label htmlFor="first" className="w-2/5">
          <b>First Name</b>
          <p>{details.first}</p>
        </label>
        <label htmlFor="last" className="w-2/5">
          <b>Last Name</b>
          <p>{details.last}</p>
        </label>
      </div>
      <label htmlFor="mobileNumber" className="block mb-3 mt-3">
        <p className="font-bold">Mobile Number</p>
        {editType.mobile ? (
          <section className="update-mobile flex w-full justify-between items-center">
            <input
              type="number"
              placeholder="Enter mobile number"
              value={inpVals.mobile ? inpVals.mobile : null}
              id="mobile"
              onChange={changeInpHandler}
              onBlur={validateMobileNumber}
              className="h-8 border-2 border-black"
            />
            <div className="flex">
              {loading.mobile ? (
                <img src={LOADING_BLACK} className="w-4 h-4 animate-spin" />
              ) : inpVals.mobile ? (
                <img
                  src={CHECK_ICON}
                  alt="submit updating mobile number"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => submitDetails("mobile")}
                />
              ) : null}
              <img
                src={CLOSE_BTN}
                alt="cancel updating mobile number"
                className="w-4 h-4 cursor-pointer ml-3"
                onClick={() => {
                  clearError();
                  changeMobileEditMode();
                }}
              />
            </div>
          </section>
        ) : (
          <section className="display-saved-mobile flex w-full justify-between">
            <p>{details.mobile}</p>
            <img
              src={EDIT_ICON}
              alt="change mobile number"
              className="w-4 h-4 cursor-pointer"
              onClick={changeMobileEditMode}
            />
          </section>
        )}
        {err && <p className="text-red-700">{err}</p>}
      </label>

      <label htmlFor="email" className="block mb-3 mt-3">
        <p className="font-bold">E-mail Address </p>
        <p>{details.email}</p>
      </label>
      <label htmlFor="deliveryAddress" className="block mb-3 mt-3">
        <p className="font-bold">Delivery Address</p>
        {editType.address ? (
          <section className="update-address  flex w-full justify-between items-center">
            <input
              type="text"
              placeholder="Enter delivery address"
              value={inpVals.address}
              id="address"
              onChange={changeInpHandler}
              className="h-8  border-black border-2"
            />
            <div className="flex">
              {loading.address ? (
                <img src={LOADING_BLACK} className="w-4 h-4 animate-spin" />
              ) : (
                inpVals.address && (
                  <img
                    src={CHECK_ICON}
                    alt="submit updating delivery address"
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => submitDetails("address")}
                  />
                )
              )}
              <img
                src={CLOSE_BTN}
                alt="cancel updating delivery address"
                className="w-4 h-4 cursor-pointer ml-4"
                onClick={changeAddressEditMode}
              />
            </div>
          </section>
        ) : (
          <section className="display-saved-address flex w-full justify-between">
            <p>{details.address}</p>
            <img
              src={EDIT_ICON}
              alt="change delivery address"
              className="w-4 h-4 cursor-pointer"
              onClick={changeAddressEditMode}
            />
          </section>
        )}
      </label>
    </form>
  );
}
