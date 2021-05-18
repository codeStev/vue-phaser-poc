import Laser from "./Laser";

export default class LaserGroup extends Phaser.Physics.Arcade.Group
{


	constructor(scene: Phaser.Scene, key : string) {
		super(scene.physics.world, scene);
		this.defaultKey = key
		this.classType=Laser
		this.maxSize = 1
	}

	fireBullet(x : number, y : number,up: boolean, damage : number) {
		let laser : Laser;
		if(this.countActive()<=this.maxSize){
			laser = this.create(x,y)!;
		}
		
		if(laser!) {
			laser.move(x, y, up);
		}
	}
}