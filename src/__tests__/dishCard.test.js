import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import store from "../Store/store";
import { fireEvent, render } from "@testing-library/react";
import DishCard from "../Components/DishCard";
import { dishWithoutCustom } from "../Dummy/DishNoCustomization.js";
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
  };
});
import Header from "../Components/Header";
describe("Checking Dish Card Layout", () => {
  test("All dish card elements are present", () => {
    let item = render(
      <StaticRouter>
        <Provider store={store}>
          <DishCard dish={dishWithoutCustom} restaurantInfo={null} />
        </Provider>
      </StaticRouter>
    );
    const dish = item.getByTestId("dish-card");
    const info = item.getByTestId("dish-info");
    const vegNonVeg = item.getByTestId("food-pref-img");
    const vegNonVegDesc = item.getByTestId("food-pref-name");
    const name = item.getByTestId("dish-name");
    const price = item.getByTestId("dish-price");
    const desc = item.getByTestId("dish-desc");
    expect(dish.children.length).toBe(3);
    expect(info.children.length).toBe(4);
    expect(vegNonVeg.src).toMatch(
      /^(https?:\/\/)(i\.imgur\.com\/lEMNtv0\.png|i\.imgur\.com\/qmye33X\.png)$/
    );
    expect(vegNonVegDesc.innerHTML).toMatch(/^(VEG|NON\\-VEG)$/);
    expect(name.innerHTML.length).toBeGreaterThan(0);
    expect(Number(price.innerHTML.slice(1))).toBeGreaterThan(0);
    expect(desc.innerHTML.length).toBeGreaterThan(0);
  });
});

describe("Cart functionality for no customized options", () => {
  test("item count increase for no Customizations", () => {
    let item = render(
      <StaticRouter>
        <Provider store={store}>
          <DishCard dish={dishWithoutCustom} restaurantInfo={null} />
        </Provider>
      </StaticRouter>
    );
    let addBtn = item.queryByTestId("dish-btn");
    expect(addBtn).not.toBe(null);
    if (addBtn) {
      let dishCount = item.queryByTestId("dish-count");
      expect(dishCount).toBe(null);
      let incBtn = item.queryByTestId("inc-btn");
      expect(incBtn).toBe(null);
      fireEvent.click(addBtn);
      dishCount = item.getByTestId("dish-count");
      expect(dishCount.innerHTML).toBe("1");
      incBtn = item.getByTestId("inc-btn");
      fireEvent.click(incBtn);
      dishCount = item.getByTestId("dish-count");
      expect(dishCount.innerHTML).toBe("2");
    }
  });

  test("item count decrease for no Customizations", () => {
    let item = render(
      <StaticRouter>
        <Provider store={store}>
          <DishCard dish={dishWithoutCustom} restaurantInfo={null} />
        </Provider>
      </StaticRouter>
    );
    let dishCount = item.queryByTestId("dish-count");
    if (dishCount) {
      let removeBtn = item.queryByTestId("delete-btn");
      fireEvent.click(removeBtn);
      expect(dishCount.innerHTML).toBe("1");
      fireEvent.click(removeBtn);
      let addBtn = item.queryByTestId("inc-btn");
      dishCount = item.queryByTestId("dish-count");
      expect(addBtn).toBe(null);
      expect(dishCount).toBe(null);
      addBtn = item.getByTestId("dish-btn");
      expect(addBtn.innerHTML).toBe("Add");
    }
  });

  test("cart count should increase and decrease on adding item", () => {
    let item = render(
      <StaticRouter>
        <Provider store={store}>
          <Header />
          <DishCard dish={dishWithoutCustom} restaurantInfo={null} />
        </Provider>
      </StaticRouter>
    );
    let cartCount = item.queryByTestId("cart-count");
    expect(cartCount.innerHTML).toBe("0");
    let addBtn = item.queryByTestId("dish-btn");
    fireEvent.click(addBtn);
    cartCount = item.queryByTestId("cart-count");
    expect(cartCount.innerHTML).toBe("1");
    let removeBtn = item.queryByTestId("delete-btn");
    fireEvent.click(removeBtn);
    cartCount = item.queryByTestId("cart-count");
    expect(cartCount.innerHTML).toBe("0");
  });
});
