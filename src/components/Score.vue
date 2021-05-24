<template>
 
  <v-card flat tile id="scoreMenu"  color="transparent" :max-width="(this.canvasWidth)" :max-height="this.canvasHeight" elevation="0"> 
  <v-row d-flex justify-center align-center>
    <v-col cols="6"  justify-center align-center>
      <v-row>
        <v-col cols="6" justify-center align-center>
          <v-text-field dense v-model="scoreData.name" label="Name" color="yellow" background-color="white">
            
          </v-text-field>
        </v-col >
         <v-col cols="2" justify-center align-center>
          <v-btn dense v-on:click="createScore">
            Submit
          </v-btn >
        </v-col>
      </v-row>
      <v-row>
        <v-btn v-on:click="restartGame">
          Retry
        </v-btn>
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
import EventDispatcher from "@/gameLogic/eventManagement/EventDispatcher";
import apiConnect from "@/service/apiConnect";
import Vue from "vue";

export default Vue.extend({
  name: "Score",
  computed: {
      getScore : function(){
        if(this.score != undefined){
          return this.score 
        }
        return 0
      }
      // or any other constructor
    ,
      splitName : function(){

        let newScoreData=""
        if( this.scoreData.name.length!=undefined && this.scoreData.name.length>5){
          newScoreData = this.scoreData.name
          newScoreData = this.scoreData.slice(0,5);
        }
        return newScoreData
      }
      // or any other constructor
    },
     watch: {
    // whenever question changes, this function will run
    getScore: function (newScore, oldScore) {
      console.log('newscore'+ toString(newScore))
      if(newScore!= undefined){
              this.scoreData.points = newScore
      }
    },
    splitName: function (newName) {
      if(newName != undefined){
              this.scoreData.name = newName
      }
    }
  },
  data: () => ({
    scoreData: {
      name: '',
      points: 0
    },
    enteredScores: [],
    responseSuccess: false,
    canvasWidth : '',
    canvasHeight : '',
    phaserEventDispatcher : EventDispatcher.getInstance()
  })
  ,    
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
      this.score.points = 0;
      this.readAllScores();
      this.responseSuccess = true;
    },
    async restartGame(){
    this.phaserEventDispatcher.emit('restartGame')
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