import ShootingEnemy from "./ShootingEnemy";

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			gunner(x: number, y: number, texture: string, frame?: string | number): Gunner
		}
	}
}
export default class Gunner extends ShootingEnemy{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture,frame)
        this.lifepoints = 1
		this.hittingDamage = 1
        this.shootingDamage = 1
    }

    

}
Phaser.GameObjects.GameObjectFactory.register('gunner', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	//create player object
	const gunner = new Gunner(this.scene, x, y, texture, frame)
	this.displayList.add(gunner)
	this.updateList.add(gunner)
	//enable physics on player (for world bounds)
	this.scene.physics.world.enableBody(gunner, Phaser.Physics.Arcade.DYNAMIC_BODY)
	return gunner
})