import Phaser from "phaser";
import Character from "../characters/Character";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      protection(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Protection;
    }
  }
}

export default class Protection extends Character {
  body: Phaser.Physics.Arcade.Body;
  lifepoints = 1;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }

  init() {
    return;
  }

  preUpdate() {
    return;
  }

  update() {
    return;
  }

}

//register added method protection on GameObjectFactory implementation
Phaser.GameObjects.GameObjectFactory.register("protection", function(
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame?: string | number
) {
  //create protection object
  const protection = new Protection(this.scene, x, y, texture, frame);
  this.displayList.add(protection);
  this.updateList.add(protection);
  //enable physics on protection (for world bounds)
  this.scene.physics.world.enableBody(
    protection,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );
  return protection;
});
