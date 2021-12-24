import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";
import {
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  PlaneGeometry,
  Scene,
  Texture,
  TextureLoader,
  DoubleSide,
  Vector3,
  Object3D,
  Fog,
} from "three";
import { Chunk } from "./Chunk.ts";
import { Block } from "./Block.ts";

const { SimplexNoise } = require("simplex-noise");

//https://www.diva-portal.org/smash/get/diva2:1355216/FULLTEXT01.pdf

export class World {
  lastX: number = 9999;
  lastZ: number = 9999;
  textures: Texture[] = [];
  scene: Scene;
  camera: Object3D;
  chunkSize = 2;
  blockSize = 6;
  chunksDistance: number = 6;
  chunks = [] as any;
  linearChunks = [];
  simplex = new SimplexNoise("myseed5");
  constructor(scene: Scene, camera: Object3D) {
    this.scene = scene;
    this.camera = camera;

    this.loadTextures();

    //FOG
    scene.fog = new Fog( 0x000000, 40, 110 );

  }
  updateWorld(f: Vector3, direction: Vector3) {
    const realX = Math.floor(
      this.camera.position.x / (this.chunkSize * this.blockSize)
    );
    const realZ = Math.floor(
      this.camera.position.z / (this.chunkSize * this.blockSize)
    );

    if (this.lastX == realX && this.lastZ == realZ) {
      return;
    }
    this.removeFarChunks(realX, realZ);
    this.createChunks(realX, realZ);

    this.lastX = realX;
    this.lastZ = realZ;
  }

  createChunks(realX: number, realZ: number) {
    for (let x = this.chunksDistance * -1; x <= this.chunksDistance; x++) {
      for (let z = this.chunksDistance * -1; z <= this.chunksDistance; z++) {
        this.createChunkAt(realX + x, realZ + z);
      }
    }
    // console.log('chuncks criados');

    // let chunck = new Chunk(0,0);
    // chunck.generateChunk(this.scene,this.simplex,this.textures);
  }

  createChunkAt(x: number, z: number) {
    let chunk;
    try {
      chunk = this.chunks[x][z];
    } catch (error) {}
    if (chunk == null || chunk == undefined) {
      // console.log('criando chunk X:',x,'Z:',z);
      chunk = new Chunk(x, z, this.chunkSize, this.blockSize);
      chunk.generateChunk(this.scene, this.simplex, this.textures);
      // console.log('gerou');
      if (this.chunks[x] == null) {
        this.chunks[x] = [];
      }
      this.chunks[x][z] = chunk;
      this.linearChunks.push(chunk);
      // console.log('pronto');
    }
  }

  removeFarChunks(realX: number, realZ: number) {
    const ds = this.chunksDistance*2;

    let theChunks = this.chunks;
    this.linearChunks.forEach(function (element, index, object) {
      if (
        element.posX < realX - ds ||
        element.posX > realX + ds ||
        element.posZ < realZ - ds ||
        element.posZ > realZ + ds
      ) {
        //  console.log('remover X:',realX,'Z:',realZ);
        element.clean();
        // console.log('limpou');
        object.splice(index, 1);
        theChunks[element.posX][element.posZ] = null;
        element = null;
        // console.log('removeu');
      }
    });
  }

  loadTextures() {
    const texture_path = "../assets/textures/";
    

    this.textures[0] = new TextureLoader().load(
      texture_path + "0.png"
    );
    this.textures[0].magFilter = NearestFilter;


    this.textures[1] = new TextureLoader().load(
      texture_path + "1.png"
    );
    this.textures[1].magFilter = NearestFilter;

    this.textures[10000] = new TextureLoader().load(
      texture_path + "10000.png"
    );
    this.textures[10000].magFilter = NearestFilter;
  }
}
