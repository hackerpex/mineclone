import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";
import {  Matrix4, Mesh, MeshLambertMaterial, NearestFilter, PlaneGeometry, Scene, Texture, TextureLoader,DoubleSide } from "three";
import { Chunk } from "./Chunk.ts";
import { Block } from "./Block.ts";

const {SimplexNoise} = require('simplex-noise');

//https://www.diva-portal.org/smash/get/diva2:1355216/FULLTEXT01.pdf

let chunks = [];
let scene:Scene;

const worldWidth = 1,
  worldDepth = 1;

const textures:Texture[] =[];

class World {
  constructor(tScene: Scene) {
      scene = tScene;
    console.log("criando mundo");
    // this.createGeometries();
    this.loadTextures();

  
    const seed = 'myseed4';
    const simplex = new SimplexNoise(seed);
    
    // const resolutionNoise = 0.05    ;

    let chunck = new Chunk(textures);
    chunck.generateChunk(scene,simplex,textures);


  }
   
//   createBlock(x:number,z:number,y:number){

    
//     matrix.makeTranslation(
//         x * blockSize ,
//         y * blockSize,
//         z * blockSize 
//     );
//     let geometries = [];

//     let block = new Block();

//     block.topGeometry = topGeometry.clone().applyMatrix4( matrix );
//     block.downGeometry = downGeometry.clone().applyMatrix4( matrix );
//     block.leftGeometry = leftGeometry.clone().applyMatrix4( matrix );
//     block.rightGeometry = rightGeometry.clone().applyMatrix4( matrix );
//     block.frontGeometry = frontGeometry.clone().applyMatrix4( matrix );
//     block.backGeometry = backGeometry.clone().applyMatrix4( matrix );
    
//     geometries.push(  );
    
        
//         const geometry = mergeBufferGeometries( geometries );
//          geometry.computeBoundingSphere();

   

//         const mesh = new Mesh( geometry, new MeshLambertMaterial( { map: textures[0], side: DoubleSide } ) );
//         mesh.name = "teste";


        
//         scene.add( mesh );


// }

  
  loadTextures(){
    const texture_path = "../assets/textures/";
    const texture_name = "texture_grass_";
    
     textures[0] = new TextureLoader().load(
      texture_path + "texture_grass.png"
    );
    textures[0].magFilter = NearestFilter;
  }

 
}



export { World };
