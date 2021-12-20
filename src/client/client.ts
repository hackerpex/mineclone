import * as THREE from "three";
import { Controls } from "./controls/controls";

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

// vars

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
