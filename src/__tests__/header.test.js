const { render } = require("@testing-library/react");
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
  };
});
import Header from "../Components/Nav/Header.js";
import { Provider } from "react-redux";
import store from "../Store/store.js";
import "@testing-library/jest-dom";
import { StaticRouter } from "react-router-dom/server";
test("Header Component is loaded on App start", () => {
  const header = render(
    <StaticRouter>
      <Provider store={store}>
        <Header />
      </Provider>
    </StaticRouter>
  );
  const headerDiv = header.getByTestId("header");
  const logo = header.getByTestId("app-logo");
  const appName = header.getByTestId("app-name");
  const searchBar = header.getByTestId("search-bar");

  expect(headerDiv.children.length).toBe(3);
  expect(logo.src).toBe("https://i.imgur.com/c5XOd0b.png");
  expect(appName.innerHTML).toBe("Zungry");
  expect(searchBar.value).toBe("");
});
