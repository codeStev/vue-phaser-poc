import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Phaser, { Scene } from 'phaser'
import GameScene from '@/game/scenes/GameScene'
import Player from '@/gameLogic/characters/player/Player'
import { mapGetters } from 'vuex'
//Score module for vuex store
@Module
export default class SceneInformation extends VuexModule {
scene : GameScene



 @Mutation
 setScene(scene : GameScene): void{
     this.scene = scene
 }
 @Action
 setSceneAction(scene:GameScene):void{
     this.context.commit('setScene',scene)
 }
 get Scene(){
   return this.scene
 }
}