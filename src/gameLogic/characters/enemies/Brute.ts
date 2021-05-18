
import Phaser, { Game, Time } from 'phaser'
import Enemy from './Enemy'

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			brute(x: number, y: number, texture: string, frame?: string | number): Brute
		}
	}
}


export default class Brute extends Enemy{

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)
		this.lifepoints = 3
	

	}

	init(){
		return
	}
    preUpdate(){
        return
	}

    update(){
		return
	}
	

}

Phaser.GameObjects.GameObjectFactory.register('brute', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	const brute = new Brute(this.scene, x, y, texture, frame)
	this.displayList.add(brute)
	this.updateList.add(brute)
	this.scene.physics.world.enableBody(brute, Phaser.Physics.Arcade.DYNAMIC_BODY)
	brute.body.setCollideWorldBounds(true)
	brute.body.onWorldBounds = true	
	brute.body.setImmovable(false)
	brute.body.setVelocityX(500)
	return brute
})