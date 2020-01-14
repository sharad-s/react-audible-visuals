import React, { Component, Fragment } from "react";

import { Spiral } from "react-audible-visuals";

const styles = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    position: "fixed",
    zIndex: -1
  },
  text: {
    color: "white", 
    papaddingTop: "20px"
  }
};

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <div style={styles.wrapper}>
          <h1 style={styles.text}> HELLO </h1>
          <Spiral />
        </div>
      </Fragment>
    );
  }
}
