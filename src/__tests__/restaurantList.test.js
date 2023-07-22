import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import store from "../Store/store";
import { render, waitFor } from "@testing-library/react";
import { restaurantDetails } from "../../api_endpoint";
import "@testing-library/jest-dom";
import RestaurantList from "../Components/RestaurantList";
global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve(restaurantDetails),
  });
});
test("Restaurants should be loaded", async () => {
  const body = render(
    <StaticRouter>
      <Provider store={store}>
        <RestaurantList searchInput="burger" />
      </Provider>
    </StaticRouter>
  );
  const shimmer = body.getByTestId("homepage-shimmer");
  expect(shimmer).toBeInTheDocument();
  await waitFor(() => {
    expect(body.getByTestId("restaurants"));
  });
  const restList = body.getByTestId("restaurants");
  expect(restList.children.length).toBe(3);
});
