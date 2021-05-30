<template>
  <v-card
    flat
    tile
    id="scoreMenu"
    color="transparent"
    :max-width="componentSize.width"
    :max-height="componentSize.height"
    elevation="0"
  >
    <v-row d-flex justify-center align-center>
      <v-col cols="6" justify-center align-center>
        <v-row>
          <v-col cols="6" justify-center align-center>
            <v-form v-model="isFormValid">
              <v-text-field
                :rules="[rules.required, rules.counter]"
                maxlength="5"
                dense
                v-model="scoreData.name"
                label="Name"
                color="yellow"
                background-color="white"
              >
              </v-text-field>
              <v-alert
                dense
                v-if="!responseSuccess && requestFired"
                type="error"
                outlined
              >
                {{ errorMessage }}
              </v-alert>
              <v-alert
                dense
                v-if="responseSuccess && requestFired"
                type="success"
                outlined
              >
                Sucess
              </v-alert>
            </v-form>
          </v-col>
          <v-col cols="2" justify-center align-center>
            <v-btn
              id="submitButton"
              dense
              v-on:click="createScore"
              :disabled="buttonDisabled"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-btn v-on:click="restartGame">
            Retry
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6" justify-center align-center>
        <v-simple-table
          dense
          :height="componentSize.height"
          class="overflow-y-auto"
        >
          <template>
            <thead>
              <tr>
                <th class="text-left">
                  #
                </th>
                <th class="text-left">
                  Player
                </th>
                <th class="text-left">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(score, index) in enteredScores" :key="score.id">
                <td>{{ index + 1 }}</td>
                <td>{{ score.name }}</td>
                <td>{{ score.points }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import EventDispatcher from '@/gameLogic/eventManagement/EventDispatcher';
import apiConnect from '@/service/apiConnect';
import Vue from 'vue';

export default Vue.extend({
  name: 'Score',
  computed: {
    getScore: function() {
      if (this.score != undefined) {
        return this.score;
      }
      return 0;
    },
    buttonDisabled: function() {
      return !this.isFormValid || this.responseSuccess;
    },
    componentSize: function() {
      const componentSize = {
        height: 0,
        width: 0,
      };
      //get the game canvas html element by id
      const gameCanvas = document.getElementById('game').firstElementChild;
      if (gameCanvas != undefined) {
        //get the style of the element and calculate the new canvas dimensions
        const canvasStyle = getComputedStyle(gameCanvas);
        const canvasHeight = parseInt(canvasStyle.height) / 3 + 'px';
        const canvasWidth = parseInt(canvasStyle.width) * 0.7 + 'px';
        componentSize.height = canvasHeight;
        componentSize.width = canvasWidth;
      }

      return componentSize;
    },
  },
  data: () => ({
    scoreData: {
      name: '',
      points: 0,
    },
    enteredScores: [],
    responseSuccess: false,
    phaserEventDispatcher: EventDispatcher.getInstance(),
    isFormValid: false,
    rules: {
      required: (value) => !!value || 'Required.',
      counter: (value) => value.length <= 5 || 'Max 5 characters',
      email: (value) => {
        const pattern = /w{5}/;
        return pattern.test(value) || 'invalid user name';
      },
    },
    errorMessage: '',
    requestFired: false,
  }),
  props: {
    score: Number,
  },
  methods: {
    // use api to read top ten scores
    readTopTenScores: async function() {
      const data = await apiConnect.readTopTenScores();
      this.enteredScores = data;
    },
    // use api to save new score
    createScore: async function() {
      const scoreResponse = await apiConnect.createScore(this.scoreData);

      //check for the responsecode
      if (scoreResponse.status >= 200 && scoreResponse.status < 300) {
        this.responseSuccess = true;
        this.errorMessage = '';
        this.isFormValid = false;
        await this.readTopTenScores();
      } else {
        this.responseSuccess = false;
        this.errorMessage = 'Fehler: ' + scoreResponse.status;
      }
      this.requestFired = true;
    },
    async restartGame() {
      this.phaserEventDispatcher.emit('restartGame');
    },
  },

  // default method when starting up
  beforeMount() {
    const gameCanvas = document.getElementById('game').firstElementChild;
    const canvasStyle = getComputedStyle(gameCanvas);
    this.canvasWidth = parseInt(canvasStyle.width) * 0.7 + 'px';
    this.canvasHeight = parseInt(canvasStyle.height) / 3 + 'px';
  },
  created() {
    this.readTopTenScores();
    this.scoreData.points = this.getScore;
    // Trick to remove class after initialising form
    this.$nextTick(() => {
      document
        .getElementById('submitButton')
        .classList.remove('v-btn--disabled');
    });
  },
});
</script>

<style scoped>
#scoreMenu {
  transform: translateY(-100%) !important;
}
button.v-btn[disabled] {
  opacity: 0.1 !important;
}
</style>
