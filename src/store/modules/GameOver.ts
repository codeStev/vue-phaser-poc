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
   if(this.gameOver){
     this.gameOver = false
   }
   else if(!this.gameOver){
     this.gameOver = true
   }
 }

 //adds scene to game config
 @Action
 toggleGameOverAction() : void {
     this.context.commit('toggleGameOver')
 }

 get GameOver(){
     return this.gameOver
 }
  
  }