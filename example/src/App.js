import React, { Component, Fragment } from "react";

import { Spiral } from "react-audible-visuals";

const BW = "B"


const styles = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
    backgroundColor: BW === "B" ? "black" : "white",
  },
  text: {
    color: BW === "B" ? "white" : "black",
  }
};

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <div style={styles.wrapper}>
        <div className="bounce">
        <p style={styles.text}> HELLO </p>
        </div>
          <Spiral />
        </div>
      </Fragment>
    );
  }
}
