import Phaser from 'phaser'
//add player method to Phaser interface GameObjectFactory
declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			player(x: number, y: number, texture: string, frame?: string | number): Player
		}
	}
}

export default class Player extends Phaser.GameObjects.Image{
    body :  Phaser.Physics.Arcade.Body 
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

	}

    preUpdate(){
        return
    }
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys){
		//player movement
		const speed = 1300
		const leftDown = cursors.left?.isDown
		const rightDown = cursors.right?.isDown
		

		if (leftDown)
		{
			
			this.body.setVelocityX(-speed)
		}
		else if (rightDown)
		{
			
			this.body.setVelocityX(speed)
		}	
		else
		{
			
			this.body.setVelocityX(0)
		}
	}
}
//register added method player on GameObjectFactory implementation
Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	//create player object
	const player = new Player(this.scene, x, y, texture, frame)
	this.displayList.add(player)
	this.updateList.add(player)
	//enable physics on player (for world bounds)
	this.scene.physics.world.enableBody(player, Phaser.Physics.Arcade.DYNAMIC_BODY)
	return player
})