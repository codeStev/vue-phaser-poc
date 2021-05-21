import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Phaser, { Scene } from 'phaser'
import GameScene from '@/game/scenes/GameScene'
import Player from '@/gameLogic/characters/player/Player'
import { mapGetters } from 'vuex'
//Score module for vuex store
@Module
export default class SceneInformation extends VuexModule {
  //default Game Config
 sceneWidth = 0
 sceneHeight = 0 

   
 @Mutation
 setSceneWidth(width : number) : void {
   this.sceneWidth = width
 }

 //adds scene to game config
 @Action
 setSceneWidthAction(width : number) : void {
     this.context.commit('setSceneWidth',width)
 }

 @Mutation
 setSceneHeight(height : number) : void {
   this.sceneHeight = height
 }

 //adds scene to game config
 @Action
 setSceneHeightAction(height : number) : void {
     this.context.commit('setSceneWidth',height)
 }

 get SceneWidth(){
     return this.sceneWidth
 }
  
 get SceneHeight(){
    return this.sceneHeight
}
  }