import React, { Component } from "react";

import { Spiral } from "react-audible-visuals";
import { Flower } from "react-audible-visuals";

export default class App extends Component {
  render() {
    return (
      <div>
        <Spiral text="Dude yeah" />
        <Flower text="Yeah dude" />
      </div>
    );
  }
}
