import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import store from "../Store/store";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "@testing-library/jest-dom";
import * as router from "react-router";
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
    signInWithEmailAndPassword: jest.fn(() => {
      return Promise.resolve();
    }),
  };
});
jest.spyOn(router, "useNavigate").mockImplementation(() => jest.fn());
import LoginForm from "../Components/AuthenticationForms/LoginForm";

describe("Login form", () => {
  test("Empty login form should not submit and throw error at fields", async () => {
    let form = render(
      <StaticRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </StaticRouter>
    );

    let btn = form.queryByTestId("login-btn");
    fireEvent.click(btn);
    await waitFor(() => {
      expect(form.getByTestId("email-error")).toBeInTheDocument();
    });
    expect(form.getByTestId("email-error").innerHTML).toBe("*Required");
  });
  test("Empty email field should throw error on blur", async () => {
    let form = render(
      <StaticRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </StaticRouter>
    );
    let email = form.queryByTestId("email");
    fireEvent.blur(email);
    await waitFor(() => {
      expect(form.getByTestId("email-error")).toBeInTheDocument();
    });
    expect(form.getByTestId("email-error").innerHTML).toBe("*Required");
  });
  test("Empty password field should throw on blur", async () => {
    let form = render(
      <StaticRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </StaticRouter>
    );

    let password = form.queryByTestId("password");
    fireEvent.blur(password);
    await waitFor(() => {
      expect(form.getByTestId("password-error")).toBeInTheDocument();
    });
    expect(form.getByTestId("password-error").innerHTML).toBe("*Required");
  });

  test("Submit should work when all fields are filled", async () => {
    let form = render(
      <StaticRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </StaticRouter>
    );
    let email = form.queryByTestId("email");
    let password = form.queryByTestId("password");
    let btn = form.queryByTestId("login-btn");
    fireEvent.change(email, {
      target: {
        value: "example04@gmail.com",
      },
    });
    fireEvent.change(password, {
      target: {
        value: "ExamplePwd@123",
      },
    });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {
          currentUser: {
            uid: "123456xwtre",
          },
        },
        "example04@gmail.com",
        "ExamplePwd@123"
      );
    });
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });
  test("Submit should not work when email fails validation", async () => {
    let form = render(
      <StaticRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </StaticRouter>
    );
    let email = form.queryByTestId("email");
    let password = form.queryByTestId("password");

    let btn = form.queryByTestId("login-btn");
    fireEvent.change(email, {
      target: {
        value: "@re.com",
      },
    });
    fireEvent.blur(email);
    fireEvent.change(password, {
      target: {
        value: "ExamplePwd@123",
      },
    });

    fireEvent.click(btn);
    await waitFor(() => {
      expect(form.getByTestId("email-error").innerHTML).toBe(
        "Invalid E-mail Address"
      );
    });
    // await waitFor(() => {
    //   expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
    //     {
    //       currentUser: {
    //         uid: "123456xwtre",
    //       },
    //     },
    //     "example04@gmail.com",
    //     "ExamplePwd@123"
    //   );
    // });
    // expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });

  test("Submit should not work when password fails validation", async () => {
    let form = render(
      <StaticRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </StaticRouter>
    );
    let email = form.queryByTestId("email");
    let password = form.queryByTestId("password");

    let btn = form.queryByTestId("login-btn");
    fireEvent.change(email, {
      target: {
        value: "2red@re.com",
      },
    });
    fireEvent.blur(email);
    fireEvent.change(password, {
      target: {
        value: "ex@123",
      },
    });

    fireEvent.click(btn);
    await waitFor(() => {
      expect(form.getByTestId("password-error").innerHTML).toBe(
        "Password must be atleast 8 characters long"
      );
    });
  });
});
