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
    densidadeFlorestal = 0.1;
    biomaSize = 20;
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
    noise : any;

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
        this.noise = noise;

        const resolutionNoise = 0.01 
        
        let xOff = this.posX * this.chunkSize * resolutionNoise ;
        let xTreeSpace = 0;
        for ( let x = this.posX*this.chunkSize; x < (1+this.posX)*this.chunkSize ; x ++ ) {
            let zOff = this.posZ * this.chunkSize * resolutionNoise;
            this.blocks[x]= [];            
            let zTreeSpace = 0;
            for ( let z = this.posZ*this.chunkSize; z < (1+this.posZ)*this.chunkSize ; z ++ ) {
                let yOff = 0 ;
                this.blocks[x][z]= [];
                let foundWather = false;
                let treeNoise = this.noise.noise2D(xOff * 100 , zOff * 100);

                

                for ( let y = 0; y < this.chunkHeigth; y ++ ) {
                    let block = new Block();
                    block.x =x;
                    block.y=y;
                    block.z=z;
                    const value3d = this.noise.noise3D(xOff, yOff, zOff);
                    const value2d = this.noise.noise2D(xOff, zOff);
                    const biomaGen = this.noise.noise2D((xOff + zOff*Math.PI/4) /this.biomaSize,yOff/this.biomaSize/2);
                    const bioma = this.getBioma(biomaGen);
                    

                    block.code = bioma.primary;
                    block.bioma = bioma;
                    if(value3d <= 0.3){
                       block.code = bioma.primary;
                    }
                    let alturaMaxima = (this.chunkHeigth - this.seaLevel) /2;
                        let pos = y - this.seaLevel;
                        let pico =  Math.floor(value2d*alturaMaxima);

                    if (y >= this.seaLevel){
                        
                        block.code = 0;              
                        
                        if( pos < pico){
                            block.code = bioma.primary;
                         }
                         else{
                            if( pos == pico ){
                                if(value3d <= 0.5){
                                    // console.log('log',Math.floor(Math.abs(treeNoise)*15));
                                    const separador = Math.max(5,Math.floor(Math.abs(treeNoise)*(10)));
                                    if(xTreeSpace > separador && zTreeSpace > separador){
    
                                        block.treeStage = 10;
                                        xTreeSpace = 0;
                                        zTreeSpace = 0;
                                    }
                                    
                                }
                                
                            }
                         }
                         
                    }
                    
                   

                    if (y == 0){
                        block.code = 10000;                        
                    }
                    if (foundWather) {
                        block.code = 0;
                        
                    }

                    if(block.code == 2){
                        foundWather = true;
                    }
                    
                    this.blocks[x][z][y]= block;
                    
                    yOff += resolutionNoise;    
                }
                zOff += resolutionNoise;  
                zTreeSpace++; 
            }
            xOff += resolutionNoise;    
            xTreeSpace++;
        }
        

     this.generateTrees(factory);
    }

    generateTrees(factory:Factory){
        for ( let x = this.posX*this.chunkSize; x < (1+this.posX)*this.chunkSize ; x ++ ) {
            for ( let z = this.posZ*this.chunkSize; z < (1+this.posZ)*this.chunkSize ; z ++ ) {
                let stop = false;
                for ( let y = this.chunkHeigth-1 ; y >= 0 ; y --) {
                    



                    let block = this.blocks[x][z][y];
                    if (block.treeStage > 0) {

                        let altura = Math.max(13, Math.floor(this.noise.noise2D(Math.abs(x+y),Math.abs(z+y)) * 20 ));
                        // console.log("arvore:", altura) ;  
                        for (let index = 0; index < altura-1; index++) {
                            let caule = this.blocks[x][z][y+index];
                            caule.code = 11;
                            // console.log(caule);
                            
                            
                        }     
                        for (let iy = 0; iy <= 4; iy++) {
                            const redutor = Math.floor(iy/2);
                        for (let ix = -3+redutor; ix <= 3-redutor; ix++) {

                            for (let iz = -3+redutor; iz <= 3-redutor; iz++) {
                        
                                
                                    try {
                                        let leafBlock = this.blocks[x+ix][z+iz][y+altura-5+iy];
                                        if (leafBlock != null && !(ix == 0 && iz == 0)) {
                                            const copa = this.noise.noise2D(Math.abs(x+altura),Math.abs(z+altura));
                                         
                                            if (copa <= 0.7 ) {
                                                leafBlock.code = 11.2;    
                                            }
                                            
                                        }
                                    } catch (error) {
                                        
                                    }
                                    
                            
                                }
                            }
                            
                        }
                        
                        
                        
                    }
                   


                    
                }
            }
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
                    block.render = true;

                    // if (block.code > 0 && !stop) {
                    //     block.render = true;
                    //     stop = true;
                        
                    // }
                     const topBlock = this.getBlockAt(0,x,z,y);
                    //  if (block.code == 11) {
                    //       console.log("actual",block);
                          
                    //  }
                    //   if (x <= 2 && x > 0 && z == 0) {
                        // console.log("actual",block);
                        //   console.log("top",topBlock);
                         if (topBlock != null && topBlock.code > 0 && topBlock.code != 11 && topBlock.code != 11.2) {
                           
                            
                            if (block.code > 0) {
                                // console.log("will render");
                                block.render = false;
                            }
                           
                        }
                        // block.render = true;
                    //   }
                      

                    //  if (topBlock != null && topBlock.code <= 0) {
                    //     console.log("will render");
                    //     topBlock.render = false;
                    //     block.render = true;
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
                    return this.blocks[x+nTop.x][z+nTop.z][y+nTop.y]; 
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
  
   
     getBioma(n:number){
        if(n < 0.02){
            return {name:"floresta",primary:6};
        } else if(n < 0.5){
            return {name:"planice",primary:1};
        }
        else if(n < 0.8){
            return {name:"deserto",primary:5};
        }
        return {name:"floresta",primary:6};
    }

    
}
