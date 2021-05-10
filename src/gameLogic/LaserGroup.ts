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
	}

	fireBullet(x : number, y : number) {
		const laser = this.getFirstDead(false);

		if(laser) {
			laser.fire(x, y);
		}
	}
}