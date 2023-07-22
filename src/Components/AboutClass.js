import { Component } from "react";
import { Outlet } from "react-router-dom";

import ProfileClass from "./ProfileClass";
export default class AboutClass extends Component {
  constructor() {
    super();
    console.log("Parent - constructor");
  }
  componentDidMount() {
    console.log("Parent- Did Mount");
  }
  componentDidUpdate() {
    console.log("Parent - Did Update");
  }
  componentWillUnmount() {
    console.log("Parent - Will Unmount");
  }
  render() {
    console.log("Parent - render");
    return (
      <div>
        <h1>About US: Class based component</h1>
        <ProfileClass name="Sonali" country="india" />
        <ProfileClass name="XYZ" country="india" />
        <Outlet />
      </div>
    );
  }
}
