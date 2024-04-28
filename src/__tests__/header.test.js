const { render, fireEvent,waitFor } = require("@testing-library/react");
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        uid: "123456xwtre",
      },
    }),
  };
});
import Header from "../Components/Nav/Header.js";
import { Provider } from "react-redux";
import store from "../Store/store.js";
import "@testing-library/jest-dom";
import { StaticRouter } from "react-router-dom/server";
import { pizza } from "../Dummy/SearchResults.js";
global.fetch = jest.fn(()=>{
  return Promise.resolve({
    json:()=> Promise.resolve(pizza)
  })
})
describe('Header component',()=>{
  test("Header Component is loaded on App start", () => {
    const header = render(
      <StaticRouter>
        <Provider store={store}>
          <Header />
        </Provider>
      </StaticRouter>
    );
    const headerDiv = header.getByTestId("header");
    const logo = header.getByTestId("app-logo");
    const appName = header.getByTestId("app-name");
    const searchBar = header.getByTestId("search-bar");
  
    expect(headerDiv.children.length).toBe(3);
    expect(logo.src).toBe("https://i.imgur.com/c5XOd0b.png");
    expect(appName.innerHTML).toBe("Zungry");
    expect(searchBar.value).toBe("");
  });

  test('Search field shows recommendation and hide when focus is removed',async()=>{
    let header = render(
      <StaticRouter>

      <Provider store={store}>

        <Header />
      </Provider>
      </StaticRouter>
    );
    const searchBar = header.getByTestId("search-bar");
    const headerDiv = header.getByTestId("header");
      fireEvent.change(searchBar,{
        target:{
          value:'Pizza'
        }
      });
      await waitFor(()=>{
        expect(header.queryAllByTestId('recommend-result').length).toBe(2)
      });
      fireEvent.focus(headerDiv);
      await waitFor(()=>{
        expect(header.queryByTestId('recommendation')).toBeNull();
      });
      fireEvent.focus(searchBar);
      await waitFor(()=>{
        expect(header.queryAllByTestId('recommend-result').length).toBe(2)
      });
  })
  test('Remove recommendations when user clicks on clear button',async ()=>{
    let header = render(
      <StaticRouter>

      <Provider store={store}>

        <Header />
      </Provider>
      </StaticRouter>
    );
    const searchBar = header.getByTestId("search-bar");
      fireEvent.change(searchBar,{
        target:{
          value:'Pizza'
        }
      });
      fireEvent.blur(searchBar);
      fireEvent.focus(searchBar);
      await waitFor(()=>{
        expect(header.queryByTestId('recommendation')).toBeNull();
      });
  })
})
