import { useState } from "react";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
function AppLayout() {
  const [searchVal, setSearchVal] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnline();
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) setUser(user.uid);
  });
  function searchValHandler(val) {
    setSearchVal(val);
    if (location != "/") navigate("/");
  }

  return (
    <Provider store={store}>
      <Header searchResults={searchValHandler} user={user} />
      {isOnline ? <Outlet context={searchVal} /> : <OfflinePage />}
      <Footer />
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
