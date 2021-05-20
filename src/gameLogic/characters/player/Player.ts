import CharacterKeys from "@/gameLogic/textureKeys/CharacterKeys";
import LaserGroup from "@/gameLogic/object/laser/LaserGroup";
import LaserKeys from "@/gameLogic/textureKeys/LaserKeys";
import Phaser from "phaser";
import Character from "../Character";

//add player method to Phaser interface GameObjectFactory
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Player;
    }
  }
}

export default class Player extends Character {
  body: Phaser.Physics.Arcade.Body;
  damage = 1;
  lifepoints = 3;
  score = 0;
  playerLifes: Phaser.GameObjects.Sprite[] = [];
  scoreText: Phaser.GameObjects.Text;
  laserGroup = new LaserGroup(this.scene);

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }

  preUpdate() {
    return;
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    //player movement
    const speed = 1300;
    const leftDown = cursors.left?.isDown;
    const rightDown = cursors.right?.isDown;
    const spaceDown = cursors.space?.isDown;
    if (leftDown) {
      this.body.setVelocityX(-speed);
    } else if (rightDown) {
      this.body.setVelocityX(speed);
    } else {
      this.body.setVelocityX(0);
    }
    if (spaceDown) {
      this.laserGroup.fireBullet(this.x, this.y - 20, true, this.damage);
    }

	//score text update
	this.setScoreText()
  }

  takeDamage(damage: number) : boolean{
    this.lifepoints -= damage;
    this.loseLifePoint(damage);
    if (this.lifepoints <= 0) {
		//this.scene.scene.pause()
		return true;
    }
    return false;
  }

  //shows lifePoints in the bottom left
  createLifePoints() {
    for (let i = 0; i < this.lifepoints; i++) {
      this.playerLifes.push(
        this.scene.add.sprite(this.scene.cameras.main.centerX * 0.055 * (i + 1), this.scene.cameras.main.centerY * 1.94, CharacterKeys.PLAYERLIFE)
      );
    }
  }

  //makes lost lifePoints opaque
  loseLifePoint(damage: number) {
    for (let i = 0; i < damage; i++) {
      if (this.playerLifes.length != 0) {
        const life = <Phaser.GameObjects.Sprite>this.playerLifes.pop();
        life.setAlpha(0.5);
      }
    }
  }

  //adds score text to scene  
  addScoreText(){
    const posX = this.scene.cameras.main.centerX * 0.045
    const posY = this.scene.cameras.main.centerY * 1.86
    this.scoreText = this.scene.add.text(posX, posY,'',{font: '30px Courier',color: '#f0e130'})

  }

  //set score text in scene
  setScoreText(){
    this.scoreText.setText(this.score.toString());
} 

  //add score to player
  addScore(points : number){
	this.score += points
  }

  //subtracts points from score
  loseScore(points : number){
	this.score -= points
  }
}

//register added method player on GameObjectFactory implementation
Phaser.GameObjects.GameObjectFactory.register("player", function(
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame?: string | number
) {
  //create player object
  const player = new Player(this.scene, x, y, texture, frame);
  //add player object to the display and update list of the scene
  this.displayList.add(player);
  this.updateList.add(player);
  //enable physics on player (for world bounds)
  this.scene.physics.world.enableBody(
    player,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );
  player.createLifePoints();
  player.addScoreText();
  return player;
});
