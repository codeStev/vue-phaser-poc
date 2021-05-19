import Enemy from "@/gameLogic/characters/enemies/Enemy"
import LaserGroupEnemy from "@/gameLogic/LaserGroupEnemy"
import LaserKeys from "@/gameLogic/LaserKeys"



export default class ShootingEnemy extends Enemy{
    lasers : LaserGroupEnemy
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture,frame)
        this.lasers = new LaserGroupEnemy(scene)
    }   
    //default shooting implementation
    shoot(){
        this.lasers.fireBullet(this.x, this.y +20, false, this.shootingDamage)
    }
    
}