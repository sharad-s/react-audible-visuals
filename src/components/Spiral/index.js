import React from "react";
import THREE from "../../lib/getThree.min";

import { PI2 } from "../../utils/constants";
import isEmpty from "../../utils/isEmpty";

// AudioContext
import { ctx, analyser } from "../../utils/getAnalyser";

import styles from "../../styles.css";

// ThreeJS
var camera, scene, renderer, canvas;
var particles = [];
var circleCounter;

var parent;

// CORS
var corsProxy = "https://cors-anywhere.herokuapp.com/";

// Props and Default Props
var settings;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: {},
    };
  }

  componentDidMount() {
    settings = {
      R: 0.7,
      G: 0,
      B: 0.7,
      fov: 50,
      intensity: 0.08,
      radius: 65,
      minRadius: 35,
      maxRadius: 65,
      animate: true,
    };

    this.setupRendering();
    this.setupParticles();
    this.setupEventHandlers();
    this.animate();
  }

  setupRendering() {
    // Get parent element
    parent = this.poop.parentElement;

    scene = new THREE.Scene();

    // Camera
    const cameraSettings = {
      fov: 20,
      width: parent.clientWidth,
      height: parent.clientHeight,
    };
    camera = new THREE.PerspectiveCamera(
      cameraSettings.fov,
      cameraSettings.width / cameraSettings.height,
      1,
      10000
    );
    camera.position.set(0, 0, 175);

    // Renderer
    renderer = new THREE.CanvasRenderer({ alpha: true });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create canvas and append it
    canvas = renderer.domElement;
    // Create Canvas in HTML imperatively
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.poop.appendChild(canvas);
  }

  // Set up Particles Geometry
  setupParticles() {
    let particle;
    for (let i = 0; i <= 2048; i++) {
      const material = new THREE.SpriteCanvasMaterial({
        color: 0x000000,
        program: function (context) {
          context.beginPath();
          context.arc(0, 0, 0.33, 0, PI2);
          context.fill();
        },
      });
      particle = particles[i++] = new THREE.Particle(material);

      scene.add(particle);
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    this.animateParticles();
    this.changeCircleRadius();

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  };

  changeCircleRadius() {
    if (settings.animate) {
      if (circleCounter) {
        settings.radius += 0.05;
        if (settings.radius >= settings.maxRadius) {
          circleCounter = false;
        }
      } else {
        settings.radius -= 0.05;
        if (settings.radius <= settings.minRadius) {
          console.log("hit");
          circleCounter = true;
        }
      }
    }
  }

  animateParticles() {
    const { radius, intensity } = settings;

    const timeByteData = new Uint8Array(analyser.fftSize);
    const timeFloatData = new Float32Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeByteData);
    analyser.getFloatTimeDomainData(timeFloatData);

    for (let j = 0; j <= particles.length; j++) {
      let particle = particles[j++];

      // COLOR
      const R = settings.R + timeFloatData[j];
      const G = settings.G - timeFloatData[j];
      const B = settings.B - timeFloatData[j];
      particle.material.color.setRGB(R, G, B);

      // CIRCLE
      particle.position.x = Math.sin(j) * (j / (j / radius));
      particle.position.y = timeFloatData[j] * timeByteData[j] * intensity;
      particle.position.z = Math.cos(j) * (j / (j / radius));
      camera.position.y = 80;
      camera.fov = 35;
    }
    camera.fov = settings.fov;
    camera.updateProjectionMatrix();
  }

  windowResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    width = parent.clientWidth;
    height = parent.clientHeight;

    console.log({ width, height }, settings.radius);

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  setupEventHandlers() {
    const ref = this.props.audioRef2 || this.props.audioRef
    const audio = ref.current;
    const source = ctx.createMediaElementSource(audio); // creates audio source

    audio.addEventListener("play", () => {
      console.log("PLAY event");
    });

    audio.addEventListener("pause", () => {
      console.log("PAUSE event");
    });

    audio.addEventListener("loadeddata", () => {
      console.log("LOADED_DATA event");
      source.connect(ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
      source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
    });

    audio.addEventListener("ended", () => {
      console.log("ENDED event");
      // Force call initiateAudio to "replay" the song
      // this.audio.load();
      // this.audio.play();
    });

    window.addEventListener("resize", this.windowResize, false);
  }

  render() {
    return (
      <div
        // onClick={this.handleClick}
        className={styles.circle}
        ref={(ref) => (this.poop = ref)}
      >
        {/* Canvas Goes Here */}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => <App
  audioRef2={ref} {...props}
/>)
