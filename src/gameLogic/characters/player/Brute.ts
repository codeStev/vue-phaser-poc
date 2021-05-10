
import Phaser from 'phaser'

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

export default class Brute extends Phaser.GameObjects.Image{
	body :  Phaser.Physics.Arcade.Body 

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)
	

	}
	
	init(){
		return
	}
    preUpdate(){
		//this.play
		//console.log(this.body.x)
        return
	}
	revertMotion(){
		console.log("blubb")
		this.body.setVelocityX(-150)
	}
	
    update(){
		console.log("collideWorldBounds : "+this.body.collideWorldBounds)
		console.log("onWorldBounds : "+this.body.onWorldBounds)
		

		
			
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
	brute.body.setVelocityX(150)
	return brute
})