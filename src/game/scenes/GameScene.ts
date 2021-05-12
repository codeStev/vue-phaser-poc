import {  GameObjects, Scene } from "phaser";
import ShipAsset from '../gameAssets/player/playerShip3_red.png'
import BruteAsset from '../gameAssets/enemies/enemyGreen4.png'
import LaserAsset from '../gameAssets/effects/particle-effects/laserRed01.png'
import Player from "@/gameLogic/characters/player/Player";
import "@/gameLogic/characters/player/Player"
import Brute from "@/gameLogic/characters/player/Brute";
import "@/gameLogic/characters/player/Brute"
import LaserGroup from "@/gameLogic/LaserGroup"
import Laser from "@/gameLogic/Laser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game',
  };

export default class GameScene extends Scene{
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player! : Player
    private brute! : Brute
   
    constructor(){
        super(sceneConfig)
    }

    moveDown(body : Phaser.Physics.Arcade.Body,blockedLeft:boolean){
        setTimeout(function(){
            body.setVelocityY(0)
            blockedLeft ? body.setVelocityX(500) : body.setVelocityX(-500)
        },100)
    }
  
    public init(){
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
        this.load.image('laser', LaserAsset)
    }
    
    public create(){
    
        this.cameras.main.setBackgroundColor("#000000");
        const startPosX : number = this.cameras.main.centerX
        const startPosY : number = this.cameras.main.centerY*1.8

        this.player = this.add.player(startPosX,startPosY,'ship')
        this.physics.world.enable([this.player])
        this.player.body.setCollideWorldBounds(true);

        this.brute = this.add.brute(startPosX, 300, 'enemy1')

     }
    
    public update(){

        if (this.player)
		{
			this.player.update(this.cursors)
        }

        
        if(this.player.laserGroup){
            this.physics.overlap(
                this.player.laserGroup,
                this.brute,
                this._laserHitsAlien,
                undefined,
                this
            )
        }
    }

    private _laserHitsAlien(laser : Phaser.Types.Physics.Arcade.GameObjectWithBody, brute : Phaser.Types.Physics.Arcade.GameObjectWithBody){
        console.log('hit');
        console.log(laser);
        (<Laser> laser).kill();
        (<Brute> brute).kill();
        return true;
    }
}