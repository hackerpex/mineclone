import { Color, DoubleSide, InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Object3D, PlaneGeometry, Scene, Texture, Vector3 } from "three";
import { Block } from "./Block";
import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";
import { BlockType } from "./BlockType";
import { Factory } from "./Factory";

const {SimplexNoise} = require('simplex-noise');

// const {
//     Worker, isMainThread, parentPort, workerData
//   } = require('worker_threads');






// neighbors
  const nTop = {x:0,z:0,y:1};
  const nDown = {x:0,z:0,y:-1};
  const nLeft = {x:-1,z:0,y:0};
  const nRight = {x:1,z:0,y:0};
  const nFront = {x:0,z:1,y:0};
  const nBack = {x:0,z:-1,y:0};





export class Chunk {
    posX:number =0;
    posZ:number =0;
    chunkSize:number = 10;
    blockSize:number = 1;
    chunkHeigth:number = 0;
    blocks = [] as  any;
    meshList = [];
    // mesh:Mesh;
    
    seaLevel =10;
    textures = [] ;
    scene?:Scene;

     matrix = new Matrix4();


    constructor(x:number,z:number,chunkSize:number,blockSize:number,chunkHeight:number){
        this.posX =x;
        this.posZ =z;
        this.chunkSize = chunkSize;
        this.blockSize = blockSize;
        this.chunkHeigth = chunkHeight;
        // this.createGeometries();
    }

    clean(){
        
        // this.mesh.removeFromParent();
        this.meshList.forEach(element => {            
             element.mesh.removeFromParent();
        });
        
        
    }

    generateChunk(factory:Factory, scene:Scene, noise:any, textures:[]){
        this.scene =scene;

        const resolutionNoise = 0.01 
        
        let xOff = this.posX * this.chunkSize * resolutionNoise ;
        for ( let x = this.posX*this.chunkSize; x < (1+this.posX)*this.chunkSize ; x ++ ) {
            let zOff = this.posZ * this.chunkSize * resolutionNoise;
            this.blocks[x]= [];
            for ( let z = this.posZ*this.chunkSize; z < (1+this.posZ)*this.chunkSize ; z ++ ) {
                let yOff = 0 ;
                this.blocks[x][z]= [];
                for ( let y = 0; y < this.chunkHeigth; y ++ ) {
                    let block = new Block();
                    const value3d = noise.noise3D(xOff, yOff, zOff);
                    const value2d = noise.noise2D(xOff*1, zOff*1);
                   
                    block.code = 1;
                    if(value3d <= 0.3){
                       block.code = 1;
                    }
                    if (y >= this.seaLevel){
                        block.code = 0;                        
                         if( (y - this.seaLevel) < Math.floor(value2d*10) ){
                            block.code = 1;
                        }
                    }
                    if (y == 0){
                        block.code = 10000;                        
                    }
                    
                    this.blocks[x][z][y]= block;
                    
                    yOff += resolutionNoise;    
                }
                zOff += resolutionNoise;   
            }
            xOff += resolutionNoise;    
        }
        

     this.checkVisible(factory);
    }


    checkVisible(factory:Factory){
        

      
        
      
        for ( let x = this.posX*this.chunkSize; x < (1+this.posX)*this.chunkSize ; x ++ ) {
            for ( let z = this.posZ*this.chunkSize; z < (1+this.posZ)*this.chunkSize ; z ++ ) {
                let stop = false;
                for ( let y = this.chunkHeigth-1 ; y >= 0 ; y --) {
                    

                    // const topBlock = this.getBlockAt(0,x,z,y);
                    //  console.log('bloco x:',x,'z:',z,'y:',y);
                    // console.log(topBlock);

                    let block = this.blocks[x][z][y];
                    block.render = false;
                    if (block.code > 0 && !stop) {
                        block.render = true;
                        stop = true;
                        
                    }
                    // const topBlock = this.getBlockAt(0,x,z,y);

                    // if (topBlock != null && topBlock.code > 0) {
                    //     block.render = false;
                    // }


                    
                }
            }
        }
        

     this.placeBlocks(factory);
    }

    getBlockAt(position:number, x:number,z:number,y:number){
        // 0:top
        // 1:down
        // 2:left 
        // 3:right 
        // 4:front 
        // 5:back 
        switch (position) {
            case 0:
                try {
                    return this.blocks[x+nTop.x][x+nTop.z][y+nTop.y]; 
                } catch (error) {
                    return null;
                }
                
                break;
        
            default:
                break;
        }

    }

    placeBlocks(factory:Factory){

        this.matrix = new Matrix4();
          for ( let x = this.posX*this.chunkSize; x < (1+this.posX)*this.chunkSize; x ++ ) {
            
            for ( let z = this.posZ*this.chunkSize; z < (1+this.posZ)*this.chunkSize; z ++ ) {
            
                for ( let y = 0; y < this.chunkHeigth; y ++ ) {
                    
                    
                    // this.matrix.identity();
                    
                    this.matrix.makeTranslation(
                        x * this.blockSize,
                        y * this.blockSize,
                        z * this.blockSize 
                    );

                    let block = this.blocks[x][z][y]; 
                                     
                     if(block.code > 0 && block.render){
                        let meshObj = this.meshList[block.code];
                        if (meshObj == null) {
                            meshObj = factory.loadMeshsForCode(block.code);
                            this.meshList[block.code] = meshObj;
                        }
                        
                        

                       
                        let pos = meshObj.usedIndexStack.shift();
                        //   console.log(pos,"toX:",x,"andZ:",z,"andY:",y);
                        this.meshList[block.code].usedIndexStack.push(pos);
                         
                       
                        this.meshList[block.code].mesh.setMatrixAt(pos, this.matrix); 
                          // this.meshList[block.code].mesh.setColorAt(pos,new Color(0xff2222));
                        // factory.wareHouse[block.code] = ref;                    
                        
                     }
                     else{
                        //  console.log(block);
                     }
                   
                    
                    

                }
            }
        }


      
    }
  
   

}
