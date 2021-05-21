<template>
<v-container justify="center"> 
    <v-row justify="center">
        <v-col fill-height d-flex flex-column justify="center">
    <v-container fluid id="game"></v-container>
    <score fill-height class="mx-auto" d-flex flex-column justify="center" v-if="gameOver" :sceneWidth="sceneWidth/2" :sceneHeight="sceneHeight" :score="playerScore"></score>
    </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import store from '@/store'
import { Game } from 'phaser'
import Vue from 'vue'
import Score from './Score.vue'
export default Vue.extend({
  components: { Score },
    name : 'GameComponent',
    computed:{
    playerScore: function(){
        const score = this.$store.getters.Score
        console.log(score)
        return score
    },
    gameOver : function(){
        const gameOver = this.$store.getters.GameOver
        console.log(gameOver)
        return gameOver

    },
    sceneHeight : function(){
        const sceneHeight = this.$store.getters.SceneHeight
        return sceneHeight

    },
    sceneWidth : function(){
        const sceneWidth = this.$store.getters.SceneWidth
        console.log(sceneWidth)
        return sceneWidth

    }
        
    }
  ,
    data : () =>({
        
    }),
    props : {
        game : Game
    },
    mounted(){
        this.$props.game = this.$store.getters.game
    }
})
</script>
<style scoped>
#game{
    max-height: 95vh;
    
}
</style>
