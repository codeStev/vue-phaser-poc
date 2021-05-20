import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import game from './modules/Game'
import score from './modules/Score'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  modules: {
    game,
    score

    
  }
})

export default store