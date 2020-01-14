import React, { Fragment } from "react";
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
  state = {
    source: {},
    audioURLS: [
      // "https://a.clyp.it/cwvlsmnd.mp3", //rain
      // "https://a.clyp.it/jagqtd5f.mp3",
      // 'https://a.clyp.it/h1vtpoe4.mp3',
      // "https://a.clyp.it/mkfjydwq.mp3", //Italo disco
      // 'https://a.clyp.it/zas30wns.mp3', //sertraline
      'https://a.clyp.it/xj0g30io.mp3', // blackbirds
      // "https://a.clyp.it/fkvlpwft.mp3", // practice9short
      // 'https://a.clyp.it/bfujpc4c.mp3', // poetry
      // "https://a.clyp.it/0ar0p540.mp3", // 6.4
      "https://a.clyp.it/jtxyzmfx.mp3", // 6.17 old,
      // 'https://a.clyp.it/p2fpdn5n.mp3', // SHANDREW
      // "https://a.clyp.it/qohhjp5p.mp3" //BEAT2
    ],
    audioIndex: 0
  };

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

    // Get parent element
    parent = this.poop.parentElement;
    console.log({ parent });

    scene = new THREE.Scene();

    // Camera
    const cameraSettings = {
      fov: 20,
      width: parent.clientWidth,
      height: parent.clientHeight
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
    // renderer.setSize(settings.maxRadius, settings.maxRadius);

    canvas = renderer.domElement;
    console.log({ canvas, parent });
    this.poop.appendChild(canvas);

    // Set Color
    renderer.setClearColor(0x000000, 0);

    // Create Canvas in HTML imperatively
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body

    // Set up Particles Geometry
    let particle;
    for (let i = 0; i <= 2048; i++) {
      const material = new THREE.SpriteCanvasMaterial({
        color: 0x000000,
        program: function(context) {
          context.beginPath();
          context.arc(0, 0, 0.33, 0, PI2);
          context.fill();
        }
      });
      particle = particles[i++] = new THREE.Particle(material);

      scene.add(particle);
    }

    // Audio index init
    const audioIndex = Math.floor(Math.random() * this.state.audioURLS.length);

    // Set State
    this.setState({
      audioIndex
    });
    this.animate();

    window.addEventListener("resize", this.windowResize, false);
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

      // FLOWER
      // particle.position.x =
      //   (settings.aFlower + settings.bFlower * ((settings.flowerAngle / 100) * j)) *
      //     Math.cos((settings.flowerAngle / 100) * j) +
      //   Math.sin(j / (settings.flowerAngle / 100)) * 17;
      // particle.position.y =
      //   (settings.aFlower + settings.bFlower * ((settings.flowerAngle / 100) * j)) *
      //     Math.sin((settings.flowerAngle / 100) * j) +
      //   Math.cos(j / (settings.flowerAngle / 100)) * 17;
      // particle.position.z =
      //   timeFloatData[j] * timeByteData[j] * intensity;
      // camera.position.y = 0;
    }
    camera.fov = settings.fov;
    camera.updateProjectionMatrix();
  }

  windowResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    width = parent.clientWidth;
    height = parent.clientHeight;

    console.log({width, height}, settings.radius)

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  handleClick = e => {
    e.preventDefault();

    if (isEmpty(this.audio.src)) {
      this.initiateAudio(); // initiates audio from the dropped file
      this.setupAudioHandlers();
    } else if (!this.audio.paused) {
      this.audio.pause();
    } else {
      this.audio.play();
    }

    console.log("new", { camera });
  };

  initiateAudio() {
    // Load src
    this.audio.src = this.getURL();
    this.audio.load();
    this.audio.play();

    // Cors
    this.audio.crossOrigin = "anonymous";

    const source = ctx.createMediaElementSource(this.audio); // creates audio source
    source.connect(ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
    source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode

    this.setState(
      {
        source
      },
      () => console.log(this.state)
    );
    this.animate();
  }

  setupAudioHandlers() {
    this.audio.addEventListener("play", () => {
      // alert("play")
      console.log("PLAY event");
    });

    this.audio.addEventListener("ended", () => {
      console.log("ENDED event");
      // Force call initiateAudio to "replay" the song
      this.audio.src = this.getURL();
      this.audio.load();
      this.audio.play();
    });
  }

  getURL() {
    let { audioIndex, audioURLS } = this.state;
    audioIndex++;
    if (audioIndex >= audioURLS.length) {
      audioIndex = 0;
    }
    this.setState({ audioIndex });
    return corsProxy + audioURLS[audioIndex];
  }

  render() {
    return (
      <div
        onClick={this.handleClick}
        className={styles.circle}
        ref={ref => (this.poop = ref)}
      >
        {/* Canvas Goes Here */}
        <audio ref={ref => (this.audio = ref)} />
      </div>
    );
  }
}

export default App;
