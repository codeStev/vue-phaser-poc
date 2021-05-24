import { GameObjects, Scene } from "phaser";
import ShipAsset from "../gameAssets/player/playerShip3_red.png";
import PlayerLifeAsset from "../gameAssets/player/playerLife3_red.png";
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
import Laser from "@/gameLogic/object/laser/Laser";
import Protection from "@/gameLogic/object/protection/Protection";
import "@/gameLogic/object/protection/Protection";
import Enemy from "@/gameLogic/characters/enemies/Enemy";
import Character from "@/gameLogic/characters/Character";
import "@/gameLogic/characters/enemies/Gunner";
import "@/gameLogic/characters/Character";
import ShootingEnemy from "@/gameLogic/characters/enemies/ShootingEnemy";
import LaserKeys from "@/gameLogic/textureKeys/LaserKeys";
import LaserGroup from "@/gameLogic/object/laser/LaserGroup";
import LaserGroupEnemy from "@/gameLogic/object/laser/LaserGroupEnemy";
import CharacterKeys from "@/gameLogic/textureKeys/CharacterKeys";
import ProtectionKeys from "@/gameLogic/textureKeys/ProtectionKeys";
import TrojanHorse from "@/gameLogic/characters/enemies/TrojanHorse";
import Gunner from "@/gameLogic/characters/enemies/Gunner";
import Gang_A from "@/gameLogic/characters/enemies/Gang_A";
import getRandomGangType from "@/gameLogic/utils/GangRandomizer";
import GameOverOverlay from '@/game/gameAssets/overlay/gameOverPicture.png'
import store from "@/store";
import EventDispatcher from "@/gameLogic/eventManagement/EventDispatcher";

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
  private eventDispatcher! : Phaser.Events.EventEmitter
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
    this.load.image(CharacterKeys.PLAYERLIFE, PlayerLifeAsset);
    this.load.image(CharacterKeys.BRUTE, BruteAsset);
    this.load.image(CharacterKeys.GUNNER, GunnerAsset);
    this.load.image(LaserKeys.RED, RedLaserAsset);
    this.load.image(LaserKeys.BLUE, BlueLaserAsset);
    this.load.image(ProtectionKeys.METEOR1, ProtectAsset1);
    this.load.image(ProtectionKeys.METEOR2, ProtectAsset2);
    this.load.image(ProtectionKeys.METEOR3, ProtectAsset3);
    this.load.image(ProtectionKeys.METEOR4, ProtectAsset4);
    this.load.image('gameOverOverlay',GameOverOverlay)
  }

  // create Player, Protection and Enemies
  public create() {
    this.setSceneGlobally()
    this.eventDispatcher = EventDispatcher.getInstance()
    this.eventDispatcher.removeAllListeners('restartScene')
    this.eventDispatcher.removeAllListeners('finalScene')
    this.eventDispatcher.on('restartScene',this._restartScene)
    //add listener for stopOverlay
    this.eventDispatcher.on('finalScene', this._showGamePauseOverlay)
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
      ProtectionKeys.METEOR1,
      ProtectionKeys.METEOR2,
      ProtectionKeys.METEOR3,
      ProtectionKeys.METEOR4,
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
      this.physics.overlap(
        element,
        this.enemies,
        this._enemyCollidesWithProtection,
        undefined,
        this
      );
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
    const isKilled = enemyOriginal.takeDamage(this.player.damage);

    if ((<ShootingEnemy>enemyOriginal).shootingTimerEvent!) {
      (<ShootingEnemy>enemyOriginal).shootingTimerEvent.remove(false);
    }
    if (isKilled) {
      this.player.addScore(enemyOriginal.points)
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
    protectionOriginal.alpha = protectionOriginal.calcOpacity();
    (<Laser>laser).kill();
    return true;
  }

  // enemy Laser overlaps Player
  private _enemyLaserShootsPlayer(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const isKilled = this.player.takeDamage(1);
    if(isKilled == true){
      this._triggerFinalScreenEvent()
    }
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
    protectionOriginal.alpha = protectionOriginal.calcOpacity();
    (<Laser>laser).kill();
    return true;
  }

  // enemy overlaps player
  private _enemyCollidesWithPlayer(
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const isKilled = this.player.takeDamage((<Enemy> enemy).hittingDamage);
    if(isKilled){
      this._triggerFinalScreenEvent()
    }
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

  // enemy overlaps protection
  private _enemyCollidesWithProtection(
    protection: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const protectionOriginal: Protection = this.protections.find(
      (element) => element.name == protection.name
    )!;
    protectionOriginal.takeDamage(1);
    protectionOriginal.alpha = protectionOriginal.calcOpacity();
    const enemyOriginal: Enemy = this.enemies.find(
      (element) => element.name == enemy.name
    )!;
    if (enemyOriginal.lifepoints <= 0) {
      const index = this.enemies.indexOf(enemyOriginal);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }
    enemyOriginal.takeDamage(1);
    return true;
  }
  
  private _triggerFinalScreenEvent(){
    this.eventDispatcher.emit('finalScene',this)
  }

  getPlayer() : Player{
    return this.player;
  }
  
  private async _showGamePauseOverlay(scene : GameScene){
    await store.dispatch('setScoreWithNumber',scene.player.score)
    scene.scene.pause()
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;
    const height = scene.cameras.main.centerY*2
    const width = scene.cameras.main.centerX*2
    const gamePauseOverlay = scene.add.rectangle(centerX, centerY, width, height, 0o0)
    gamePauseOverlay.fillAlpha = 0.8
    const gamePauseOverlayText = scene.add.image(centerX,centerY/1.5,'gameOverOverlay')
    gamePauseOverlayText.setScale(width/gamePauseOverlayText.width/2.8,height/gamePauseOverlayText.height/2.5)
    const scoreText = scene.player.score.toString()
    const finalScoreText =  scene.add.text(centerX, centerY * 1.1 ,'Score:',{font: '70px Courier',color: '#f0e130'}).setOrigin(0.5)
    const finalScorePoints =  scene.add.text(centerX, centerY * 1.2 , scoreText ,{font: '70px Courier',color: '#f0e130'}).setOrigin(0.5)
    await store.dispatch('toggleGameOverAction','gamescene')
    console.log('Ich war hier!')
  }

  private _restartScene(scene: GameScene){
    scene.scene.restart()
  }

  private async setSceneGlobally(){
    await store.dispatch('setSceneAction',this)
  }
}
