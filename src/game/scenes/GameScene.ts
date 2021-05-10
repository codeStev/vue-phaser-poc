import Player from "@/gameLogic/characters/player/Player";
import {  GameObjects, Scene } from "phaser";
import Ship from '../gameAssets/player/playerShip3_red.png'
import Laser from '../gameAssets/effects/particle-effects/laserRed01.png'
import "@/gameLogic/characters/player/Player"
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game',
  };

export default class GameScene extends Scene{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player! : Player;
   
    constructor(){
        super(sceneConfig)
    }
   
    // public init(){
    // }
     public preload(){
        this.cursors = this.input.keyboard.createCursorKeys()
        this.load.image('ship',Ship)
        this.load.image('laser', Laser)
    }
    public create(){
    
        this.cameras.main.setBackgroundColor("#000000");
        const startPosX : number = this.cameras.main.centerX
        const startPosY : number = this.cameras.main.centerY*1.8
        //his.player = this.physics.add.image(startPosX,startPosY, 'ship')
        //this.player = new Player(this,startPosX,startPosY,'ship',undefined)

        this.player = this.add.player(startPosX,startPosY,'ship')
        this.physics.world.enable([this.player])
        this.player.body.setCollideWorldBounds(true);
     }
    
    public update(){

        if (this.player)
		{
			this.player.update(this.cursors)
		}
    }

  

}