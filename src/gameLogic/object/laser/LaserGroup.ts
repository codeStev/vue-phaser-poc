import Laser from './Laser';
import LaserKeys from '@/gameLogic/textureKeys/LaserKeys';

export default class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.defaultKey = LaserKeys.RED;
    this.classType = Laser;
    this.maxSize = 1;
  }

  fireBullet(x: number, y: number, up: boolean, damage: number) {
    let laser: Laser;
    if (this.countActive() <= this.maxSize) {
      laser = this.create(x, y)!;
    }

    if (laser!) {
      laser.move(x, y, up);
    }
  }
}
