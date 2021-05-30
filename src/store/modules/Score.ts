import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import Phaser, { Scene } from 'phaser';
import GameScene from '@/game/scenes/GameScene';
import Player from '@/gameLogic/characters/player/Player';
import { mapGetters } from 'vuex';
//Score module for vuex store
@Module
export default class Score extends VuexModule {
  //default Game Config
  score = 0;

  @Mutation
  setScore(score: number): void {
    this.score = score;
  }

  @Action
  setScoreWithNumber(score: number): void {
    this.context.commit('setScore', score);
  }

  get Score() {
    return this.score;
  }
}
