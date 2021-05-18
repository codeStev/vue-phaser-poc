import Character from "../Character";

export default class Enemy extends Character{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture,frame)
    }


}