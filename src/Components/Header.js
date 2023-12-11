import { Link, useNavigate } from "react-router-dom";

import {
  CART_ICON,
  USER_ICON,
  HOME_ICON,
  ORDER_ICON,
  LOGIN_LOGOUT_ICON,
} from "../utils/constants";

import { auth } from "../../firebase_config";
import { useSelector } from "react-redux";
import Search from "./Search";
import AppLogo from "./AppLogo";

export default function Header({ searchResults, user }) {
  let cartItems = [];
  cartItems = useSelector((store) => store.cart.items);
  const navigate = useNavigate();

  function logOutHandler() {
    auth.signOut();
    navigate("/login");
  }

  return (
    <div
      className="flex w-full justify-between items-center shadow-md flex-col sm:flex-row p-2"
      data-testid="header"
    >
      <AppLogo isHomepage={false} />
      <Search searchResults={searchResults} />
      <div className="flex text-sm">
        <Link to="/" className="ml-1 mr-1 flex flex-col items-center">
          <img src={HOME_ICON} alt="go to home page" className="w-6 h-6" />
          <span>Home</span>
        </Link>
        {user ? (
          <>
            <Link
              to="/account"
              className="ml-1 mr-1 flex flex-col items-center"
            >
              <img src={USER_ICON} alt="go to account" className="w-6 h-6" />
              <span>Account</span>
            </Link>
            <Link to="/orderslist" className="ml-1 mr-1">
              <img src={ORDER_ICON} alt="Go to orders placed page" />
              <span>Orders</span>
            </Link>
          </>
        ) : null}

        <Link to="/cart" className="ml-1 mr-1 ">
          <div className="flex flex-col items-center relative">
            <img src={CART_ICON} alt="cart" className="w-6 h-6" />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <div
                data-testid="cart-count"
                className="inline-block bg-black text-white absolute right-0 top-0 rounded-full text-xs text-center min-w-4 pl-0.5 pr-0.5"
              >
                {cartItems.length}
              </div>
            )}
          </div>
        </Link>
        {user ? (
          <>
            <button
              type="button"
              onClick={logOutHandler}
              data-testid="Logout"
              className="ml-1 mr-1 flex flex-col items-center"
            >
              <img
                src={LOGIN_LOGOUT_ICON}
                alt="logout from app"
                className="w-6 h-6"
              />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button
              type="button"
              data-testid="Login"
              className="ml-1 mr-1 flex flex-col items-center"
            >
              <img
                src={LOGIN_LOGOUT_ICON}
                alt="login to app"
                className="w-6 h-6"
              />
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
