import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import store from "../Store/store";
import { fireEvent, render } from "@testing-library/react";
import DishCard from "../Components/DishCard";
import { customDish } from "../Dummy/dishWithCustom";
import { info } from "../Dummy/restaurantInfo";

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

describe("Cart functionality for dishes with customization options", () => {
  test("Customization popup opening", () => {
    let item = render(
      <>
        <div id="modal" data-testid="modal"></div>
        <StaticRouter>
          <Provider store={store}>
            <DishCard dish={customDish} restaurantInfo={info} />
          </Provider>
        </StaticRouter>
      </>
    );

    let addBtn = item.getByTestId("dish-btn");
    fireEvent.click(addBtn);
    let customMenu = item.queryByTestId("customization-menu");
    expect(customMenu).not.toBe(null);
  });

  test("Item count should increase after selecting customization option", () => {
    let item = render(
      <>
        <div id="modal" data-testid="modal"></div>
        <StaticRouter>
          <Provider store={store}>
            <Header />
            <DishCard dish={customDish} restaurantInfo={info} />
          </Provider>
        </StaticRouter>
      </>
    );

    let addBtn = item.getByTestId("dish-btn");
    fireEvent.click(addBtn);
    let options = item.getAllByTestId("custom-option");
    fireEvent.click(options[0]);
    let continueBtn = item.getByTestId("continue-btn");
    fireEvent.click(continueBtn);
    let dishCount = item.getByTestId("dish-count");
    expect(dishCount.innerHTML).toBe("1");
    let cartCount = item.getByTestId("cart-count");
    expect(cartCount.innerHTML).toBe("1");
    let incBtn = item.getByTestId("inc-btn");
    fireEvent.click(incBtn);
    options = item.getAllByTestId("cust-inc-count");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
    continueBtn = item.getByTestId("continue-btn");
    fireEvent.click(continueBtn);
    expect(dishCount.innerHTML).toBe("3");
    expect(cartCount.innerHTML).toBe("1");
  });
  test("Item count should increase and decrease for customization option", () => {
    let item = render(
      <>
        <div id="modal" data-testid="modal"></div>
        <StaticRouter>
          <Provider store={store}>
            <Header />
            <DishCard dish={customDish} restaurantInfo={info} />
          </Provider>
        </StaticRouter>
      </>
    );
    //Initially 3 custom sizes selected
    let decrBtn = item.getByTestId("delete-btn");
    fireEvent.click(decrBtn);
    let options = item.getAllByTestId("cust-decrease-count");
    fireEvent.click(options[0]); //2
    options = item.getAllByTestId("cust-inc-count");
    fireEvent.click(options[2]); //3
    let continueBtn = item.getByTestId("continue-btn");
    fireEvent.click(continueBtn);
    let dishCount = item.getByTestId("dish-count");
    expect(dishCount.innerHTML).toBe("3");
    fireEvent.click(decrBtn);
    options = item.getAllByTestId("cust-decrease-count");
    fireEvent.click(options[1]); //2
    fireEvent.click(options[0]); //1
    continueBtn = item.getByTestId("continue-btn");
    fireEvent.click(continueBtn);
    fireEvent.click(decrBtn);
    dishCount = item.queryByTestId("dish-btn");
    expect(dishCount).not.toBe(null);
  });
});
