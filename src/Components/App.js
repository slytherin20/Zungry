import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import Checkout from "./Checkout";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import RouteError from "./RouteError";
import RestaurantDetails from "./RestaurantDetails";
import LoginForm from "./LoginForm";
import useOnline from "../utils/useOnline";
import OfflinePage from "./OfflinePage";
import SignUp from "./SignUp";
import { Provider } from "react-redux";
import store from "../Store/store";
import Cart from "./Cart";
import useUserLocation from "../utils/useUserLocation";
import { UserLocationContext } from "../utils/UserLocationContext";
import { auth } from "../../firebase_config";
import { onAuthStateChanged } from "firebase/auth";
import {
  cartRestaurant,
  addAll,
  emptyCart,
  removeRestaurant,
} from "../Store/CartSlice";
import { useDispatch } from "react-redux";
import {
  addRestaurantToDB,
  addToDBCart,
  clearDB,
  updateCartItemInDB,
} from "../utils/firestore_utils";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase_config";
import Success from "./Success";
import Account from "./Account";
import { saveDetails } from "../Store/acountSlice";
import OrdersList from "./OrdersList";

function AppLayout() {
  const [searchVal, setSearchVal] = useState("");
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnline();
  const userLocation = useUserLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let authListener = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user.uid);
      else setUser(null);
    });
    return () => {
      authListener();
    };
  }, []);

  useEffect(() => {
    var cartListner, restListner, accountListner;
    function fetchCartItems() {
      if (user) {
        dispatch(emptyCart());
        dispatch(removeRestaurant());
        let cart;
        let restaurantName;
        let q = query(collection(db, "Users", user, "cart"));
        restListner = onSnapshot(
          doc(db, "Users", user, "restaurantInfo", "restaurant"),
          (doc) => {
            let restaurant = JSON.parse(localStorage.getItem("restaurant"));
            restaurantName = doc.data();
            if (restaurant) {
              if (restaurantName.id != restaurant.id) {
                clearDB(user);
                addRestaurantToDB(restaurant, user);
                localStorage.setItem("restaurant", "");
              }
            }
            dispatch(cartRestaurant(restaurantName));
          }
        );
        cartListner = onSnapshot(q, (querySnapshot) => {
          let items = JSON.parse(localStorage.getItem("items"));
          cart = [];
          querySnapshot.forEach((doc) => {
            cart.push(doc.data());
          });

          if (items && items.length > 0) {
            items.forEach((item) => {
              let findItem = cart.find((data) => data.id === item.id);
              if (!findItem) addToDBCart(item, user);
              else updateCartItemInDB(user, item.id, findItem.selectedQty + 1);
            });
            localStorage.clear();
          }
          dispatch(addAll(cart));
        });
      } else {
        let items = JSON.parse(localStorage.getItem("items"));
        let restaurant = JSON.parse(localStorage.getItem("restaurant"));
        if (items && items.length > 0) {
          dispatch(cartRestaurant(restaurant));
          dispatch(addAll(items));
        }
      }
    }
    function fetchAccountDetails() {
      accountListner = onSnapshot(
        doc(db, "Users", user, "Account", "account"),
        (doc) => {
          dispatch(saveDetails(doc.data()));
        }
      );
    }
    fetchCartItems();
    if (user) fetchAccountDetails();
    return () => {
      cartListner && cartListner();
      restListner && restListner();
      accountListner && accountListner();
    };
  }, [user]);

  function searchValHandler(val) {
    setSearchVal(val);
    if (location != "/") navigate("/");
  }

  return (
    <UserLocationContext.Provider value={userLocation}>
      <Header searchResults={searchValHandler} user={user} />
      {isOnline ? <Outlet context={[searchVal, user]} /> : <OfflinePage />}
      <Footer />
    </UserLocationContext.Provider>
  );
}
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Body />,
      },

      {
        path: "restaurants/:id",
        element: <RestaurantDetails />,
        errorElement: <RouteError />,
      },
      {
        path: "cart",
        element: <Cart />,
        errorElement: <RouteError />,
      },
      {
        path: "checkout",
        element: <Checkout />,
        errorElement: <RouteError />,
      },
      {
        path: "success",
        element: <Success />,
        errorElement: <RouteError />,
      },
      {
        path: "account",
        element: <Account />,
        errorElement: <RouteError />,
      },
      {
        path: "orderslist",
        element: <OrdersList />,
        errorElement: <RouteError />,
      },
    ],
    errorElement: <RouteError />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  </StrictMode>
);
