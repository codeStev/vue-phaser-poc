import CharacterKeys from "@/gameLogic/textureKeys/CharacterKeys";
import { GameObjects, Scene } from "phaser";
import Enemy from "./Enemy";

export default abstract class Gang_A extends Phaser.Physics.Arcade.Group {
  bruteSpriteKey = CharacterKeys.BRUTE;
  gunnerSpriteKey = CharacterKeys.GUNNER;

  constructor(scene: Scene) {
    super(scene.physics.world, scene);
  }

  init(): Enemy[] {
    const children = this.prepareChildren();
    this.setBottomKillListeners();
    return children;
  }

  abstract reset(): void;
  abstract prepareChildren(): Enemy[];
  setBottomKillListeners() {
    this.children.entries.forEach(this.killCallback);
  }

  //callback to kill any enemy touching the lower bound
  killCallback(gameObject: GameObjects.GameObject) {
    (<Enemy>gameObject).body.world.on("worldbounds", function(
      body: Phaser.Physics.Arcade.Body,
      blockedUp: boolean,
      blockedDown: boolean,
      blockedLeft: boolean,
      blockedRight: boolean
    ) {
      if (blockedDown) {
        (<Enemy>body.gameObject).kill();
      }
    });
  }
}
