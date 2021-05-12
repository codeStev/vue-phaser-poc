
import Phaser, { Game, Time } from 'phaser'
import Character from './Character'

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


export default class Brute extends Character{
	body :  Phaser.Physics.Arcade.Body 
	lifePoints = 1

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)
	

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

	kill(){
		this.destroy();
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