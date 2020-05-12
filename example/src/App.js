import React, { useRef, Fragment } from "react";

import Spiral from "react-audible-visuals";
import AudioPlayer from "./components/AudioPlayer";

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
        <Spiral audioRef={audioRef} radius={100} minRadius={70} maxRadius={80} fov={60}  />
      </div>
    </Fragment>
  );
};

export default App;
