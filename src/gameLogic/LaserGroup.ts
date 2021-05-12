import Laser from "./Laser";

export default class LaserGroup extends Phaser.Physics.Arcade.Group
{

	laser : Laser
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
		this.laser = this.getFirstDead(false);

		if(this.laser) {
			this.laser.fire(x, y);
		}
	}
}