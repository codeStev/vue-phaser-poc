import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Phaser, { Scene } from 'phaser'
import GameScene from '@/game/scenes/GameScene'
import Player from '@/gameLogic/characters/player/Player'
import { mapGetters } from 'vuex'
//Score module for vuex store
@Module
export default class GameOver extends VuexModule {
  //default Game Config
 gameOver = false 

   
 @Mutation
 toggleGameOver() : void {
   this.gameOver = !this.gameOver
 }

 //adds scene to game config
 @Action
 toggleGameOverAction(score : number) : void {
     this.context.commit('toggleGameOver')
 }

 get GameOver(){
     return this.gameOver
 }
  
  }