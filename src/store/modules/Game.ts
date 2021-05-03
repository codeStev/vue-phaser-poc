import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Phaser, { Scene } from 'phaser'
import GameScene from '@/gameLogic/GameScene'

@Module
export default class Game extends VuexModule {
  private gameConfig : Phaser.Types.Core.GameConfig = {
       title : 'SpaceInvaderZZZ',
       type : Phaser.AUTO,
       scale : {
           width : '100%',
           height : '100%'
       },
       physics : {
           default: 'arcade',
           arcade : {
               debug : true, 
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
  
    // action 'incr' commits mutation 'increment' when done with return value as payload
    @Action
    addSceneWithKey(key : string, scene : Scene) : void {
        this.context.commit('addScene',{key,scene})
    }
    // action 'decr' commits mutation 'decrement' when done with return value as payload
    @Action
    deleteSceneByKey(key : string) :void {
       this.context.commit('deleteScene',key)
    }
    
  }