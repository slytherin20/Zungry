import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  CART_ICON,
  USER_ICON,
  FOOD_LOGO,
  SEARCH_ICON,
} from "../utils/constants";
import { getAuth } from "firebase/auth";
import { addFromLocal, cartRestaurant } from "../Store/CartSlice";

export default function Header({ searchResults, user }) {
  const [search, setSearch] = useState("");
  let cartItems = [];
  cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  if (cartItems && cartItems.length == 0) {
    let items = JSON.parse(localStorage.getItem("items"));
    let restaurant = JSON.parse(localStorage.getItem("restaurant"));
    if (items.length > 0) {
      dispatch(cartRestaurant(restaurant));
      dispatch(addFromLocal(items));
    }
  }
  const auth = getAuth();
  const navigate = useNavigate();
  function changeSearchVal(e) {
    setSearch(e.target.value);
  }

  function logOutHandler() {
    auth.signOut();
    navigate("/login");
  }

  return (
    <div
      className="flex w-full justify-between items-center shadow-md flex-col sm:flex-row p-2"
      data-testid="header"
    >
      <div className="flex items-center flex-col-reverse sm:flex-row">
        <p className="text-2xl sm:text-4xl text-red-600" data-testid="app-name">
          Zungry
        </p>
        <img
          src={FOOD_LOGO}
          className="w-14 h-14"
          data-testid="app-logo"
          alt="A man in red clothes with red helment riding a scooter for food delivery"
        />
      </div>
      <div className="h-10 shadow-md rounded-lg flex flex-row items-center w-full sm:w-96">
        <input
          type="search"
          className="h-full rounded-lg w-11/12 p-1 outline-none "
          placeholder="Search for a restaurant"
          onChange={changeSearchVal}
          data-testid="search-bar"
          name="searchbar"
          id="searchbar"
          autoComplete="on"
        />
        <img
          src={SEARCH_ICON}
          alt="search"
          onClick={() => searchResults(search)}
          width="24"
          height="24"
          className="w-7 h-7"
          data-testid="search-btn"
        />
      </div>
      <div className="flex flex-row w-full sm:w-80 mr-1 justify-between">
        <Link to="/">
          <span>Home</span>
        </Link>
        <Link to="/about">
          <span>About Us</span>
        </Link>
        <Link to="/contact">
          <span>Contact Us</span>
        </Link>
        <Link to="/cart">
          <div className="inline-block">
            <img src={CART_ICON} alt="cart" className="w-7 h-7" />
            <span data-testid="cart-count">{cartItems.length}</span>
          </div>
        </Link>
        {user ? (
          <>
            <img src={USER_ICON} width="40" height="40" />
            <button type="button" onClick={logOutHandler} data-testid="Logout">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button type="button" data-testid="Login">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
