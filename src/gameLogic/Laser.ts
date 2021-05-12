export default class Laser extends Phaser.Physics.Arcade.Sprite{
    body :  Phaser.Physics.Arcade.Body 

    constructor(scene : Phaser.Scene, x : number, y : number){
        super(scene, x, y, 'laser')
    }

    fire(x : number, y : number){
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-1000);
    }

    preUpdate(time : number, delta : number){
        super.preUpdate(time, delta);

        if (this.y <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    kill(){
        this.setActive(false)
        this.setVisible(false);
    }
}