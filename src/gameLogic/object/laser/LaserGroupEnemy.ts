import LaserEnemy from './LaserEnemy';
import LaserKeys from '@/gameLogic/textureKeys/LaserKeys';

export default class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.defaultKey = LaserKeys.BLUE;
    this.classType = LaserEnemy;
    this.maxSize = 1;
  }

  fireBullet(x: number, y: number, up: boolean, damage: number) {
    let laser: LaserEnemy;
    if (this.countActive() <= this.maxSize || this.maxSize == -1) {
      laser = this.create(x, y)!;
    }

    if (laser!) {
      laser.move(x, y, up);
    }
  }
}
