import Enemy from "@/gameLogic/characters/enemies/Enemy";
import LaserGroupEnemy from "@/gameLogic/object/laser/LaserGroupEnemy";
import LaserKeys from "@/gameLogic/textureKeys/LaserKeys";
import { GameObjects } from "phaser";

export default class ShootingEnemy extends Enemy {
  lasers: LaserGroupEnemy;
  timerDelay: number;
  shootingTimerEvent: Phaser.Time.TimerEvent;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.lasers = new LaserGroupEnemy(scene);
    this.timerDelay = this.calcTimerDelay();
  }
  //add the specific timerevent for the enemy to the scene
  addedToScene() {
    this.shootingTimerEvent = this.scene.time.addEvent({
      delay: this.timerDelay,
      callback: this.shoot,
      callbackScope: this,
      loop: true,
    });
  }
  //recalculate a new delay
  preUpdate() {
    this.timerDelay = this.calcTimerDelay();
  }

  //default shooting implementation
  shoot() {
    this.lasers.fireBullet(this.x, this.y + 20, false, this.shootingDamage);
    this.shootingTimerEvent.remove(true);
    this.shootingTimerEvent = this.scene.time.addEvent({
      delay: this.timerDelay,
      callback: this.shoot,
      callbackScope: this,
      loop: true,
    });
  }
  //calculate shooting delay
  calcTimerDelay() {
    return 8000 * Math.random();
  }
}
