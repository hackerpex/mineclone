import * as THREE from "three";
import { Controls } from "./controls/controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationClip, AnimationMixer, LoopOnce, LoopRepeat } from "three";

// SCENE
const scene = new THREE.Scene();


// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

// RENDER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new Controls(camera, document.body);
scene.add(controls.getLockControls().getObject());

// OBJECTS

let cube: THREE.Object3D;

let player: THREE.Object3D;


// LIGHT
const ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 0.5).normalize();
scene.add(directionalLight);



const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 2, 0 );
				scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 0, 2, 1 );
				scene.add( dirLight );

// vars

let mixer:AnimationMixer;
let clips:any;

const loader = new GLTFLoader();

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let walkAnimation;
let runAnimation;
let jumpAnimation;
let beatAnimation;

document.body.addEventListener("click", function () {
  controls.start();
});

init();

function init() {


  loadPlayer();
}

function loadPlayer() {
    const file = "./assets/models/player/player.glb";

  loader.load(
    file,
    function (gltf) {
        player = gltf.scene;
        player.position.y = -1;
        player.scale.set(0.39, 0.39, 0.39); // scale here
         mixer = new THREE.AnimationMixer( player );
         clips = gltf.animations;
         console.log(clips);
         walkAnimation = clips[10];
         runAnimation = clips[6];
         beatAnimation = clips[5];
         jumpAnimation = clips[3];
         mixer.clipAction(walkAnimation).setLoop(LoopRepeat,99999).play();
  

      scene.add(player);
    },
    (xhr) => {
      console.log("loaded", xhr.loaded);
    },
    (error) => {
      console.log("erro", error);
    }
  );
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  if(mixer){
    mixer.update( delta );
  } 

  if(player){
    player.rotation.y += 0.01;
    //   player.rotation.x += 0.01;
  } 


 
  controls.update(velocity, delta);

  prevTime = time;

  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
