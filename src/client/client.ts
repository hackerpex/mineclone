import * as THREE from "three";
import { Controls } from "./controls/controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

// LIGHT
const ambientLight = new THREE.AmbientLight(0xcccccc);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 0.5).normalize();
scene.add(directionalLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(5, 5, 0.5).normalize();
scene.add(directionalLight1);

// vars

const loader = new GLTFLoader();

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

document.body.addEventListener("click", function () {
  controls.start();
});

init();

function init() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  loadPlayer();
}

function loadPlayer() {
  const file = "./assets/models/steve/scene.gltf";
  // const file ='./assets/models/monkey/monkey.gltf';
  loader.load(
    file,
    function (gltf) {
      gltf.scene.scale.set(0.03, 0.03, 0.03); // scale here
      scene.add(gltf.scene);
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

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update(velocity, delta);

  prevTime = time;

  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
