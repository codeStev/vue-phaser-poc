<template>
    <v-container fill-height id="game"></v-container>
</template>

<script lang="ts">
import { Game } from 'phaser'
import Vue from 'vue'
export default Vue.extend({
    name : 'GameComponent',
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