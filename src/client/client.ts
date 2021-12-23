
import { Controls } from "./controls/controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AmbientLight, AnimationClip, AnimationMixer, DirectionalLight, HemisphereLight, LoopOnce, LoopRepeat, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { World } from "./models/World";
import * as Stats from 'stats.js';

// SCENE
const scene = new Scene();

//STATS
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);  // <-- remove me


// CAMERA
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 50;
camera.position.z = 60;
camera.position.y = 25*10;

// RENDER
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new Controls(camera, document.body);
scene.add(controls.getLockControls().getObject());

// OBJECTS

let cube: THREE.Object3D;

let player: THREE.Object3D;


// LIGHT

// addLights();

const ambientLight = new AmbientLight(0xcccccc);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 0.1).normalize();
scene.add(directionalLight);



// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
// 				hemiLight.position.set( 0, 2, 0 );
// 				scene.add( hemiLight );

// const dirLight = new THREE.DirectionalLight( 0xffffff );
// 				dirLight.position.set( 10, 2, 1 );
// 				scene.add( dirLight );

// vars

let mixer:AnimationMixer;
let clips:any;

const loader = new GLTFLoader();

let prevTime = performance.now();
const velocity = new Vector3();
const direction = new Vector3();
const position = new Vector3();

let walkAnimation;
let runAnimation;
let jumpAnimation;
let beatAnimation;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let world:World;

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


 world = new World(scene,camera);

  loadPlayer();




}

function addLights() {
    const light = new HemisphereLight(0xffffff, 0xffffff, 0.9);
    scene.add(light);
  
    const directLight1 = new DirectionalLight(0xffd798, 0.8);
    directLight1.castShadow = true;
    directLight1.position.set(9.5, 8.2, 8.3);
    scene.add(directLight1);
  
    const directLight2 = new DirectionalLight(0xc9ceff, 0.5);
    directLight2.castShadow = true;
    directLight2.position.set(-15.8, 5.2, 8);
    scene.add(directLight2);
  }

function loadPlayer() {
    const file = "./assets/models/player/player.glb";

  loader.load(
    file,
    function (gltf) {
         player = gltf.scene;
         player.position.y = 20;
         player.scale.set(1, 1, 1); // scale here
         mixer = new AnimationMixer( player );
         clips = gltf.animations;
        //  console.log(clips);
         walkAnimation = clips[10];
         runAnimation = clips[6];
         beatAnimation = clips[5];
         jumpAnimation = clips[3];
         mixer.clipAction(walkAnimation).setLoop(LoopRepeat,99999).play();
  

      scene.add(player);
    },
    (xhr) => {
      // console.log("loaded", xhr.loaded);
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

if(controls != null && controls.getPlayerPosition() != null ){
  world.updateWorld(controls.getPlayerPosition(),direction);
}


  prevTime = time;






  render();
}

function render() {
  renderer.render(scene, camera);
  stats.update();
}

animate();
