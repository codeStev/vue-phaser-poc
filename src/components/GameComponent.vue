<template>
<v-container justify="center"> 
    <v-row justify="center">
        <v-col fill-height d-flex flex-column justify="center">
    <v-container fluid id="game"></v-container>
    <score fill-height class="mx-auto" d-flex flex-column justify="center" v-if="gameOver" :score="playerScore"></score>
    </v-col>
    </v-row>
</v-container>
</template>
 <script>
import { Game } from 'phaser'
import Vue from 'vue'
import Score from './Score.vue'
import EventDispatcher from '@/gameLogic/eventManagement/EventDispatcher'
export default Vue.extend({
  components: { Score },
    name : 'GameComponent',
    computed:{
        //returns the score held in store, updates accordingly when the state changes
        playerScore: function(){
            const score = this.$store.getters.Score
            console.log(score)
            return score
        },
        //eturns the gamover state held in store, updates accordingly when the state changes
        gameOver : function(){
            const gameOver = this.$store.getters.GameOver
            console.log(gameOver)
            return gameOver
        }  
    },
    data : () =>({
        game : Game,
        phaserEventDispatcher : EventDispatcher.getInstance()

    }),
    methods : {
        restartGame: async function(){
            //dispatch store action to toggle gameOver in store
            await this.$store.dispatch('toggleGameOverAction','gameComponent')
            let scene = await this.$store.getters.Scene
            console.log('scene',scene)
            //emit restartScene event with scene as callback parameter
           await this.phaserEventDispatcher.emit('restartScene',scene)

            }
    },
    beforeMount(){
        //get the game from store
        this.game = this.$store.getters.game;

    },
    mounted(){
        //add eventlistener for restartGame event
        this.phaserEventDispatcher.on('restartGame', this.restartGame);
    }
    
})
</script>
<style scoped>
#game{
    max-height: 95vh;
    
}
</style>
