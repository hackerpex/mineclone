import * as THREE from "three";
import { Controls } from "./controls/controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationClip, AnimationMixer, LoopOnce, LoopRepeat } from "three";
import { World } from "./models/World";

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

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let world;

document.body.addEventListener("click", function () {
  controls.start();
});


const onKeyDown = function ( event:any ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 850;
            canJump = false;
            break;

    }

};

const onKeyUp = function ( event:any ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );



init();

function init() {


 world = new World(scene);

  loadPlayer();




}

function loadPlayer() {
    const file = "./assets/models/player/player.glb";

  loader.load(
    file,
    function (gltf) {
         player = gltf.scene;
         player.position.y = -1;
         player.scale.set(10, 10, 10); // scale here
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
  const massa = 100;

  if(mixer){
    mixer.update( delta );
  } 

  if(player){
    // player.rotation.y += 0.01;
    //   player.rotation.x += 0.01;
  } 


 
  
  
  direction.z = Number( moveForward ) - Number( moveBackward );
  direction.x = Number( moveRight ) - Number( moveLeft );
  direction.normalize(); // this ensures consistent movements in all directions

  if ( moveForward || moveBackward ) {
      velocity.z -= direction.z * 400.0 * delta;
  }
  else{     
    // if(velocity.z < 0) velocity.z += 3; else velocity.z -= 3;
    velocity.z = 0;
  }
  
  if ( moveLeft || moveRight ) {
      velocity.x -= direction.x * 400.0 * delta;
  }
  else{
    //   if(velocity.x < 0) velocity.x += 3; else velocity.x -= 3;
    velocity.x = 0;
    }
      
    
 

//   velocity.x -= velocity.x * 1.0 * delta;
//   velocity.z -= velocity.z * 1.0 * delta;

  controls.update(velocity, delta);



//   player.position.x += velocity.x;
//   player.position.z += velocity.z;
//   lockControls.getObject().position.y +=  ( velocity.y * delta );


  prevTime = time;






  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
