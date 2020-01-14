import React, { Component, Fragment } from "react";

import { Spiral } from "react-audible-visuals";

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <div className="god">
          <h1 style={{color:"white", paddingTop:"20px"}}> HELLO </h1>
          <Spiral />
        </div>
      </Fragment>
    );
  }
}
