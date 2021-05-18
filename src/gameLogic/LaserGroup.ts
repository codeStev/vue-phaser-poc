import Laser from "./Laser";

export default class LaserGroup extends Phaser.Physics.Arcade.Group
{


	constructor(scene: Phaser.Scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: 1,  
			key: 'laser',
			active: false,
			visible: false,
			classType: Laser
		});
		this.maxSize = 2
	}

	fireBullet(x : number, y : number) {
		let laser : Laser;
		if(this.countActive()<=this.maxSize){
			laser = this.create(x,y)!;
		}
		
		if(laser!) {
			laser.move(x, y);
		}
	}
}