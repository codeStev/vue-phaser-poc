<template>
  <v-container fluid class="home">
<game-component></game-component>  
<score></score>
</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GameComponent from '@/components/GameComponent.vue'; // @ is an alias to /src
import Score from '@/components/Score.vue';
@Component({
  components: {
    GameComponent,
    Score
  },
})
export default class Home extends Vue {}
</script>
