import { StaticRouter } from "react-router-dom/server";
import { fireEvent, render, waitFor } from "@testing-library/react";
import * as router from "react-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import "@testing-library/jest-dom";
jest.mock('../utils/firestore_utils',()=>{
  return {
    saveAccountDetails: jest.fn(()=> Promise.resolve)
  }
})
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
    createUserWithEmailAndPassword: jest.fn((auth,email,password) => {
      if(email==='test123@test.com') return Promise.reject({
        code:'auth/email-already-in-use'
      })
      else if(auth.currentUser.uid=='123456xwtre' && email=='john.doe@gmail.com' && password=='John.doe8@8'){
        return Promise.resolve({
          code:'auth/user-created'
        })
      }
      else{
        return Promise.reject({
          code:'Unknow error occured'
        })
      }
    }),
  };
});
jest.spyOn(router, "useNavigate").mockImplementation(() => jest.fn());
// global.saveAccountDetails = jest.fn();
import SignUp from "../Components/AuthenticationForms/SignUp";
import { ToastContainer } from "react-toastify";

describe("Signup page", () => {
  test("Signup is loading correctly", () => {
    let signup = render(
      <StaticRouter>
          <SignUp />
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
          <SignUp />
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
          <SignUp />
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
          <SignUp />
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
          <SignUp />
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
          <SignUp />
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
  test('Email already exists should show error',async()=>{
let form = render(
  <StaticRouter>
      <ToastContainer />
      <SignUp />
  </StaticRouter>
)
  let firstName = form.getByTestId("first");
let lastName = form.getByTestId("last");
let email = form.getByTestId("email");
let password = form.getByTestId("password");
let reenterPassword = form.getByTestId("repassword");
fireEvent.change(firstName,{
  target:{
    value:'John'
  }
})
fireEvent.blur(firstName);
fireEvent.change(lastName, {
  target: {
    value: "Doe",
  },
});
fireEvent.blur(lastName);
fireEvent.change(email, {
  target: {
    value: "test123@test.com",
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
let submitBtn = form.getByTestId("signup-btn");
fireEvent.click(submitBtn);
await waitFor(()=>{
  expect(form.getByText('User already exists. Please login.'))
})

  })
  test('Unknown error occured while signing up',async ()=>{
    let form = render(
      <StaticRouter>
          <ToastContainer />
          <SignUp />
      </StaticRouter>
    )
  
      let firstName = form.getByTestId("first");
    let lastName = form.getByTestId("last");
    let email = form.getByTestId("email");
    let password = form.getByTestId("password");
    let reenterPassword = form.getByTestId("repassword");
    fireEvent.change(firstName,{
      target:{
        value:'John'
      }
    })
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
        value: "John.doe8@843",
      },
    });
    fireEvent.blur(password);
    fireEvent.change(reenterPassword, {
      target: {
        value: "John.doe8@843",
      },
    });
    fireEvent.blur(reenterPassword);
    let submitBtn = form.getByTestId("signup-btn");
    fireEvent.click(submitBtn);
    await waitFor(()=>{
      expect(form.getByText('Facing issue signing up. Please try again later.'))
    })
  })
  
  test('Show/hide password and re-enter password',()=>{
    let form = render(
      <StaticRouter>
       <SignUp />
      </StaticRouter>
    );
    //Password field
    let password = form.getByTestId("password");
    let hidePassword = form.getByTestId('hide-password');
    expect(hidePassword).toBeInTheDocument();
    expect(password.type).toBe('password');
    fireEvent.click(hidePassword);
    expect(form.queryByTestId('hide-password')).toBeNull();
    expect(form.queryByTestId('show-password')).not.toBeNull();
    expect(password.type).toBe('text');
    fireEvent.click(form.getByTestId('show-password'));
    expect(form.queryByTestId('show-password')).toBeNull();
    expect(form.queryByTestId('hide-password')).not.toBeNull();
    expect(password.type).toBe('password');


    //Re-enter password fields
    let rePassword = form.getByTestId("repassword");
    let hideRePassword = form.getByTestId('hide-repassword');
    expect(hideRePassword).toBeInTheDocument();
    expect(rePassword.type).toBe('password');
    fireEvent.click(hideRePassword);
    expect(form.queryByTestId('hide-repassword')).toBeNull();
    expect(form.queryByTestId('show-repassword')).not.toBeNull();
    expect(rePassword.type).toBe('text');
    fireEvent.click(form.getByTestId('show-repassword'));
    expect(form.queryByTestId('show-repassword')).toBeNull();
    expect(form.queryByTestId('hide-repassword')).not.toBeNull();
    expect(rePassword.type).toBe('password');
  })
});
