import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import game from './modules/Game'
import score from './modules/Score'
import gameOver from './modules/GameOver'
import sceneInformation from './modules/SceneInformation'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  modules: {
    game,
    score,
    gameOver,
    sceneInformation

    
  }
})

export default store