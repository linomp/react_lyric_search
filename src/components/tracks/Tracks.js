import React, { Component } from "react";
import { Consumer } from "../../context";

class Tracks extends Component {
  render() {
    // whatever was passed to the context provider
    // is now available here as "value"
    return (
      <Consumer>
        {value => {
          console.log(value);
          return <h1>Tracks</h1>;
        }}
      </Consumer>
    );
  }
}

export default Tracks;
