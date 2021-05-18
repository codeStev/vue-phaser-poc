
import { v4 as uuidv4 } from 'uuid';
export default class Character extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture,frame)
        this.setName(uuidv4())
    }
    body :  Phaser.Physics.Arcade.Body;
    lifepoints : number;

    public takeDamage(damage :number){
        this.lifepoints -= damage
        if(this.lifepoints <= 0){
            this.kill();
        }
        return
    }

    kill(){
        this.destroy();
    }

    
}