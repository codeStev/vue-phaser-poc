<template>
  <v-app id="app">
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>
     <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import EventDispatcher from './gameLogic/eventManagement/EventDispatcher';
import PhaserEventDispatcher from './store/modules/PhaserEventDispatcher';

export default Vue.extend({
  name: 'App',

  components: {
    
  },

  data: () => ({
  })
});
</script>