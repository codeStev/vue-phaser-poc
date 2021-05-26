import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Phaser, { Scene } from 'phaser'
import GameScene from '@/game/scenes/GameScene'
//Game module for vuex store
@Module
export default class Game extends VuexModule {
  //default Game Config
  private gameConfig : Phaser.Types.Core.GameConfig = {
       title : 'SpaceInvaderZZZ',
       type : Phaser.AUTO,
       scale : {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        width : 1600,
        height : 1200,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      },
       physics : {
           default: 'arcade',
           arcade : {
               debug : false , 
               checkCollision: {
                       up: true,
                       down: true,
                       left: true,
                       right: true
                   },
           }, 
       },
       scene: GameScene
     
      
    ,
       parent : 'game',
       backgroundColor : '#000000'
   }
    game = new Phaser.Game(this.gameConfig)
    
    
    @Mutation
    addScene(key : string,scene: Scene) : void {
      this.game.scene.add(key,scene)
    }
    @Mutation
    deleteScene(key : string) : void {
      this.game.scene.getScene(key)
    }
  
    //adds scene to game config
    @Action
    addSceneWithKey(key : string, scene : Scene) : void {
        this.context.commit('addScene',{key,scene})
    }
    //deletes scene from game config
    @Action
    deleteSceneByKey(key : string) :void {
       this.context.commit('deleteScene',key)
    }
    @Mutation
    setGameWidth(key : number) : void {
      this.game.scale.setGameSize(key,this.game.scale.height)
    }
    @Action
    setGameWidthWithNumber(key : number) : void {
      this.context.commit('setGameWidth',key)
    }

    get gameWidth(){
      return this.game.scale.width
    }
     get gameHeight(){
      return this.game.scale.height
    }

 

  
  }