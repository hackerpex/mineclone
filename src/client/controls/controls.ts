import { Vector3, Raycaster, Object3D } from "three";
// @ts-ignore
import { PointerLockControls } from "./PointerLockControls.js";

// const PointerLockControls = require('PointerLockControls.js');

let camera:Object3D;
let element;
let lockControls: PointerLockControls;
let player:Object3D;
let raycaster: Raycaster;




class Controls {
  constructor(tCamera: any, tElement: any) {
    // console.log('LOG','initControls');

    // player = tPlayer;
    camera = tCamera;
    element = tElement;
    lockControls = new PointerLockControls(camera, element);
    raycaster = new Raycaster(new Vector3(), new Vector3(0, -1, 0), 0, 10);
  }

  getLockControls(): PointerLockControls {
    return lockControls;
  }

  start() {
    lockControls.lock();
  }

  update(velocity: Vector3, delta: number) {
    // console.log('LOG','updateCamera');

  

    //we will use soon
    const gravidade = 19.8 * 100.0 * delta;
    velocity.y -= gravidade;

    raycaster.ray.origin.copy(lockControls.getObject().position);
    raycaster.ray.origin.x - velocity.x * delta;
    raycaster.ray.origin.y += velocity.y * delta;
    raycaster.ray.origin.z - velocity.z * delta;

    lockControls.moveRight(-velocity.x * delta);
     lockControls.moveForward(-velocity.z * delta);
    // new behavior
  }

   playerMoveRight ( player:Object3D, distance:number ) {
    const _vector = new Vector3();
    _vector.setFromMatrixColumn( camera.matrix, 0 );

    camera.position.addScaledVector( _vector, distance );

   }

   playerMoveForward ( player:Object3D, distance:number ) {

    const _vector = new Vector3();
    _vector.setFromMatrixColumn( camera.matrix, 0 );

    _vector.crossVectors( camera.up, _vector );

    camera.position.addScaledVector( _vector, distance );

    }

  getPlayerPosition(){
    return camera.position;
  }


}

export { Controls };
