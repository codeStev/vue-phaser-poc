import { GameObjects, Scene } from "phaser";
import ShipAsset from "../gameAssets/player/playerShip3_red.png";
import BruteAsset from "../gameAssets/enemies/enemyGreen4.png";
import LaserAsset from "../gameAssets/effects/particle-effects/laserRed01.png";
import ProtectAsset1 from "../gameAssets/meteors/meteorBrown_big1.png";
import ProtectAsset2 from "../gameAssets/meteors/meteorBrown_big2.png";
import ProtectAsset3 from "../gameAssets/meteors/meteorBrown_big3.png";
import ProtectAsset4 from "../gameAssets/meteors/meteorBrown_big4.png";
import Player from "@/gameLogic/characters/player/Player";
import "@/gameLogic/characters/player/Player";
import Brute from "@/gameLogic/characters/enemies/Brute";
import "@/gameLogic/characters/enemies/Brute";
import Protection from "@/gameLogic/protection/Protection";
import "@/gameLogic/protection/Protection";
import LaserGroup from "@/gameLogic/LaserGroup";
import Laser from "@/gameLogic/Laser";
import Enemy from "@/gameLogic/characters/enemies/Enemy";
import Character from "@/gameLogic/characters/Character";
import "@/gameLogic/characters/Character";
import { prototype } from "vue/types/umd";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: true,
  visible: true,
  key: "Game",
};

export default class GameScene extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Player;
  private protections!: Protection[];
  private enemies!: Enemy[];

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

  public init() {
    //create basic formation
    const moveDown = this.moveDown;
    let collideCounter = 0;
    this.physics.world.on("worldbounds", function(
      body: Phaser.Physics.Arcade.Body,
      blockedUp: boolean,
      blockedDown: boolean,
      blockedLeft: boolean,
      blockedRight: boolean
    ) {
      if (blockedLeft) {
        body.setVelocityX(500);
        collideCounter++;
      } else if (blockedRight) {
        body.setVelocityX(-500);
      }
      if (collideCounter == 2) {
        body.setVelocityX(0);
        body.setVelocityY(500);
        moveDown(body, blockedLeft);
        collideCounter = 0;
      }
    });
  }

  public preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.load.image("ship", ShipAsset);
    this.load.image("enemy1", BruteAsset);
    this.load.image("laser", LaserAsset);
    this.load.image("protection1", ProtectAsset1);
    this.load.image("protection2", ProtectAsset2);
    this.load.image("protection3", ProtectAsset3);
    this.load.image("protection4", ProtectAsset4);
  }

  // create Player, Protection and Enemies
  public create() {
    // set background color of scene
    this.cameras.main.setBackgroundColor("#000000");

    // variables for player startposition
    const startPosX: number = this.cameras.main.centerX;
    const startPosY: number = this.cameras.main.centerY * 1.8;

    // add player to scene
    this.player = this.add.player(startPosX, startPosY, "ship");
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

    // add enemies to scene
    //this.brute = this.add.brute(startPosX, 300, 'enemy1')
    const enemyCount = 6;
    let x = 0;
    const xOffset = 100;
    for (let i = 0; i < 6; i++) {
      x = x + xOffset;
      this.enemies.push(this.add.brute(x, 300, "enemy1"));
    }
  }

  public update() {
    if (this.player) {
      this.player.update(this.cursors);
    }

    // enemy hit event
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.player.laserGroup) {
        this.physics.overlap(
          this.player.laserGroup,
          this.enemies[i],
          this._laserHitsAlien,
          undefined,
          this
        );
      }
    }

    // protection hit event
    for (let i = 0; i < this.protections.length; i++) {
      if (this.player.laserGroup) {
        this.physics.overlap(
          this.player.laserGroup,
          this.protections[i],
          this._playerLaserHitsProtection,
          undefined,
          this
        );
      }
    }
  }

  // player Laser overlaps Alien
  private _laserHitsAlien(
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const enemyOriginal: Enemy = this.enemies.find(
      (element) => element.name == enemy.name
    )!;
    enemyOriginal.takeDamage(this.player.damage);
    (<Laser>laser).kill();
    return true;
  }

  // player Laser overlaps protection
  private _playerLaserHitsProtection(
    protection: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const protectionOriginal: Protection = this.protections.find(
      (element) => element.name == protection.name
    )!;
    protectionOriginal.takeDamage(this.player.damage);
    (<Laser>laser).kill();
  }
}