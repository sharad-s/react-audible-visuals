import React, { Component } from "react";

// Constants
import { RGB } from "../../utils/constants";

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      R: 0.7,
      G: 0,
      B: 0.7,
      fov: 50,
      intensity: 0.08,
      highlight: RGB.RED,
      animate: true
    };
  }

  // timeFloatData is scalar value for each particle
  // call this function on each particle
  updateColor(timeFloatData) {
    let { R, G, B, highlight } = this.state;
    switch (highlight) {
      case RGB.RED:
        R += timeFloatData;
        G -= timeFloatData;
        B -= timeFloatData;
        break;
      case RGB.GREEN:
        R -= timeFloatData;
        G += timeFloatData;
        B -= timeFloatData;
        break;
      case RGB.BLUE:
        R -= timeFloatData;
        G -= timeFloatData;
        B += timeFloatData;
        break;
      default:
        break;
    }
    return { R, G, B };
  }

  render() {
    return <div></div>;
  }
}
