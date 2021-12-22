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
const chunkSize =32;
const chunkHeigh = 10;

const blockSize = 10;

const matrix = new Matrix4();

let topGeometry:PlaneGeometry;
let downGeometry:PlaneGeometry;
let leftGeometry:PlaneGeometry;
let rightGeometry:PlaneGeometry;
let frontGeometry:PlaneGeometry;
let backGeometry:PlaneGeometry;
const neighborOffsets = [
    [ 0,  0,  0], // self
    [-1,  0,  0], // left
    [ 1,  0,  0], // right
    [ 0, -1,  0], // down
    [ 0,  1,  0], // up
    [ 0,  0, -1], // back
    [ 0,  0,  1], // front
  ];




const textures:Texture[] =[];

class World {
  constructor(tScene: Scene) {
      scene = tScene;
    console.log("criando mundo");
    this.createGeometries();
    this.loadTextures();

  
    const seed = 'myseed1';
    const simplex = new SimplexNoise(seed);
    const resolutionNoise = 0.05    ;

    let chunck = new Chunk();


    let xOff = 0 ;
      for (let x = 0; x < chunkSize; x++) {
        let zOff = 0 ;
        for (let z = 0; z < chunkSize; z++) {
             let yOff = 0 ;
             for (let y = 0; y < chunkHeigh; y++) {
                const value3d = simplex.noise3D(xOff, yOff, zOff);
                 if(value3d <= 0.3){
                    const block =  this.createBlock(x,z,y);
                 }
                 yOff += resolutionNoise;
             }
            zOff += resolutionNoise;
      }
      xOff += resolutionNoise;
    }
  }
   
  createBlock(x:number,z:number,y:number){

    
    matrix.makeTranslation(
        x * blockSize ,
        y * blockSize,
        z * blockSize 
    );
    let geometries = [];

    let block = new Block();

    block.topGeometry = topGeometry.clone().applyMatrix4( matrix );
    
    geometries.push( downGeometry.clone().applyMatrix4( matrix ) );
    geometries.push( leftGeometry.clone().applyMatrix4( matrix ) );
    geometries.push( rightGeometry.clone().applyMatrix4( matrix ) );
    geometries.push( frontGeometry.clone().applyMatrix4( matrix ) );
    geometries.push( backGeometry.clone().applyMatrix4( matrix ) );

        
        const geometry = mergeBufferGeometries( geometries );
         geometry.computeBoundingSphere();

   

        const mesh = new Mesh( geometry, new MeshLambertMaterial( { map: textures[0], side: DoubleSide } ) );
        mesh.name = "teste";


        
        scene.add( mesh );


}

  createGeometries(){

    var block_half = blockSize/2;
    topGeometry = new PlaneGeometry(blockSize, blockSize);
    const uvs = topGeometry.attributes.uv.array;
    console.log(uvs);
    // @ts-ignore
    topGeometry.attributes.uv.array[2] = 0.1;
    // @ts-ignore
    topGeometry.attributes.uv.array[6] = 0.1;
    
    topGeometry.translate(0, 0, block_half);
    topGeometry.rotateX(-Math.PI / 2);
    topGeometry.rotateY(Math.PI);
    topGeometry.rotateY(Math.PI);
    
     downGeometry = new PlaneGeometry(blockSize, blockSize);
    // @ts-ignore
    downGeometry.attributes.uv.array[0] = 0.1;
    // @ts-ignore
    downGeometry.attributes.uv.array[2] = 0.2;
    // @ts-ignore
    downGeometry.attributes.uv.array[4] = 0.1;
    // @ts-ignore
    downGeometry.attributes.uv.array[6] = 0.2;
    
    downGeometry.translate(0, 0, block_half);
    downGeometry.rotateX(Math.PI / 2);
    downGeometry.rotateY(Math.PI);
    downGeometry.rotateY(Math.PI);
    
     leftGeometry = new PlaneGeometry(blockSize, blockSize);
    // @ts-ignore
    leftGeometry.attributes.uv.array[0] = 0.2;
    // @ts-ignore
    leftGeometry.attributes.uv.array[2] = 0.3;
    // @ts-ignore
    leftGeometry.attributes.uv.array[4] = 0.2;
    // @ts-ignore
    leftGeometry.attributes.uv.array[6] = 0.3;
    
    leftGeometry.translate(0, 0, block_half);
    leftGeometry.rotateY(-Math.PI / 2);
    
     rightGeometry = new PlaneGeometry(blockSize, blockSize);
    // @ts-ignore
    rightGeometry.attributes.uv.array[0] = 0.3;
    // @ts-ignore
    rightGeometry.attributes.uv.array[2] = 0.4;
    // @ts-ignore
    rightGeometry.attributes.uv.array[4] = 0.3;
    // @ts-ignore
    rightGeometry.attributes.uv.array[6] = 0.4;
    
    rightGeometry.translate(0, 0, block_half);
    
    rightGeometry.rotateY(Math.PI / 2);
    
     frontGeometry = new PlaneGeometry(blockSize, blockSize);
    // @ts-ignore
    frontGeometry.attributes.uv.array[0] = 0.4;
    // @ts-ignore
    frontGeometry.attributes.uv.array[2] = 0.5;
    // @ts-ignore
    frontGeometry.attributes.uv.array[4] = 0.4;
    // @ts-ignore
    frontGeometry.attributes.uv.array[6] = 0.5;
    
    frontGeometry.translate(0, 0, -block_half);
    
     backGeometry = new PlaneGeometry(blockSize, blockSize);
    // @ts-ignore
    backGeometry.attributes.uv.array[0] = 0.5;
    // @ts-ignore
    backGeometry.attributes.uv.array[2] = 0.6;
    // @ts-ignore
    backGeometry.attributes.uv.array[4] = 0.5;
    // @ts-ignore
    backGeometry.attributes.uv.array[6] = 0.6;
    
    backGeometry.translate(0, 0, block_half);
  }
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
