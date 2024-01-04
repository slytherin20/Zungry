import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../Store/store";
import "@testing-library/jest-dom";
import { StaticRouter } from "react-router-dom/server";
import { useOutletContext } from "react-router-dom";
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
  };
});
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useOutletContext: jest.fn(),
  };
});
import Header from "../Components/Header.js";
import RestaurantList from "../Components/RestaurantList.js";
import { restaurantDetails } from "../Dummy/api_endpoint.js";
import { UserLocationContext } from "../utils/UserLocationContext";
global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve(restaurantDetails),
  });
});
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

const searchFn = jest.fn((val) => val);
let mockPosition = {
  coords: {
    lat: 1.2345,
    long: 5.6789,
  },
};

describe("The landing page", () => {
  test("The landing page should load correctly", async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });
    useOutletContext.mockReturnValue(["", ""]);
    const page = render(
      <StaticRouter>
        <Provider store={store}>
          <UserLocationContext.Provider value={mockPosition.coords}>
            <Header searchResults={searchFn} />
            <RestaurantList />
          </UserLocationContext.Provider>
        </Provider>
      </StaticRouter>
    );
    expect(page.getByTestId("header")).toBeInTheDocument();
    const shimmer = page.getByTestId("homepage-shimmer");
    expect(shimmer).toBeInTheDocument();

    await waitFor(() => {
      expect(page.getByTestId("restaurants")).toBeInTheDocument();
    });
    const restList = page.getByTestId("restaurants");

    expect(restList.children.length).toBe(20);
  });
  test("Restaurant should be loaded as per search input", async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });
    useOutletContext.mockReturnValue(["", ""]);

    const { rerender } = render(
      <StaticRouter>
        <Provider store={store}>
          <UserLocationContext.Provider value={mockPosition.coords}>
            <Header searchResults={searchFn} />
            <RestaurantList />
          </UserLocationContext.Provider>
        </Provider>
      </StaticRouter>
    );
    const inp = screen.getByTestId("search-bar");
    const searchBtn = screen.getByTestId("search-btn");
    let value = "burger";
    useOutletContext.mockReturnValue([value, ""]);
    fireEvent.change(inp, {
      target: {
        value,
      },
    });

    fireEvent.click(searchBtn);

    rerender(
      <StaticRouter>
        <Provider store={store}>
          <UserLocationContext.Provider value={mockPosition.coords}>
            <Header searchResults={searchFn} />
            <RestaurantList />
          </UserLocationContext.Provider>
        </Provider>
      </StaticRouter>
    );

    const shimmer = screen.getByTestId("homepage-shimmer");
    expect(shimmer).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("restaurants"));
    });
    const restList = screen.getByTestId("restaurants");

    expect(restList.children.length).toBe(3);
  });
});
