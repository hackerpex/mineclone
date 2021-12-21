// import * as THREE from "three";
import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";
import {  Matrix4, Mesh, MeshLambertMaterial, NearestFilter, PlaneGeometry, Scene, Texture, TextureLoader,DoubleSide } from "three";

let chunks = [];
let scene:Scene;

const worldWidth = 1,
  worldDepth = 1;
const chunkSize = 16;
const chunkHeigh = 256;

const blockSize = 100;

const matrix = new Matrix4();

let topGeometry:PlaneGeometry;
let downGeometry:PlaneGeometry;
let leftGeometry:PlaneGeometry;
let rightGeometry:PlaneGeometry;
let frontGeometry:PlaneGeometry;
let backGeometry:PlaneGeometry;





const textures:Texture[] =[];

class World {
  constructor(tScene: Scene) {
      scene = tScene;
    console.log("criando mundo");
    this.createGeometries();
    this.loadTextures();

    for (let y = 0; y < chunkSize; y++) {
      for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
            const block =  this.createBlock(x,z,y);

        }
      }
    }
  }
   
  createBlock(x:number,z:number,y:number){

    matrix.makeTranslation(
        x * blockSize ,
        y * blockSize,
        z * blockSize 
    );
    let geometries = [];

    geometries.push( topGeometry.clone().applyMatrix4( matrix ) );
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
        // let  block = {'x':x,'z':z,'y':y,'id':0x0001,'mesh':mesh} ;
        // return block;

}

  createGeometries(){
    topGeometry = new PlaneGeometry(100, 100);
    const uvs = topGeometry.attributes.uv.array;
    console.log(uvs);
    // @ts-ignore
    topGeometry.attributes.uv.array[2] = 0.1;
    // @ts-ignore
    topGeometry.attributes.uv.array[6] = 0.1;
    
    topGeometry.translate(0, 0, 50);
    topGeometry.rotateX(-Math.PI / 2);
    topGeometry.rotateY(Math.PI);
    topGeometry.rotateY(Math.PI);
    
     downGeometry = new PlaneGeometry(100, 100);
    // @ts-ignore
    downGeometry.attributes.uv.array[0] = 0.1;
    // @ts-ignore
    downGeometry.attributes.uv.array[2] = 0.2;
    // @ts-ignore
    downGeometry.attributes.uv.array[4] = 0.1;
    // @ts-ignore
    downGeometry.attributes.uv.array[6] = 0.2;
    
    downGeometry.translate(0, 0, 50);
    downGeometry.rotateX(Math.PI / 2);
    downGeometry.rotateY(Math.PI);
    downGeometry.rotateY(Math.PI);
    
     leftGeometry = new PlaneGeometry(100, 100);
    // @ts-ignore
    leftGeometry.attributes.uv.array[0] = 0.2;
    // @ts-ignore
    leftGeometry.attributes.uv.array[2] = 0.3;
    // @ts-ignore
    leftGeometry.attributes.uv.array[4] = 0.2;
    // @ts-ignore
    leftGeometry.attributes.uv.array[6] = 0.3;
    
    leftGeometry.translate(0, 0, 50);
    leftGeometry.rotateY(-Math.PI / 2);
    
     rightGeometry = new PlaneGeometry(100, 100);
    // @ts-ignore
    rightGeometry.attributes.uv.array[0] = 0.3;
    // @ts-ignore
    rightGeometry.attributes.uv.array[2] = 0.4;
    // @ts-ignore
    rightGeometry.attributes.uv.array[4] = 0.3;
    // @ts-ignore
    rightGeometry.attributes.uv.array[6] = 0.4;
    
    rightGeometry.translate(0, 0, 50);
    
    rightGeometry.rotateY(Math.PI / 2);
    
     frontGeometry = new PlaneGeometry(100, 100);
    // @ts-ignore
    frontGeometry.attributes.uv.array[0] = 0.4;
    // @ts-ignore
    frontGeometry.attributes.uv.array[2] = 0.5;
    // @ts-ignore
    frontGeometry.attributes.uv.array[4] = 0.4;
    // @ts-ignore
    frontGeometry.attributes.uv.array[6] = 0.5;
    
    frontGeometry.translate(0, 0, -50);
    
     backGeometry = new PlaneGeometry(100, 100);
    // @ts-ignore
    backGeometry.attributes.uv.array[0] = 0.5;
    // @ts-ignore
    backGeometry.attributes.uv.array[2] = 0.6;
    // @ts-ignore
    backGeometry.attributes.uv.array[4] = 0.5;
    // @ts-ignore
    backGeometry.attributes.uv.array[6] = 0.6;
    
    backGeometry.translate(0, 0, 50);
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
