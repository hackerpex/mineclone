import { BufferGeometry, PlaneGeometry } from "three";
import { BlockType } from "./BlockType";


class Block {
    type?:BlockType;
    topGeometry?:BufferGeometry;
    downGeometry?:BufferGeometry;
    leftGeometry?:BufferGeometry;
    rightGeometry?:BufferGeometry;
    frontGeometry?:BufferGeometry;
    backGeometry?:BufferGeometry;
    
    constructor(){
        this.type = new BlockType();
        
    }

   
}
export {
    Block
};