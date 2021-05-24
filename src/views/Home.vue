<template>
  <v-container fluid class="home">
<game-component></game-component>  
</v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GameComponent from '@/components/GameComponent.vue'; // @ is an alias to /src

@Component({
  components: {
    GameComponent},
})
export default class Home extends Vue {}
</script>
