import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import store from "../Store/store";
import { render, waitFor } from "@testing-library/react";
import { restaurantDetails } from "../Dummy/api_endpoint";
import "@testing-library/jest-dom";
import RestaurantList from "../Components/RestaurantsList/RestaurantList";
import { UserLocationContext } from "../utils/UserLocationContext";
import { useOutletContext } from "react-router-dom";
global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve(restaurantDetails),
  });
});
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useOutletContext: jest.fn(),
  };
});

test("Restaurants should be loaded", async () => {
  const mockPostion = {
    coords: {
      lat: 1.2345,
      long: 5.6789,
    },
  };
  mockGeolocation.getCurrentPosition.mockImplementation((success) =>
    success(mockPostion)
  );
  useOutletContext.mockReturnValue(["", ""]);
  const body = render(
    <StaticRouter>
      <Provider store={store}>
        <UserLocationContext.Provider value={mockPostion.coords}>
          <RestaurantList />
        </UserLocationContext.Provider>
      </Provider>
    </StaticRouter>
  );
  const shimmer = body.getByTestId("homepage-shimmer");
  expect(shimmer).toBeInTheDocument();

  await waitFor(() => {
    expect(body.getByTestId("restaurants")).toBeVisible();
  });
  const restList = body.getByTestId("restaurants");
  expect(restList.children.length).toBe(20);
});
