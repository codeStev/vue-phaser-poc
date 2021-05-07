import Phaser from 'phaser'
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
Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	const player = new Player(this.scene, x, y, texture, frame)
    
	this.displayList.add(player)
	this.updateList.add(player)

	this.scene.physics.world.enableBody(player, Phaser.Physics.Arcade.DYNAMIC_BODY)

	//player.body.setSize(player.width * 0.5, player.height * 0.8)

	return player
})