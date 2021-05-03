import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import counter from './modules/Counter2'
import game from './modules/Game'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  modules: {
    counter,
    game
    
  }
})

export default store