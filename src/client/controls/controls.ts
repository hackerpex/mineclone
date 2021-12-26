import { Vector3, Raycaster, Object3D } from "three";
import { Block } from "../models/Block.js";
import { Chunk } from "../models/Chunk.js";
import { World } from "../models/World.js";
// @ts-ignore
import { PointerLockControls } from "./PointerLockControls.js";

// const PointerLockControls = require('PointerLockControls.js');

let camera:Object3D;
let element;
let lockControls: PointerLockControls;
let player:Object3D;
let raycaster: Raycaster;




class Controls {



  jumpForce = 0;
  canJump = true;
  constructor(tCamera: any, tElement: any ) {
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

  update(velocity: Vector3, delta: number, w:World) {
    // console.log('LOG','updateCamera');

    // console.log(w.chunks.length);

    velocity.x = Math.min(velocity.x, 400);
    velocity.z = Math.min(velocity.z, 400);
    velocity.x = Math.max(velocity.x, -400);
    velocity.z = Math.max(velocity.z, -400);

    velocity.y += this.jumpForce;

    //we will use soon
    let downSpeed = -3.0 * delta;    
    
     velocity.y += downSpeed ;
     velocity.y += this.jumpForce ;
     this.jumpForce = 0;
    // this.jumpForce -= gravidade;
    
    raycaster.ray.origin.copy(lockControls.getObject().position);
    raycaster.ray.origin.x - velocity.x * delta;
    raycaster.ray.origin.y += velocity.y * delta;
    raycaster.ray.origin.z - velocity.z * delta;

    lockControls.moveRight(-velocity.x * delta);
     lockControls.moveForward(-velocity.z * delta);
    // new behavior
  


    const _vector = new Vector3();
    _vector.setFromMatrixColumn( camera.matrix, 0 );

     if(this.checkColision(w)[1] == 1){
      velocity.y = 0;
     }

    
    //  camera.position.y += velocity.y  ;

    //  console.log(camera.position.y);
     
    
  }

  //  playerMoveRight ( player:Object3D, distance:number ) {
  //   const _vector = new Vector3();
  //   _vector.setFromMatrixColumn( camera.matrix, 0 );

  //   camera.position.addScaledVector( _vector, distance );

   

  //  }

  //  playerMoveForward ( player:Object3D, distance:number ) {

  //   const _vector = new Vector3();
  //   _vector.setFromMatrixColumn( camera.matrix, 0 );

  //   _vector.crossVectors( camera.up, _vector );

  //   camera.position.addScaledVector( _vector, distance );

  //   }

  getPlayerPosition(){
    return camera.position;
  }

  checkColision(w:World){
    
    let down_colision = false;
    if(w != null){
      let chunkX = Math.floor(camera.position.x / (w.chunkSize * w.blockSize));  
      let chunkZ = Math.floor(camera.position.z / (w.chunkSize * w.blockSize));  

      let chunk = (w.chunks[chunkX] ?? [])[chunkZ] ;
      if(chunk != null){



        //  console.log(chunk);
        const vX =  camera.position.x  - (chunkX * w.chunkSize * w.blockSize) ;
        const vZ =  camera.position.z  - (chunkZ * w.chunkSize * w.blockSize) ;
        const vY =  camera.position.y ;
        let blockX = Math.floor( vX / w.blockSize);  
        let blockZ = Math.floor( vZ / w.blockSize);  
        let blockY = Math.floor( vY / w.blockSize);  
        
        let block_down:Block = ((chunk.blocks[blockX]?? [])[blockZ]??[])[blockY-1] ;
        // console.log(chunk);
        if (block_down != null){
          
          if(block_down.code == 1){
            down_colision = true;
          }
          
        }
        else{
          down_colision = true;
        }
      }
  }
    

    return[
      1,down_colision,1,1,1,1
    ]
  }

  jump(){
    this.jumpForce = 1;
    // if ( this.canJump === true ) velocity.y += 850;
    // canJump = false;
  }


}

export { Controls };
