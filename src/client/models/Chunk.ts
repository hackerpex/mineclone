import { DoubleSide, Matrix4, Mesh, MeshLambertMaterial, PlaneGeometry, Scene, Texture } from "three";
import { Block } from "./Block";
import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";
import { BlockType } from "./BlockType";

const {SimplexNoise} = require('simplex-noise');




const blockSize = 10;

const matrix = new Matrix4();

let topGeometry:PlaneGeometry;
let downGeometry:PlaneGeometry;
let leftGeometry:PlaneGeometry;
let rightGeometry:PlaneGeometry;
let frontGeometry:PlaneGeometry;
let backGeometry:PlaneGeometry;


const neighborOffsets = [
    [ 0,  0,  1], // top
    [ 0,  0, -1], // down
    [-1,  0,  0], // left
    [ 1,  0,  0], // right
    [ 0,  -1,  0], // front
    [ 0, 1,  0] // back
    
  ];





class Chunk {
    size :number = 8;
    heigth:number = 256;
    blocks = [] as  any;
    seaLevel =40;
    textures = [] ;
    scene?:Scene;
    constructor(){
        this.createGeometries();
    }

    generateChunk(scene:Scene, noise:any, textures:[]){
        this.scene =scene;
        this.textures = textures;
        const resolutionNoise = 0.05 
        
        let xOff = 0 ;
        for ( let x = 0; x < this.size; x ++ ) {
            let zOff = 0 ;
            this.blocks[x]= [];
            for ( let z = 0; z < this.size; z ++ ) {
                let yOff = 0 ;
                this.blocks[x][z]= [];
                for ( let y = 0; y < this.heigth; y ++ ) {
                    let block = new Block();
                    const value3d = noise.noise3D(xOff, yOff, zOff);
                    const value2d = noise.noise2D(xOff, zOff);
                    if(value3d <= 0.3){
                       block.code = 1;
                    }
                    if (y >= this.seaLevel){
                        block.code = 0;
                        // console.log('v:',value2d);
                         if( (y - this.seaLevel) < Math.floor(value2d*10) ){
                            block.code = 1;
                        }
                       
                        
                    }

                    this.blocks[x][z][y]= block;
                    yOff += resolutionNoise;    
                }
                zOff += resolutionNoise;   
            }
            xOff += resolutionNoise;    
        }
        

        this.generateMesh();
    }

    generateMesh(){
        
        for ( let x = 0; x < this.size; x ++ ) {
            
            for ( let z = 0; z < this.size; z ++ ) {
            
                for ( let y = 0; y < this.heigth; y ++ ) {
                    let block = this.blocks[x][z][y];
                    let geometries = [];
                    matrix.makeTranslation(
                        x * blockSize ,
                        y * blockSize,
                        z * blockSize 
                    );
                
                    //check if draw
                    //TOP
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[0][0]][z+neighborOffsets[0][1]][y+neighborOffsets[0][2]])){
                            geometries.push(topGeometry.clone().applyMatrix4( matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(topGeometry.clone().applyMatrix4( matrix ))
                    }
                    //DOWN
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[1][0]][z+neighborOffsets[1][1]][y+neighborOffsets[1][2]])){
                            geometries.push(downGeometry.clone().applyMatrix4( matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(downGeometry.clone().applyMatrix4( matrix ))
                    }
                    //LEFT
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[2][0]][z+neighborOffsets[2][1]][y+neighborOffsets[2][2]])){
                            geometries.push(leftGeometry.clone().applyMatrix4( matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(leftGeometry.clone().applyMatrix4( matrix ))
                    }
                    //RIGHT
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[3][0]][z+neighborOffsets[3][1]][y+neighborOffsets[3][2]])){
                            geometries.push(rightGeometry.clone().applyMatrix4( matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(rightGeometry.clone().applyMatrix4( matrix ))
                    }

                    //FRONT
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[4][0]][z+neighborOffsets[4][1]][y+neighborOffsets[4][2]])){
                            geometries.push(frontGeometry.clone().applyMatrix4( matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(frontGeometry.clone().applyMatrix4( matrix ))
                    }
                    //BACK
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[5][0]][z+neighborOffsets[5][1]][y+neighborOffsets[5][2]])){
                            geometries.push(backGeometry.clone().applyMatrix4( matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(backGeometry.clone().applyMatrix4( matrix ))
                    }

                    if (geometries.length > 0){
                        const geometry = mergeBufferGeometries( geometries );
                        geometry.computeBoundingSphere();
               
                        let texture = this.textures[0];
                        if(block.code == 1){
                            texture = this.textures[0];
                            const mesh = new Mesh( geometry, new MeshLambertMaterial( { map:texture, side: DoubleSide } ) );
                            mesh.name = "teste";
                            this.scene!.add( mesh );
                            
                        }
                      
                       
                    }
                  
                    
                }
            }
        }
    }
    needsToDrawFace(block:Block){
        if(block != null && block.code != 0){
            return false;
        }
        return true
    }

    getBlockNameByCode(code:number){
        switch (code) {
            case 0:     return 'air';       break;
            case 1:     return 'stone';     break;
            case 1.1:   return 'Granite';   break;
                
            default:   return 'air'; break;
        }
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

}
export {
    Chunk
};