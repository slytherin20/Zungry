import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ContactUs from "./ContactUs";
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

function AppLayout() {
  const [searchVal, setSearchVal] = useState("");
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnline();
  const userLocation = useUserLocation();

  useEffect(() => {
    let authListener = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user.uid);
      else setUser(null);
    });
    return () => {
      authListener();
    };
  }, []);

  function searchValHandler(val) {
    setSearchVal(val);
    if (location != "/") navigate("/");
  }

  return (
    <Provider store={store}>
      <UserLocationContext.Provider value={userLocation}>
        <StrictMode>
          <Header searchResults={searchValHandler} user={user} />
          {isOnline ? <Outlet context={[searchVal, user]} /> : <OfflinePage />}
          <Footer />
        </StrictMode>
      </UserLocationContext.Provider>
    </Provider>
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
        path: "contact",
        element: <ContactUs />,
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
root.render(<RouterProvider router={appRouter} />);
