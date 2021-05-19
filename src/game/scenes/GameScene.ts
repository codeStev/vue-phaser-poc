import {  GameObjects, Scene } from "phaser";
import ShipAsset from '../gameAssets/player/playerShip3_red.png';
import BruteAsset from '../gameAssets/enemies/enemyGreen4.png';
import GunnerAsset from '../gameAssets/enemies/enemyBlue1.png';
import RedLaserAsset from '../gameAssets/effects/particle-effects/laserRed01.png';
import BlueLaserAsset from '../gameAssets/effects/particle-effects/laserBlue02.png';
import Player from "@/gameLogic/characters/player/Player";
import "@/gameLogic/characters/player/Player"
import "@/gameLogic/characters/enemies/Brute"
import Laser from "@/gameLogic/Laser";
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
    key: 'Game',
  };

export default class GameScene extends Scene{
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player! : Player
    private enemies! : Enemy[] 
    private gang! : Gang_A
   
    constructor(){
        super(sceneConfig)
        this.enemies = []
    }

    moveDown(body : Phaser.Physics.Arcade.Body,blockedLeft:boolean){
        setTimeout(function(){
            body.setVelocityY(0)
            blockedLeft ? body.setVelocityX(500) : body.setVelocityX(-500)
        },100)
    }
  
    // public init(){

    // }
  
    public preload(){
        this.cursors = this.input.keyboard.createCursorKeys()
        this.load.image(CharacterKeys.PLAYER,ShipAsset)
        this.load.image(CharacterKeys.BRUTE, BruteAsset)
        this.load.image(CharacterKeys.GUNNER, GunnerAsset)
        this.load.image(LaserKeys.RED, RedLaserAsset)
        this.load.image(LaserKeys.BLUE, BlueLaserAsset)
    }
    
    public create(){
        this.gang = getRandomGangType(this)
        this.enemies = this.gang.init()
        const enemyLaserGroup : LaserGroupEnemy = new LaserGroupEnemy(this)
        enemyLaserGroup.maxSize=-1
        const playerLaserGroup : LaserGroup = new LaserGroup(this)
        this.cameras.main.setBackgroundColor("#000000");
        const startPosX : number = this.cameras.main.centerX
        const startPosY : number = this.cameras.main.centerY*1.8

        this.player = this.add.player(startPosX,startPosY,CharacterKeys.PLAYER)
        this.player.laserGroup = playerLaserGroup
        this.physics.world.enable([this.player])
        this.player.body.setCollideWorldBounds(true);
        
      
        this.enemies.forEach(enemy => {
            if((<ShootingEnemy> enemy).lasers){
                (<ShootingEnemy> enemy).lasers = enemyLaserGroup
            }
        });
     

     }
    
    public update(){
        if (this.player)
		{
			this.player.update(this.cursors)
        }
        this.enemies.forEach(element => {
            if(this.player.laserGroup){
                this.physics.overlap(
                    this.player.laserGroup,
                    element,
                    this._laserHitsAlien,
                    undefined,
                    this
                )
            }
            if(this.gang.getLength()==0){
                this.gang.reset()
                this.gang = getRandomGangType(this)
                this.enemies = this.gang.init()
            }
        
            if((<ShootingEnemy> element).lasers){
               
                this.physics.overlap(
                    (<ShootingEnemy> element).lasers,
                    this.player,
                    this._laserHitsPlayer,
                    undefined,
                    this
                )
            }

            this.physics.overlap(
                element,
                this.player,
                this._alienHitsPlayer,
                undefined,
                this
            )
        })
      
    }

    private _laserHitsAlien(enemy : Phaser.Types.Physics.Arcade.GameObjectWithBody, laser : Phaser.Types.Physics.Arcade.GameObjectWithBody){
        const enemyOriginal: Enemy = this.enemies.find(element => element.name == enemy.name)!;
        enemyOriginal.takeDamage(this.player.damage);
        
        if((<ShootingEnemy> enemyOriginal).shootingTimerEvent!){
            (<ShootingEnemy> enemyOriginal).shootingTimerEvent.remove(false)
        }
        if(enemyOriginal.lifepoints <= 0){
            const index = this.enemies.indexOf(enemyOriginal);
            if (index > -1) {
              this.enemies.splice(index, 1);
            }}
   
        (<Laser> laser).kill();
        return true;
    }

    private _laserHitsPlayer(player : Phaser.Types.Physics.Arcade.GameObjectWithBody, laser : Phaser.Types.Physics.Arcade.GameObjectWithBody){
        this.player.takeDamage(1);
        (<Laser> laser).kill();
        return true
    }

    private _alienHitsPlayer(enemy : Phaser.Types.Physics.Arcade.GameObjectWithBody, player : Phaser.Types.Physics.Arcade.GameObjectWithBody){
        this.player.takeDamage(1);
        const enemyOriginal: Enemy = this.enemies.find(element => element.name == enemy.name)!;
        if(enemyOriginal.lifepoints <= 0){
            const index = this.enemies.indexOf(enemyOriginal);
            if (index > -1) {
              this.enemies.splice(index, 1);
            }        }
        enemyOriginal.takeDamage(this.player.damage);
    }
}