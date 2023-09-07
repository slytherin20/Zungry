import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../Store/store";
import { StaticRouter } from "react-router-dom/server";
import "@testing-library/jest-dom";
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
  };
});
import Header from "../Components/Header.js";
import RestaurantList from "../Components/RestaurantList.js";
import { restaurantDetails } from "../utils/api_endpoint";
global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve(restaurantDetails),
  });
});
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;
test("Restaurant should be loaded as per search input", async () => {
  const searchFn = jest.fn((val) => val);
  let mockPosition = {
    coords: {
      latitude: 1.2345,
      longitude: 5.6789,
    },
  };

  mockGeolocation.getCurrentPosition.mockImplementation((success) => {
    success(mockPosition);
  });
  const { rerender } = render(
    <StaticRouter>
      <Provider store={store}>
        <Header searchResults={searchFn} />
        <RestaurantList searchInput="" />
      </Provider>
    </StaticRouter>
  );
  const inp = screen.getByTestId("search-bar");
  const searchBtn = screen.getByTestId("search-btn");
  let value = "burger";
  fireEvent.change(inp, {
    target: {
      value,
    },
  });

  fireEvent.click(searchBtn);

  rerender(
    <StaticRouter>
      <Provider store={store}>
        <Header searchResults={searchFn} />
        <RestaurantList searchInput={value} />
      </Provider>
    </StaticRouter>
  );

  const shimmer = screen.getByTestId("homepage-shimmer");
  expect(shimmer).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByTestId("restaurants"));
  });
  const restList = screen.getByTestId("restaurants");

  expect(restList.children.length).toBe(2);
});
