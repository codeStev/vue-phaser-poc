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

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game',
  };

export default class GameScene extends Scene{
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player! : Player
    private enemies! : Enemy[]
   
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
  
    public init(){
        //create basic formation
        const moveDown = this.moveDown      
        let collideCounter = 0
        this.physics.world.on("worldbounds",function(body: Phaser.Physics.Arcade.Body,blockedUp : boolean, blockedDown : boolean, blockedLeft : boolean, blockedRight : boolean){
            if(blockedLeft ){
                body.setVelocityX(500)
                collideCounter ++
            }
            else if (blockedRight){
                body.setVelocityX(-500)
            }
            if(collideCounter == 2){
                body.setVelocityX(0)
                body.setVelocityY(500)
                moveDown(body,blockedLeft)
                collideCounter = 0
                }
        })
    }
  
    public preload(){
        this.cursors = this.input.keyboard.createCursorKeys()
        this.load.image('ship',ShipAsset)
        this.load.image('enemy1', BruteAsset)
        this.load.image('enemy2', GunnerAsset)
        this.load.image('redLaser', RedLaserAsset)
        this.load.image('blueLaser', BlueLaserAsset)
    }
    
    public create(){
    
        const enemyLaserGroup : LaserGroupEnemy = new LaserGroupEnemy(this)
        enemyLaserGroup.maxSize=2
        const playerLaserGroup : LaserGroup = new LaserGroup(this)
        this.cameras.main.setBackgroundColor("#000000");
        const startPosX : number = this.cameras.main.centerX
        const startPosY : number = this.cameras.main.centerY*1.8

        this.player = this.add.player(startPosX,startPosY,'ship')
        this.player.laserGroup = playerLaserGroup
        this.physics.world.enable([this.player])
        this.player.body.setCollideWorldBounds(true);
        const enemyCount = 6
        let x = 0
        const xOffset = 100
        for (let i = 0; i < 6; i++) {
            x = x + xOffset            
            this.enemies.push(this.add.brute(x,300,'enemy1'))

            const gunner = this.add.gunner(x,600,'enemy2')
            gunner.lasers = enemyLaserGroup
            this.enemies.push(gunner)
            
        }

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
        
            if((<ShootingEnemy> element).lasers){
                (<ShootingEnemy>element).shoot()
               

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
        if(enemyOriginal.lifepoints <= 0){
            const index = this.enemies.indexOf(enemyOriginal);
            if (index > -1) {
              this.enemies.splice(index, 1);
            }        }
   
        (<Laser> laser).kill();
        return true;
    }

    private _laserHitsPlayer(player : Phaser.Types.Physics.Arcade.GameObjectWithBody, laser : Phaser.Types.Physics.Arcade.GameObjectWithBody){
        this.player.takeDamage(1);
        (<Laser> laser).kill();
        return true
    }

    private _alienHitsPlayer(enemy : Phaser.Types.Physics.Arcade.GameObjectWithBody, player : Phaser.Types.Physics.Arcade.GameObjectWithBody){
        console.log(this.player.lifepoints)
        this.player.takeDamage(1);
        const enemyOriginal: Enemy = this.enemies.find(element => element.name == enemy.name)!;
        if(enemyOriginal.lifepoints <= 0){
            const index = this.enemies.indexOf(enemyOriginal);
            if (index > -1) {
              this.enemies.splice(index, 1);
            }        }
        enemyOriginal.takeDamage(this.player.damage);
        console.log(this.player.lifepoints)
    }
}