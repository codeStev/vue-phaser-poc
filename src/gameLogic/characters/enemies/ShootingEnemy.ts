import Enemy from "@/gameLogic/characters/enemies/Enemy"
import LaserGroup from "@/gameLogic/LaserGroup"
import LaserKeys from "@/gameLogic/LaserKeys"



export default class ShootingEnemy extends Enemy{
    lasers : LaserGroup
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture,frame)
        this.lasers = new LaserGroup(scene,LaserKeys.RED)
    }   
    //default shooting implementation
    shoot(){
        this.lasers.fireBullet(this.x, this.y +20, false, this.shootingDamage)
    }
    
    hurensohnTimeEvent(){
      this.scene.time.addEvent({ delay: 1000, callback: this.shoot, callbackScope: this, loop: true })
    }
}