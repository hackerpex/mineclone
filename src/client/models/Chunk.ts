import { DoubleSide, Matrix4, Mesh, MeshLambertMaterial, PlaneGeometry, Scene, Texture } from "three";
import { Block } from "./Block";
import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";
import { BlockType } from "./BlockType";

const {SimplexNoise} = require('simplex-noise');









const neighborOffsets = [
    [ 0,  0,  1], // top
    [ 0,  0, -1], // down
    [-1,  0,  0], // left
    [ 1,  0,  0], // right
    [ 0,  -1,  0], // front
    [ 0, 1,  0] // back
    
  ];





export class Chunk {
    posX:number =0;
    posZ:number =0;
    // size :number = 2;
    blockSize = 10;
    heigth:number = 50;
    blocks = [] as  any;
    meshList = [] as  any;
    
    seaLevel =10;
    textures = [] ;
    scene?:Scene;

     matrix = new Matrix4();

 topGeometry:PlaneGeometry;
 downGeometry:PlaneGeometry;
 leftGeometry:PlaneGeometry;
 rightGeometry:PlaneGeometry;
 frontGeometry:PlaneGeometry;
 backGeometry:PlaneGeometry;

    constructor(x:number,z:number){
        this.posX =x;
        this.posZ =z;
        this.createGeometries();
    }

    clean(){
        this.meshList.forEach(element => {            
            this.scene.remove(element);
        });
        
        
    }

    generateChunk(scene:Scene, noise:any, textures:[]){
        this.scene =scene;
        this.textures = textures;
        const resolutionNoise = 0.05 
        
        let xOff = this.posX * this.blockSize * resolutionNoise ;
        for ( let x = this.posX*this.blockSize; x < this.posX*this.blockSize +this.blockSize; x ++ ) {
            let zOff = this.posZ * this.blockSize * resolutionNoise;
            this.blocks[x]= [];
            for ( let z = this.posZ*this.blockSize; z < this.posZ*this.blockSize + this.blockSize; z ++ ) {
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
        
        for ( let x = this.posX*this.blockSize; x < this.posX*this.blockSize +this.blockSize; x ++ ) {
            
            for ( let z = this.posZ*this.blockSize; z < this.posZ*this.blockSize + this.blockSize; z ++ ) {
            
                for ( let y = 0; y < this.heigth; y ++ ) {
                    let block:Block = this.blocks[x][z][y];
                    let geometries = [];
                    this.matrix.makeTranslation(
                        x * this.blockSize ,
                        y * this.blockSize,
                        z * this.blockSize 
                    );
                
                    //check if draw
                    //TOP
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[0][0]][z+neighborOffsets[0][1]][y+neighborOffsets[0][2]])){
                            geometries.push(this.topGeometry.clone().applyMatrix4( this.matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(this.topGeometry.clone().applyMatrix4( this.matrix ))
                    }
                    //DOWN
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[1][0]][z+neighborOffsets[1][1]][y+neighborOffsets[1][2]])){
                            geometries.push(this.downGeometry.clone().applyMatrix4( this.matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(this.downGeometry.clone().applyMatrix4( this.matrix ))
                    }
                    //LEFT
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[2][0]][z+neighborOffsets[2][1]][y+neighborOffsets[2][2]])){
                            geometries.push(this.leftGeometry.clone().applyMatrix4( this.matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(this.leftGeometry.clone().applyMatrix4( this.matrix ))
                    }
                    //RIGHT
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[3][0]][z+neighborOffsets[3][1]][y+neighborOffsets[3][2]])){
                            geometries.push(this.rightGeometry.clone().applyMatrix4( this.matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(this.rightGeometry.clone().applyMatrix4( this.matrix ))
                    }

                    //FRONT
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[4][0]][z+neighborOffsets[4][1]][y+neighborOffsets[4][2]])){
                            geometries.push(this.frontGeometry.clone().applyMatrix4( this.matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(this.frontGeometry.clone().applyMatrix4( this.matrix ))
                    }
                    //BACK
                    try {
                        if(this.needsToDrawFace(this.blocks[x+neighborOffsets[5][0]][z+neighborOffsets[5][1]][y+neighborOffsets[5][2]])){
                            geometries.push(this.backGeometry.clone().applyMatrix4( this.matrix ))
                        }
                            
                    } catch (error) {
                        geometries.push(this.backGeometry.clone().applyMatrix4( this.matrix ))
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
                            block.setMesh(mesh);
                            
                            this.meshList.push(mesh);
                            
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

        var block_half = this.blockSize/2;
        this.topGeometry = new PlaneGeometry(this.blockSize, this.blockSize);
        const uvs = this.topGeometry.attributes.uv.array;
        // console.log(uvs);
        // @ts-ignore
        this.topGeometry.attributes.uv.array[2] = 0.1;
        // @ts-ignore
        this.topGeometry.attributes.uv.array[6] = 0.1;
        
        this.topGeometry.translate(0, 0, block_half);
        this.topGeometry.rotateX(-Math.PI / 2);
        this.topGeometry.rotateY(Math.PI);
        this.topGeometry.rotateY(Math.PI);
        
        this.downGeometry = new PlaneGeometry(this.blockSize, this.blockSize);
        // @ts-ignore
        this.downGeometry.attributes.uv.array[0] = 0.1;
        // @ts-ignore
        this.downGeometry.attributes.uv.array[2] = 0.2;
        // @ts-ignore
        this.downGeometry.attributes.uv.array[4] = 0.1;
        // @ts-ignore
        this.downGeometry.attributes.uv.array[6] = 0.2;
        
        this.downGeometry.translate(0, 0, block_half);
        this.downGeometry.rotateX(Math.PI / 2);
        this.downGeometry.rotateY(Math.PI);
        this.downGeometry.rotateY(Math.PI);
        
        this.leftGeometry = new PlaneGeometry(this.blockSize, this.blockSize);
        // @ts-ignore
        this.leftGeometry.attributes.uv.array[0] = 0.2;
        // @ts-ignore
        this.leftGeometry.attributes.uv.array[2] = 0.3;
        // @ts-ignore
        this.leftGeometry.attributes.uv.array[4] = 0.2;
        // @ts-ignore
        this.leftGeometry.attributes.uv.array[6] = 0.3;
        
        this.leftGeometry.translate(0, 0, block_half);
        this.leftGeometry.rotateY(-Math.PI / 2);
        
        this.rightGeometry = new PlaneGeometry(this.blockSize, this.blockSize);
        // @ts-ignore
        this.rightGeometry.attributes.uv.array[0] = 0.3;
        // @ts-ignore
        this.rightGeometry.attributes.uv.array[2] = 0.4;
        // @ts-ignore
        this.rightGeometry.attributes.uv.array[4] = 0.3;
        // @ts-ignore
        this.rightGeometry.attributes.uv.array[6] = 0.4;
        
        this.rightGeometry.translate(0, 0, block_half);
        
        this.rightGeometry.rotateY(Math.PI / 2);
        
        this.frontGeometry = new PlaneGeometry(this.blockSize, this.blockSize);
        // @ts-ignore
        this.frontGeometry.attributes.uv.array[0] = 0.4;
        // @ts-ignore
        this.frontGeometry.attributes.uv.array[2] = 0.5;
        // @ts-ignore
        this.frontGeometry.attributes.uv.array[4] = 0.4;
        // @ts-ignore
        this.frontGeometry.attributes.uv.array[6] = 0.5;
        
        this.frontGeometry.translate(0, 0, -block_half);
        
        this.backGeometry = new PlaneGeometry(this.blockSize, this.blockSize);
        // @ts-ignore
        this.backGeometry.attributes.uv.array[0] = 0.5;
        // @ts-ignore
        this.backGeometry.attributes.uv.array[2] = 0.6;
        // @ts-ignore
        this.backGeometry.attributes.uv.array[4] = 0.5;
        // @ts-ignore
        this.backGeometry.attributes.uv.array[6] = 0.6;
        
        this.backGeometry.translate(0, 0, block_half);
      }

}
