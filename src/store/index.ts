import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import game from './modules/Game'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  modules: {
    game
    
  }
})

export default store