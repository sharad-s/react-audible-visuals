import React, { useRef, useEffect, Fragment } from "react";

import { Spiral } from "react-audible-visuals";
import AudioPlayer from "./components/AudioPlayer";

const cors = "https://cors-anywhere.herokuapp.com/";
var src = cors + "https://a.clyp.it/cwvlsmnd.mp3";

const BW = "B";

const styles = {
  wrapper: {
    height: "50vh",
    width: "50vw",
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
    backgroundColor: BW === "B" ? "black" : "white",
  },
  text: {
    color: BW === "B" ? "white" : "black",
  },
};

const App = () => {
  const audioRef = useRef(null);
  return (
    <Fragment>
      <AudioPlayer ref={audioRef} />
      <div style={styles.wrapper}>
        <Spiral audioRef={audioRef} animateOnStart={true} />
      </div>
    </Fragment>
  );
};

export default App;
