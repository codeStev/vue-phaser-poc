import {  GameObjects, Scene } from "phaser";
import Ship from '../assets/gameAssets/ship.png'
import Fire from '../assets/gameAssets/particles/fire.png'
import MegaSet from '../assets/gameAssets/particles/megaset-0.png'
import MegaSetJSON from '../assets/gameAssets/particles/megaset-0.json'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game',
  };

export default class GameScene extends Scene{
    private player : Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body };
    private bullets : (Phaser.GameObjects.Image & {body : Phaser.Physics.Arcade.Body})[]
    //private bullet : Phaser.GameObjects.Image & {body : Phaser.Physics.Arcade.Body}
    private playerParticles : Phaser.GameObjects.Particles.ParticleEmitterManager
    private backgroundParticles : Phaser.GameObjects.Particles.ParticleEmitterManager
    constructor(){
        super(sceneConfig)
    }
   
    public init(){
        this.bullets = new Array<(Phaser.GameObjects.Image & {body : Phaser.Physics.Arcade.Body})>()
    }
     public preload(){
         console.log(Ship)
         console.log()
        this.load.image('fire',Fire)
        this.load.image('ship',Ship)
        this.load.atlas('megaset', MegaSet, MegaSetJSON);
    }
    public create(){
        
        this.cameras.main.setBackgroundColor("#00B2EE");
        const startPosX : number = this.cameras.main.centerX
        const startPosY : number = this.cameras.main.centerY*1.8
        this.player = this.physics.add.image(startPosX,startPosY, 'ship')
        this.playerParticles = this.add.particles('fire');
        this.physics.world.enable([this.player])
        this.player.body.setCollideWorldBounds(true);
        const viewWidth = this.cameras.main.getBounds().width
        const viewHeight = this.cameras.main.getBounds().height
        console.log(viewHeight)
        console.log(viewHeight)
        const offscreen = new Phaser.Geom.Rectangle(-400, 0, 400, 600);
        const screen = new Phaser.Geom.Rectangle(-400, 0, 1600, 600);
    this.playerParticles.createEmitter({
        alpha: { start: 1, end: 0 },
        scale: { start: 0.5, end: 2.5 },
        //tint: { start: 0xff945e, end: 0xff945e },
    
        accelerationY: 300,
        angle: { min: 85, max: 95 },
        //rotate: { min: -180, max: 180 },
        blendMode: 'ADD',
        frequency: 110,
        x: this.player.getBottomCenter().x,
        y: this.player.getBottomCenter().y+10
        });
        this.backgroundParticles = this.add.particles('megaset', [
            {
                frame: 'blue_ball',
                emitZone: { source: offscreen },
                deathZone: { source: screen, type: 'onLeave' },
                frequency: 100,
                speedX: { min: 80, max: 120 },
                lifespan: 30000,
                scale: 0.5
            },
            {
                frame: 'red_ball',
                emitZone: { source: offscreen },
                deathZone: { source: screen, type: 'onLeave' },
                frequency: 150,
                speedX: { min: 180, max: 220 },
                lifespan: 30000,
                scale: 0.8
            },
            {
                frame: 'yellow_ball',
                emitZone: { source: offscreen },
                deathZone: { source: screen, type: 'onLeave' },
                frequency: 500,
                quantity: 4,
                speedX: { min: 280, max: 320 },
                lifespan: 30000
            },
        ]);
    }
    
    public update(){
        const CursorKeys = this.input.keyboard.createCursorKeys()

        if(CursorKeys.left.isDown){
            this.player.body.setVelocityX(-500)
        }
        else if (CursorKeys.right.isDown){
            this.player.body.setVelocityX(500)
        }
        else {
            this.player.body.setVelocityX(0)
        }
        const posPlayerTop = this.player.getTopCenter()
        const posPlayerBottom= this.player.getTopCenter()
        const playerParticleEmitter = this.playerParticles.emitters.first

        playerParticleEmitter.setSpeed(this.player.body.speed)
        this.playerParticles.emitters.first.setSpeed(this.player.body.speed)
        if(CursorKeys.space.isDown){
            

           // this.bullet = this.physics.add.image(posPlayerTop.x,posPlayerTop.y,'ship').setVelocityY(-100)
            this.bullets.push(this.physics.add.image(posPlayerTop.x,posPlayerTop.y,'ship').setVelocityY(-60))
            
           
        
        }
    }

  

}