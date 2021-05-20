import { GameObjects, Scene } from "phaser";
import ShipAsset from "../gameAssets/player/playerShip3_red.png";
import BruteAsset from "../gameAssets/enemies/enemyGreen4.png";
import GunnerAsset from "../gameAssets/enemies/enemyBlue1.png";
import RedLaserAsset from "../gameAssets/effects/particle-effects/laserRed01.png";
import BlueLaserAsset from "../gameAssets/effects/particle-effects/laserBlue02.png";
import ProtectAsset1 from "../gameAssets/meteors/meteorBrown_big1.png";
import ProtectAsset2 from "../gameAssets/meteors/meteorBrown_big2.png";
import ProtectAsset3 from "../gameAssets/meteors/meteorBrown_big3.png";
import ProtectAsset4 from "../gameAssets/meteors/meteorBrown_big4.png";
import Player from "@/gameLogic/characters/player/Player";
import "@/gameLogic/characters/player/Player";
import "@/gameLogic/characters/enemies/Brute";
import Laser from "@/gameLogic/Laser";
import Protection from "@/gameLogic/protection/Protection";
import "@/gameLogic/protection/Protection";
import Enemy from "@/gameLogic/characters/enemies/Enemy";
import Character from "@/gameLogic/characters/Character";
import "@/gameLogic/characters/enemies/Gunner";
import "@/gameLogic/characters/Character";
import ShootingEnemy from "@/gameLogic/characters/enemies/ShootingEnemy";
import LaserKeys from "@/gameLogic/LaserKeys";
import LaserGroup from "@/gameLogic/LaserGroup";
import LaserGroupEnemy from "@/gameLogic/LaserGroupEnemy";
import CharacterKeys from "@/gameLogic/CharacterKeys";
import TrojanHorse from "@/gameLogic/characters/enemies/TrojanHorse";
import Gunner from "@/gameLogic/characters/enemies/Gunner";
import Gang_A from "@/gameLogic/characters/enemies/Gang_A";
import getRandomGangType from "@/gameLogic/utils/GangRandomizer";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: true,
  visible: true,
  key: "Game",
};

export default class GameScene extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Player;
  private enemies!: Enemy[];
  private protections!: Protection[];
  private gang!: Gang_A;

  constructor() {
    super(sceneConfig);
    this.enemies = [];
    this.protections = [];
  }

  moveDown(body: Phaser.Physics.Arcade.Body, blockedLeft: boolean) {
    setTimeout(function() {
      body.setVelocityY(0);
      blockedLeft ? body.setVelocityX(500) : body.setVelocityX(-500);
    }, 100);
  }

  public preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.load.image(CharacterKeys.PLAYER, ShipAsset);
    this.load.image(CharacterKeys.BRUTE, BruteAsset);
    this.load.image(CharacterKeys.GUNNER, GunnerAsset);
    this.load.image(LaserKeys.RED, RedLaserAsset);
    this.load.image(LaserKeys.BLUE, BlueLaserAsset);
    this.load.image("protection1", ProtectAsset1);
    this.load.image("protection2", ProtectAsset2);
    this.load.image("protection3", ProtectAsset3);
    this.load.image("protection4", ProtectAsset4);
  }

  // create Player, Protection and Enemies
  public create() {
    this.gang = getRandomGangType(this);
    this.enemies = this.gang.init();
    const enemyLaserGroup: LaserGroupEnemy = new LaserGroupEnemy(this);
    enemyLaserGroup.maxSize = -1;
    const playerLaserGroup: LaserGroup = new LaserGroup(this);
    // set background color of scene
    this.cameras.main.setBackgroundColor("#000000");
    // variables for player startposition
    const startPosX: number = this.cameras.main.centerX;
    const startPosY: number = this.cameras.main.centerY * 1.8;

    // add player to scene + initialize player laser group
    this.player = this.add.player(startPosX, startPosY, CharacterKeys.PLAYER);
    this.player.laserGroup = playerLaserGroup;
    this.physics.world.enable([this.player]);
    this.player.body.setCollideWorldBounds(true);

    // List of Protection assets
    const protectionAssets = [
      "protection1",
      "protection2",
      "protection3",
      "protection4",
    ];

    // calculate distance between Protection
    const leftBound = this.physics.world.bounds.left;
    const rightBound = this.physics.world.bounds.right;
    const fullHorizontalLength = rightBound - leftBound;
    const distanceBetweenProtections = fullHorizontalLength / 5;

    // randomize AssetArray and add Protections to scene
    protectionAssets.sort(() => Math.random() - 0.5);
    for (let i = 0; i <= 3; i++) {
      this.protections.push(
        this.add.protection(
          leftBound + distanceBetweenProtections * (i + 1),
          startPosY - 150,
          protectionAssets[i]
        )
      );
    }

    this.enemies.forEach((enemy) => {
      if ((<ShootingEnemy>enemy).lasers) {
        (<ShootingEnemy>enemy).lasers = enemyLaserGroup;
      }
    });
  }

  public update() {
    if (this.player) {
      this.player.update(this.cursors);
    }

    // enemy hit by player
    this.enemies.forEach((element) => {
      if (this.player.laserGroup) {
        this.physics.overlap(
          this.player.laserGroup,
          element,
          this._playerLaserShootsAlien,
          undefined,
          this
        );
      }

      if (this.gang.getLength() == 0) {
        this.gang.reset();
        this.gang = getRandomGangType(this);
        this.enemies = this.gang.init();
      }

      // player hit by enemy shot
      if ((<ShootingEnemy>element).lasers) {
        this.physics.overlap(
          (<ShootingEnemy>element).lasers,
          this.player,
          this._enemyLaserShootsPlayer,
          undefined,
          this
        );
      }

      // player collides with enemy
      this.physics.overlap(
        element,
        this.player,
        this._enemyCollidesWithPlayer,
        undefined,
        this
      );

      // enemy shoots protection
      if ((<ShootingEnemy>element).lasers) {
        this.protections.forEach((protection) => {
          this.physics.overlap(
            (<ShootingEnemy>element).lasers,
            protection,
            this._enemyLaserShootsProtection,
            undefined,
            this
          );
        });
      }
    });

    // player shoots protection
    this.protections.forEach((element) => {
      if (this.player.laserGroup) {
        this.physics.overlap(
          this.player.laserGroup,
          element,
          this._playerLaserShootsProtection,
          undefined,
          this
        );
      }
    });
  }

  // player Laser overlaps Alien
  private _playerLaserShootsAlien(
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const enemyOriginal: Enemy = this.enemies.find(
      (element) => element.name == enemy.name
    )!;
    enemyOriginal.takeDamage(this.player.damage);

    if ((<ShootingEnemy>enemyOriginal).shootingTimerEvent!) {
      (<ShootingEnemy>enemyOriginal).shootingTimerEvent.remove(false);
    }
    if (enemyOriginal.lifepoints <= 0) {
      const index = this.enemies.indexOf(enemyOriginal);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }

    (<Laser>laser).kill();
    return true;
  }

  //player Laser overlaps Protection
  private _playerLaserShootsProtection(
    protection: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const protectionOriginal: Protection = this.protections.find(
      (element) => element.name == protection.name
    )!;
    protectionOriginal.takeDamage(1);
    (<Laser>laser).kill();
    return true;
  }

  // enemy Laser overlaps Player
  private _enemyLaserShootsPlayer(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    this.player.takeDamage(1);
    (<Laser>laser).kill();
    return true;
  }

  // enemy Laser overlaps Protection
  private _enemyLaserShootsProtection(
    protection: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const protectionOriginal: Protection = this.protections.find(
      (element) => element.name == protection.name
    )!;
    protectionOriginal.takeDamage(1);
    (<Laser>laser).kill();
    return true;
  }

  // enemy overlaps player
  private _enemyCollidesWithPlayer(
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    this.player.takeDamage(1);
    const enemyOriginal: Enemy = this.enemies.find(
      (element) => element.name == enemy.name
    )!;
    if (enemyOriginal.lifepoints <= 0) {
      const index = this.enemies.indexOf(enemyOriginal);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }
    enemyOriginal.takeDamage(this.player.damage);
  }
}
