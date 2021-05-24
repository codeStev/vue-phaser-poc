import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import EventDispatcher from '@/gameLogic/eventManagement/EventDispatcher'
//Score module for vuex store
@Module
export default class PhaserEventDispatcher extends VuexModule {
  //default Game Config
phaserEventDispatcher = EventDispatcher.getInstance()


 get PhaserEventDispatcher(){
     console.log('aufgerufen')
    return this.phaserEventDispatcher
}
}