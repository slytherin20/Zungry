import { Component } from "react";
import { SWIGGY_API } from "../../api_endpoint";

export default class ProfileClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      food: "Burger",
    };
    console.log("Child - constructor");
  }

  async componentDidMount() {
    console.log("Child- Did Mount");
    let res = await fetch(SWIGGY_API);
    console.log("result fetched");
    this.timer = setInterval(() => console.log("timer set"), 1000);
  }
  componentDidUpdate() {
    console.log("Child - Did Update");
  }
  componentWillUnmount() {
    console.log("Child - Will Unmount");
    clearInterval(this.timer);
  }
  render() {
    console.log("Child - Render");
    return (
      <>
        <h1>
          Profile: Class-based component:{this.props.name}-{this.props.country}
        </h1>
        <input
          type="text"
          onChange={(e) =>
            this.setState({
              count: e.target.value,
            })
          }
          value={this.state.count}
        />
        <input
          type="text"
          onChange={(e) =>
            this.setState({
              food: e.target.value,
            })
          }
          value={this.state.food}
        />
        <p>
          {this.state.food}:{this.state.count}
        </p>
      </>
    );
  }
}
