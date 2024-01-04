import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import store from "../Store/store";
import { fireEvent, render, waitFor } from "@testing-library/react";
import * as router from "react-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import "@testing-library/jest-dom";
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
    createUserWithEmailAndPassword: jest.fn(() => {
      return Promise.resolve();
    }),
  };
});
jest.spyOn(router, "useNavigate").mockImplementation(() => jest.fn());
import SignUp from "../Components/AuthenticationForms/SignUp";

describe("Signup page", () => {
  test("Signup is loading correctly", () => {
    let signup = render(
      <StaticRouter>
        <Provider store={store}>
          <SignUp />
        </Provider>
      </StaticRouter>
    );

    let firstName = signup.getByTestId("first");
    let lastName = signup.getByTestId("last");
    let email = signup.getByTestId("email");
    let password = signup.getByTestId("password");
    let reenterPassword = signup.getByTestId("repassword");
    let signupBtn = signup.getByTestId("signup-btn");
    let loginLink = signup.getByTestId("login-link");
    expect(firstName).toBeVisible();
    expect(lastName).toBeVisible();
    expect(email).toBeVisible();
    expect(password).toBeVisible();
    expect(reenterPassword).toBeVisible();
    expect(signupBtn).toBeVisible();
    expect(loginLink).toBeVisible();
  });

  test("Validation for empty form", async () => {
    let signup = render(
      <StaticRouter>
        <Provider store={store}>
          <SignUp />
        </Provider>
      </StaticRouter>
    );
    let signupBtn = signup.getByTestId("signup-btn");
    fireEvent.click(signupBtn);

    await waitFor(() => {
      expect(signup.getByTestId("firstname-error")).toBeVisible();
    });
    expect(signup.getByTestId("firstname-error").innerHTML).toBe("Required");
    expect(signup.getByTestId("lastname-error").innerHTML).toBe("Required");
    expect(signup.getByTestId("email-error").innerHTML).toBe("Required");
    expect(signup.getByTestId("password-error").innerHTML).toBe("Required");
    expect(signup.getByTestId("repassword-error").innerHTML).toBe("Required");
  });

  test("Validation for Name field", async () => {
    let signup = render(
      <StaticRouter>
        <Provider store={store}>
          <SignUp />
        </Provider>
      </StaticRouter>
    );

    let firstName = signup.getByTestId("first");
    let lastName = signup.getByTestId("last");
    let value = "Dummy name";
    let largeName = "abcdefghijklmnoqrstuvwxstrstrdytdttdysyz";

    //Firstname

    fireEvent.change(firstName, {
      target: {
        value: largeName,
      },
    });
    fireEvent.blur(firstName);
    await waitFor(() => {
      expect(signup.getByTestId("firstname-error")).toBeVisible();
    });
    expect(signup.getByTestId("firstname-error").innerHTML).toBe(
      "Maximum 20 characters allowed."
    );

    fireEvent.change(firstName, {
      target: {
        value: value,
      },
    });
    fireEvent.blur(firstName);
    await waitFor(() => {
      expect(signup.getByTestId("firstname-error").not);
    });

    //Lastname

    fireEvent.change(lastName, {
      target: {
        value: largeName,
      },
    });
    fireEvent.blur(lastName);
    await waitFor(() => {
      expect(signup.getByTestId("lastname-error")).toBeVisible();
    });
    expect(signup.getByTestId("lastname-error").innerHTML).toBe(
      "Maximum 20 characters allowed."
    );

    fireEvent.change(lastName, {
      target: {
        value: value,
      },
    });
    fireEvent.blur(lastName);
    await waitFor(() => {
      expect(signup.getByTestId("lastname-error")).not;
    });
  });

  test("Validation for E-mail field", async () => {
    let signup = render(
      <StaticRouter>
        <Provider store={store}>
          <SignUp />
        </Provider>
      </StaticRouter>
    );

    let email = signup.getByTestId("email");
    let testVal1 = "shfdsifuduifbuv";
    let testVal2 = "Amb@dshf.com";
    let testVal3 = ".@fsc.com";
    let testVal4 = "123@fcst.com";
    let testVal5 = "sf@.com";

    //Test Val1

    fireEvent.change(email, {
      target: {
        value: testVal1,
      },
    });
    fireEvent.blur(email);
    await waitFor(() => {
      expect(signup.getByTestId("email-error")).toBeVisible();
    });
    expect(signup.getByTestId("email-error").innerHTML).toBe(
      "Invalid E-mail Address"
    );

    //TestVal 2

    fireEvent.change(email, {
      target: {
        value: testVal2,
      },
    });
    fireEvent.blur(email);
    await waitFor(() => {
      expect(signup.getByTestId("email-error")).not;
    });

    //TestVal3

    fireEvent.change(email, {
      target: {
        value: testVal3,
      },
    });
    fireEvent.blur(email);
    await waitFor(() => {
      expect(signup.getByTestId("email-error")).toBeVisible();
    });
    expect(signup.getByTestId("email-error").innerHTML).toBe(
      "Invalid E-mail Address"
    );

    //TestVal4

    fireEvent.change(email, {
      target: {
        value: testVal4,
      },
    });
    fireEvent.blur(email);
    await waitFor(() => {
      expect(signup.getByTestId("email-error")).not;
    });

    //TestVal5

    fireEvent.change(email, {
      target: {
        value: testVal5,
      },
    });
    fireEvent.blur(email);
    await waitFor(() => {
      expect(signup.getByTestId("email-error")).toBeVisible();
    });
    expect(signup.getByTestId("email-error").innerHTML).toBe(
      "Invalid E-mail Address"
    );
  });

  test("Validation for Password field", async () => {
    let page = render(
      <StaticRouter>
        <Provider store={store}>
          <SignUp />
        </Provider>
      </StaticRouter>
    );

    let password = page.queryByTestId("password");
    let reenterPassword = page.queryByTestId("repassword");

    fireEvent.change(password, {
      target: {
        value: "sfhdsufh",
      },
    });
    fireEvent.blur(password);
    await waitFor(() => {
      expect(page.queryByTestId("password-error")).toBeVisible();
    });
    expect(page.queryByTestId("password-error").innerHTML).toBe(
      "Password should contain atleast one Capital Letter, one digit and one special character"
    );
    fireEvent.change(reenterPassword, {
      target: {
        value: "sdtfyghjkhgfdfg",
      },
    });
    fireEvent.blur(reenterPassword);

    await waitFor(() => {
      const reenterPasswordErr = page.getByTestId("repassword-error");
      expect(reenterPasswordErr.innerHTML).toBe("Passwords must match");
    });
  });

  test("Submit function is working correctly", async () => {
    let signup = render(
      <StaticRouter>
        <Provider store={store}>
          <SignUp />
        </Provider>
      </StaticRouter>
    );

    let firstName = signup.getByTestId("first");
    let lastName = signup.getByTestId("last");
    let email = signup.getByTestId("email");
    let password = signup.getByTestId("password");
    let reenterPassword = signup.getByTestId("repassword");
    fireEvent.change(firstName, {
      target: {
        value: "John",
      },
    });
    fireEvent.blur(firstName);
    fireEvent.change(lastName, {
      target: {
        value: "Doe",
      },
    });
    fireEvent.blur(lastName);
    fireEvent.change(email, {
      target: {
        value: "john.doe@gmail.com",
      },
    });
    fireEvent.blur(email);
    fireEvent.change(password, {
      target: {
        value: "John.doe8@8",
      },
    });
    fireEvent.blur(password);
    fireEvent.change(reenterPassword, {
      target: {
        value: "John.doe8@8",
      },
    });
    fireEvent.blur(reenterPassword);
    let submitBtn = signup.getByTestId("signup-btn");

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toBeCalledWith(
        {
          currentUser: {
            uid: "123456xwtre",
          },
        },
        "john.doe@gmail.com",
        "John.doe8@8"
      );
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    });
  });
});
