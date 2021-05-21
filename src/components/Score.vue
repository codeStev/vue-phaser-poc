<template>
  <!-- <v-container :>
    <h1>Score Management UI</h1>
    <p>This UI was developed to handle Score Registration.</p>
    <v-row>
      <v-col sm="12">
        response message
        <v-alert v-if="responseSuccess" dense text type="success">
          You have successfully added score.
        </v-alert>
        <v-alert v-if="!responseSuccess" dense text type="failure">
          Could not add score
        </v-alert>
      </v-col>
      <v-col sm="6">
        <h3>Score Registration</h3>
        <v-text-field v-model="score.name" label="Player Name"></v-text-field>
        <v-text-field
          v-model="score.points"
          label="Player Points"
        ></v-text-field>
        <v-btn color="primary" v-on:click="createScore">
          Enter
        </v-btn>
      </v-col>
      <v-col sm="6">
        <h3>Entered Scores</h3>
        table with all read scores
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  ID
                </th>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in enteredScores" :key="score.id">
                <td>{{ score.id }}</td>
                <td>{{ score.name }}</td>
                <td>{{ score.points }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container> -->
  
  <v-card flat tile id="scoreMenu"  color="transparent" :max-width="(this.canvasWidth)" :max-height="this.canvasHeight" elevation="0"> 
  <v-row d-flex justify-center align-center>
    <v-col cols="6"  justify-center align-center>
      <v-row>
        <v-col cols="6" justify-center align-center>
          <v-text-field dense v-model="scoreData.name" label="Name" color="yellow" background-color="white">
            
          </v-text-field>
        </v-col >
         <v-col cols="2" justify-center align-center>
          <v-btn dense>
            Submit
          </v-btn >
        </v-col>
      </v-row>>
      <v-row>
        <v-btn>
          Retry
        </v-btn> dense
        </v-row>  
    </v-col >  
    <v-col cols="6"  justify-center align-center>
      <v-data-table>
      </v-data-table>
    </v-col>
  </v-row>
    

  </v-card>
</template>

<script>
import apiConnect from "@/service/apiConnect";
import { NONE } from "phaser";
import Vue from "vue";

export default Vue.extend({
  name: "Score",
  data: () => ({
    scoreData: {
      name: "",
      points: "",
    },
    
    enteredScores: [],
    responseSuccess: false,
    canvasWidth : '',
    canvasHeight : ''
  })
  ,
  // canvasHeight : function(){
  //       const sceneHeight = this.canvasStyle.height
  //       return sceneHeight

  //   },
  //   canvasWidth : function(){
  //       const sceneWidth = this.canvasStyle.height
  //       console.log(sceneWidth)
  //       console.log('hey')
  //       return sceneWidth
  //   },
  //   canvasStyle : function(){
  //     const canvasStyle = getComputedStyle(this.gameCanvas)
  //     console.log(canvasStyle)
  //     return canvasStyle
  //   },
  props: {
      sceneHeight: Number,
      sceneWidth: Number,
      score: Number,
      // or any other constructor
    },
  methods: {
    // use api to read scores
    readAllScores: async function () {
      const data = await apiConnect.readAllScores();
      this.enteredScores = data;
    },
    // use api to read top ten scores
    readTopTenScores: async function () {
      const data = await apiConnect.readTopTenScores;
      this.enteredScores = data;
    },
    // use api to save new score
    createScore: async function () {
      const requestData = {
        name: this.score.name,
        points: this.score.points,
      };
      await apiConnect.createScore(requestData);
      this.score.name = "";
      this.score.points = "";
      this.readAllScores();
      this.responseSuccess = true;
    },
  },
  // default method when starting up
  beforeMount() {
    //this.readAllScores();
    const gameCanvas = document.getElementById('game').firstElementChild
    const canvasStyle = getComputedStyle(gameCanvas)
    this.canvasWidth =(parseInt(canvasStyle.width)*0.7)+'px'
    this.canvasHeight = (parseInt(canvasStyle.height)/3)+'px'
    

  },
});
</script>

<style scoped>
#scoreMenu{ 
    transform: translateY(-100%) !important;
}
</style>