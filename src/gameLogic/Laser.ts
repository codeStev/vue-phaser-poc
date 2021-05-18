import { v4 as uuidv4 } from 'uuid';
export default class Laser extends Phaser.Physics.Arcade.Sprite{
    body :  Phaser.Physics.Arcade.Body 
    damage : number

    constructor(scene : Phaser.Scene, x : number, y : number, damage : number,key : string){
        super(scene, x, y, key)
        this.setName(uuidv4())
        this.damage = damage
    }

    move(x : number, y : number,up : boolean){
        this.x =x
        this.y = y
        this.setActive(true);
        this.setVisible(true);
        console.log(this.scene.physics.world.bounds.bottom)
        up ? this.setVelocityY(-1000) : this.setVelocityY(1000)
    }

    preUpdate(time : number, delta : number){
        super.preUpdate(time, delta);
        if (this.y <= 0 || this.y >= this.scene.physics.world.bounds.bottom) {
            this.kill()
        }
    }

    kill(){
        this.destroy();
    }
}