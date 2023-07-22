import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../Store/store";
import { StaticRouter } from "react-router-dom/server";
import "@testing-library/jest-dom";
import Header from "../Components/Header.js";
import RestaurantList from "../Components/RestaurantList.js";
import { restaurantDetails } from "../../api_endpoint";
global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve(restaurantDetails),
  });
});

test("Restaurant should be loaded as per search input", async () => {
  const searchFn = jest.fn((val) => val);
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
  let value = "parantha";
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

  expect(restList.children.length).toBe(1);
});
