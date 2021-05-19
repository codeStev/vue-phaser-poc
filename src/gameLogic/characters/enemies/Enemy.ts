import Character from "../Character";
import Gang_A from "../enemies/Gang_A"

export default class Enemy extends Character{
    gang : Gang_A;
    shootingDamage  = 0
    hittingDamage  = 0
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture,frame)
    }


}