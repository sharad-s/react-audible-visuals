import React, { useRef, useEffect, Fragment } from "react";

import { Spiral } from "react-audible-visuals";
import AudioPlayer from "./components/AudioPlayer";

const cors = "https://cors-anywhere.herokuapp.com/";
var src = cors + "https://a.clyp.it/cwvlsmnd.mp3";

const BW = "B";

const styles = {
  wrapper: {
    height: "100vh",
    width: "100vw",
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
  let context;
  const audioRef = useRef();

  useEffect(() => {

  }, []);

  return (
    <Fragment>
      <div style={styles.wrapper}>
        <AudioPlayer ref={audioRef} />
        <Spiral audioRef={audioRef} animateOnStart={true} />
      </div>
    </Fragment>
  );
};

export default App;
