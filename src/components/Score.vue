<template>
 
  <v-card flat tile id="scoreMenu"  color="transparent" :max-width="componentSize.width" :max-height="componentSize.height" elevation="0"> 
  <v-row d-flex justify-center align-center>
    <v-col cols="6"  justify-center align-center>
      <v-row>
        <v-col cols="6" justify-center align-center>
          <v-form v-model="isFormValid">
          <v-text-field :rules="[rules.required, rules.counter]" maxlength="5" dense v-model="scoreData.name" label="Name" color="yellow" background-color="white">
          </v-text-field>
          </v-form>
        </v-col >
         <v-col cols="2" justify-center align-center>
          <v-btn id="submitButton" dense v-on:click="createScore" :disabled="!isFormValid" >
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
      },
      componentSize: function(){
        const componentSize = {
          height : 0,
          width : 0
        }
        const gameCanvas = document.getElementById('game').firstElementChild
        if(gameCanvas != undefined){
        const canvasStyle = getComputedStyle(gameCanvas)
        const canvasHeight = (parseInt(canvasStyle.height)/3)+'px'
        const canvasWidth =(parseInt(canvasStyle.width)*0.7)+'px'
        componentSize.height = canvasHeight
        componentSize.width = canvasWidth
        }

        return componentSize
      }
    },
  data: () => ({
    scoreData: {
      name: '',
      points: 0
    },
    enteredScores: [],
    responseSuccess: false,
    phaserEventDispatcher : EventDispatcher.getInstance(),
    isFormValid :false,
       rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 5 || 'Max 5 characters',
          email: value => {
            const pattern = /w{5}/
            return pattern.test(value) || 'invalid user name'
          }
       }
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
      const data = apiConnect.readTopTenScores;
      this.enteredScores = data;
    },
    // use api to save new score
    createScore: async function () {
      // const requestData = {
      //   name: this.score.name,
      //   points: this.score.points,
      // };
      await apiConnect.createScore(this.scoreData);
      this.score.name = "";
      this.score.points = 0;
      this.submitButtonDisabled = true
      await this.readAllScores();
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
  created(){
    this.scoreData.points = this.getScore
      // Trick to remove class after initialising form
    this.$nextTick(() => {
        document.getElementById('submitButton').classList.remove('v-btn--disabled')      
    })
  }
});
</script>

<style scoped>
#scoreMenu{ 
    transform: translateY(-100%) !important;
}
button.v-btn[disabled] {
  opacity: 0.1 !important;
  
}
</style>