<template>
<v-container> 
    <v-container fluid id="game"></v-container>
    <score></score>
    <v-text-field></v-text-field>
</v-container>
</template>

<script lang="ts">
import { Game } from 'phaser'
import Vue from 'vue'
import Score from './Score.vue'
export default Vue.extend({
  components: { Score },
    name : 'GameComponent',
    computed:{
    gameWidth: function () {
      return this.$store.getters.gameWidth
    },
    gameHeight: function(){
        return this.$store.getters.gameHeight
    },
    playerScore: function(){
        return this.$store.getters.score
    }
  },
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
