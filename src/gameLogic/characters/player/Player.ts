import CharacterKeys from '@/gameLogic/CharacterKeys'
import LaserGroup from '@/gameLogic/LaserGroup'
import LaserKeys from '@/gameLogic/LaserKeys'
import Phaser from 'phaser'
import Character from '../Character'
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

export default class Player extends Character{
	body :  Phaser.Physics.Arcade.Body 
	damage = 1
	lifepoints = 3
	playerLifes : Phaser.GameObjects.Sprite[] = []
	laserGroup = new LaserGroup(this.scene)

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
		const spaceDown = cursors.space?.isDown

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
		if (spaceDown)
		{
			this.laserGroup.fireBullet(this.x, this.y -20, true,this.damage)
		}
	}

	takeDamage(damage :number){
        this.lifepoints -= damage
		this.loseLifePoint(damage)
        if(this.lifepoints <= 0){
            this.kill();
			
        }
        return
    }

	//creates lifePoint images
	createLifePoints(){
		for (let i = 0; i < this.lifepoints; i++) {
			this.playerLifes.push(this.scene.add.sprite((50 * (i + 1)), 1150, CharacterKeys.PLAYERLIFE))
		}
	}

	//destroys lifePoint image
	loseLifePoint(damage : number){
		for(let i = 0; i<damage;i++){
			if(this.playerLifes.length!=0){
				const life = <Phaser.GameObjects.Sprite> this.playerLifes.pop()
				life.setAlpha(0.5)
			}
		}
	}
}
//register added method player on GameObjectFactory implementation
Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	//create player object
	const player = new Player(this.scene, x, y, texture, frame)
	//add player object to the display and update list of the scene
	this.displayList.add(player)
	this.updateList.add(player)
	//enable physics on player (for world bounds)
	this.scene.physics.world.enableBody(player, Phaser.Physics.Arcade.DYNAMIC_BODY)
	player.createLifePoints();
	return player
})