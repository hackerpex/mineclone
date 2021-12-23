import { BufferGeometry, Mesh, PlaneGeometry } from "three";
import { BlockType } from "./BlockType";


class Block {
    id:any;
    code:number;
    mesh?:Mesh;

    
    constructor(){
        this.id ='';
        this.code = 0;
    }
    setMesh(mesh:Mesh){
        this.mesh = mesh;
    }
    getMesh(){
        return this.mesh;
    }

   
}
export {
    Block
};