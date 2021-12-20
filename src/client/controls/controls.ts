import { Vector3, Raycaster } from "three";
// @ts-ignore
import { PointerLockControls } from "./PointerLockControls.js";

// const PointerLockControls = require('PointerLockControls.js');

let camera;
let element;
let lockControls: PointerLockControls;

let raycaster: Raycaster;

class Controls {
  constructor(tCamera: any, tElement: any) {
    // console.log('LOG','initControls');

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

    velocity.x -= velocity.x * 1.0 * delta;
    velocity.z -= velocity.z * 1.0 * delta;

    //we will use soon
    // const gravidade = 19.8 * 100.0 * delta;
    // velocity.y -= gravidade;

    raycaster.ray.origin.copy(lockControls.getObject().position);
    raycaster.ray.origin.x - velocity.x * delta;
    raycaster.ray.origin.y += velocity.y * delta;
    raycaster.ray.origin.z - velocity.z * delta;

    lockControls.moveRight(-velocity.x * delta);
    lockControls.moveForward(-velocity.z * delta);
  }
}

export { Controls };
