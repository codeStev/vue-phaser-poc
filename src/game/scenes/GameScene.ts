import GameOverOverlay from '@/game/gameAssets/overlay/gameOverPicture.png';
import '@/gameLogic/characters/Character';
import '@/gameLogic/characters/enemies/Brute';
import Enemy from '@/gameLogic/characters/enemies/Enemy';
import Gang_A from '@/gameLogic/characters/enemies/Gang_A';
import '@/gameLogic/characters/enemies/Gunner';
import ShootingEnemy from '@/gameLogic/characters/enemies/ShootingEnemy';
import '@/gameLogic/characters/player/Player';
import Player from '@/gameLogic/characters/player/Player';
import EventDispatcher from '@/gameLogic/eventManagement/EventDispatcher';
import Laser from '@/gameLogic/object/laser/Laser';
import LaserGroup from '@/gameLogic/object/laser/LaserGroup';
import LaserGroupEnemy from '@/gameLogic/object/laser/LaserGroupEnemy';
import '@/gameLogic/object/protection/Protection';
import Protection from '@/gameLogic/object/protection/Protection';
import CharacterKeys from '@/gameLogic/textureKeys/CharacterKeys';
import LaserKeys from '@/gameLogic/textureKeys/LaserKeys';
import ProtectionKeys from '@/gameLogic/textureKeys/ProtectionKeys';
import getRandomGangType from '@/gameLogic/utils/GangRandomizer';
import store from '@/store';
import { Scene } from 'phaser';
import BlueLaserAsset from '../gameAssets/effects/particle-effects/laserBlue02.png';
import RedLaserAsset from '../gameAssets/effects/particle-effects/laserRed01.png';
import GunnerAsset from '../gameAssets/enemies/enemyBlue1.png';
import BruteAsset from '../gameAssets/enemies/enemyGreen4.png';
import ProtectAsset1 from '../gameAssets/meteors/meteorBrown_big1.png';
import ProtectAsset2 from '../gameAssets/meteors/meteorBrown_big2.png';
import ProtectAsset3 from '../gameAssets/meteors/meteorBrown_big3.png';
import ProtectAsset4 from '../gameAssets/meteors/meteorBrown_big4.png';
import PlayerLifeAsset from '../gameAssets/player/playerLife3_red.png';
import ShipAsset from '../gameAssets/player/playerShip3_red.png';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: true,
  visible: true,
  key: 'Game',
};

export default class GameScene extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Player;
  private enemies!: Enemy[];
  private protections!: Protection[];
  private gang!: Gang_A;
  private eventDispatcher!: Phaser.Events.EventEmitter;
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
    //load assets
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
    this.load.image('gameOverOverlay', GameOverOverlay);
  }

  // create Player, Protection and Enemies
  public create() {
    //set scene state in store to make it globally available
    this.setSceneGlobally();

    //get eventDispatcher instance
    this.eventDispatcher = EventDispatcher.getInstance();

    //remove all previous listeners if existent else they are added multiple times
    this.eventDispatcher.removeAllListeners('restartScene');
    this.eventDispatcher.removeAllListeners('finalScene');

    //set event listener for restart scene event
    this.eventDispatcher.on('restartScene', this._restartScene);

    //add event listener for stopOverlay
    this.eventDispatcher.on('finalScene', this._showGamePauseOverlay);

    //choose random gang type to render
    this.gang = getRandomGangType(this);
    this.enemies = this.gang.init();

    //create new Laser group for enemy lasers
    const enemyLaserGroup: LaserGroupEnemy = new LaserGroupEnemy(this);

    //set maximum number of enemy lasers on screen to infinite
    enemyLaserGroup.maxSize = -1;
    const playerLaserGroup: LaserGroup = new LaserGroup(this);

    // set background color of scene
    this.cameras.main.setBackgroundColor('#000000');

    // variables for player startposition
    const startPosX: number = this.cameras.main.centerX;
    const startPosY: number = this.cameras.main.centerY * 1.8;

    // add player to scene and initialize player laser group
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
    //bin each enemy to the enemyLaserGroup
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

    // add handler for enemies hitting the player
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

      // add handler for enemy lasers hitting the player
      if ((<ShootingEnemy>element).lasers) {
        this.physics.overlap(
          (<ShootingEnemy>element).lasers,
          this.player,
          this._enemyLaserShootsPlayer,
          undefined,
          this
        );
      }

      // add handler for player colliding with enemies
      this.physics.overlap(
        element,
        this.player,
        this._enemyCollidesWithPlayer,
        undefined,
        this
      );

      // add handler for enemy lasers hitting protections
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

    // add handler for player lasers hitting the protections
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

  // add handler for player lasers hitting the enemies
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
      this.player.addScore(enemyOriginal.points);
      const index = this.enemies.indexOf(enemyOriginal);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }

    (<Laser>laser).kill();
    return true;
  }

  //add handler for player lasers hitting the protections
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

  // add handler for enemy laser hitting the player
  private _enemyLaserShootsPlayer(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    laser: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const isKilled = this.player.takeDamage(1);
    if (isKilled == true) {
      this._triggerFinalScreenEvent();
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

  // add handler for enemy hitting the player
  private _enemyCollidesWithPlayer(
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const isKilled = this.player.takeDamage((<Enemy>enemy).hittingDamage);
    if (isKilled) {
      this._triggerFinalScreenEvent();
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

  // add handler for enemy hitting the protections
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

  private _triggerFinalScreenEvent() {
    this.eventDispatcher.emit('finalScene', this);
  }

  getPlayer(): Player {
    return this.player;
  }

  private async _showGamePauseOverlay(scene: GameScene) {
    //save current score in store
    await store.dispatch('setScoreWithNumber', scene.player.score);

    //pause scene and create overlay
    scene.scene.pause();
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;
    const height = scene.cameras.main.centerY * 2;
    const width = scene.cameras.main.centerX * 2;
    const gamePauseOverlay = scene.add.rectangle(
      centerX,
      centerY,
      width,
      height,
      0o0
    );
    gamePauseOverlay.fillAlpha = 0.8;
    const gamePauseOverlayText = scene.add.image(
      centerX,
      centerY / 1.5,
      'gameOverOverlay'
    );
    gamePauseOverlayText.setScale(
      width / gamePauseOverlayText.width / 2.8,
      height / gamePauseOverlayText.height / 2.5
    );
    const scoreText = scene.player.score.toString();
    const finalScoreText = scene.add
      .text(centerX, centerY * 1.1, 'Score:', {
        font: '70px Courier',
        color: '#f0e130',
      })
      .setOrigin(0.5);
    const finalScorePoints = scene.add
      .text(centerX, centerY * 1.2, scoreText, {
        font: '70px Courier',
        color: '#f0e130',
      })
      .setOrigin(0.5);

    //toggle game over globally in store
    await store.dispatch('toggleGameOverAction', 'gamescene');
  }

  private _restartScene(scene: GameScene) {
    scene.scene.restart();
  }

  private async setSceneGlobally() {
    await store.dispatch('setSceneAction', this);
  }
}
