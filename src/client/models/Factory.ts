import { DoubleSide, InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, NearestFilter, Object3D, PlaneGeometry, Scene, Texture, TextureLoader, Vector3 } from "three";
import { Block } from "./Block";
import { mergeBufferGeometries } from "../utils/BufferGeometryUtils.js";



export class Factory {
    scene : Scene;
    chunkSize:number = 0;
    blockSize:number = 0;
    heigth:number = 0;
    cacheSize:number =250;
    blockTypes = [0,1,2,5,6,11,11.1,11.2,10000];
    
    wareHouse = [];
    
    
    textures = [] ;
    
    matrix = new Matrix4();

 topGeometry:PlaneGeometry;
 downGeometry:PlaneGeometry;
 leftGeometry:PlaneGeometry;
 rightGeometry:PlaneGeometry;
 frontGeometry:PlaneGeometry;
 backGeometry:PlaneGeometry;

    constructor(scene:Scene,chunkSize:number,blockSize:number,height:number){
        this.chunkSize = chunkSize;
        this.blockSize = blockSize;
        this.heigth =height;
        this.scene =scene;
        this.createGeometries();
        this.loadTextures();
        // this.loadMeshs();
    }

    getWareHouse(){
        return this.wareHouse;
    }

 

    loadMeshsForCode(code:number){
        
            const texture = this.textures[code];
            let geometries = [];
            geometries.push(this.topGeometry.clone().applyMatrix4( this.matrix ));
            geometries.push(this.downGeometry.clone().applyMatrix4( this.matrix ));
            geometries.push(this.leftGeometry.clone().applyMatrix4( this.matrix ));
            geometries.push(this.rightGeometry.clone().applyMatrix4( this.matrix ));
            geometries.push(this.frontGeometry.clone().applyMatrix4( this.matrix ));
            geometries.push(this.backGeometry.clone().applyMatrix4( this.matrix ));

            let geometry = mergeBufferGeometries( geometries );
            geometry.computeBoundingSphere();          
            let mesh;
            if(code == 2){//wather
                 geometries = [];
                geometries.push(this.topGeometry.clone().applyMatrix4( this.matrix ));
                
                 geometry = mergeBufferGeometries( geometries );
                geometry.computeBoundingSphere(); 
                mesh = new InstancedMesh(geometry,new MeshLambertMaterial( { map:texture,  transparent: true, opacity: 0.5 } ),this.cacheSize);
            }
            else
            if(code == 11.2){//wather
                geometries = [];
                geometries.push(this.topGeometry.clone().applyMatrix4( this.matrix ));
                geometries.push(this.downGeometry.clone().applyMatrix4( this.matrix ));
                geometries.push(this.leftGeometry.clone().applyMatrix4( this.matrix ));
                geometries.push(this.rightGeometry.clone().applyMatrix4( this.matrix ));
                geometries.push(this.frontGeometry.clone().applyMatrix4( this.matrix ));
                geometries.push(this.backGeometry.clone().applyMatrix4( this.matrix ));
               
                geometry = mergeBufferGeometries( geometries );
               geometry.computeBoundingSphere(); 
               mesh = new InstancedMesh(geometry,new MeshLambertMaterial( { map:texture,  transparent: true, opacity: 1 } ),this.cacheSize);
           }
           else
           {
                mesh = new InstancedMesh(geometry,new MeshLambertMaterial( { map:texture} ),this.cacheSize);
            }
             
            

            this.scene!.add( mesh );
            let xusedIndexStack = [];
            for (let index = 0; index < this.cacheSize-1; index++) {
                xusedIndexStack.push(index);
                
            }
            return {size:this.cacheSize,usedIndexStack:xusedIndexStack,mesh:mesh};
            

       
    }

    loadTextures() {
        const texture_path = "../assets/textures/";

        this.blockTypes.forEach(element => {
            this.textures[element] = new TextureLoader().load(
                texture_path + element+".png"
              );
              this.textures[element].magFilter = NearestFilter;
        });

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
        
        this.frontGeometry.translate(0, 0, block_half);
        this.frontGeometry.rotateY(-Math.PI );
        
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
