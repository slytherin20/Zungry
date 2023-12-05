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
  function validateAddress() {}
  function validateMobileNumber() {}
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
        {editType.mobile ? (
          <section className="update-mobile flex">
            <input
              type="number"
              placeholder="Enter mobile number"
              value={inpVals.mobile ? inpVals.mobile : null}
              id="mobile"
              onChange={changeInpHandler}
            />
            {loading.mobile ? (
              <img src={LOADING_BLACK} className="w-4 h-4 animate-spin" />
            ) : (
              <img
                src={CHECK_ICON}
                alt="submit updating mobile number"
                className="w-4 h-4 cursor-pointer"
                onClick={() => submitDetails("mobile")}
              />
            )}
            <img
              src={CLOSE_BTN}
              alt="cancel updating mobile number"
              className="w-4 h-4 cursor-pointer"
              onClick={changeMobileEditMode}
            />
          </section>
        ) : (
          <section className="display-saved-mobile flex">
            <p>{details.mobile}</p>
            <img
              src={EDIT_ICON}
              alt="change mobile number"
              className="w-4 h-4 cursor-pointer"
              onClick={changeMobileEditMode}
            />
          </section>
        )}
      </label>

      <label htmlFor="email">
        <p className="font-bold">E-mail Address </p>
        <p>{details.email}</p>
      </label>
      <label htmlFor="deliveryAddress">
        <p className="font-bold">Delivery Address</p>
        {editType.address ? (
          <section className="update-address flex">
            <input
              type="text"
              placeholder="Enter delivery address"
              onBlur={validateAddress}
              value={inpVals.address}
              id="address"
              onChange={changeInpHandler}
            />
            {loading.address ? (
              <img src={LOADING_BLACK} className="w-4 h-4 animate-spin" />
            ) : (
              <img
                src={CHECK_ICON}
                alt="submit updating delivery address"
                className="w-4 h-4 cursor-pointer"
                onClick={() => submitDetails("address")}
              />
            )}
            <img
              src={CLOSE_BTN}
              alt="cancel updating delivery address"
              className="w-4 h-4 cursor-pointer"
              onClick={changeAddressEditMode}
            />
          </section>
        ) : (
          <section className="display-saved-address flex">
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
