import { Scene } from 'phaser';
import Brute from './Brute';
import Enemy from './Enemy';
import Gang_A from './Gang_A';
import Gunner from './Gunner';

export default class Kamikaze extends Gang_A {
  prepareChildren(): Enemy[] {
    const enemies: Enemy[] = [];

    const brutes: Enemy[] = <Enemy[]>this.createMultiple({
      classType: Brute,
      frameQuantity: 10,
      key: [this.bruteSpriteKey],
      visible: true,
      active: true,
    });

    this.runChildUpdate = true;
    Phaser.Actions.SetXY(brutes, 50, 300, 150);
    //create sprites
    enemies.push(...brutes);
    enemies.forEach((enemy) => {
      this.scene.physics.world.enableBody(
        enemy,
        Phaser.Physics.Arcade.DYNAMIC_BODY
      );
      enemy.body.setCollideWorldBounds(true);
      enemy.body.onWorldBounds = true;
      enemy.gang = this;
    });
    this.setVelocityY(350);
    return enemies;
  }

  reset(): void {
    return;
  }
}
