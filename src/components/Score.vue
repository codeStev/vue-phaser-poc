<template>
  <v-container>
    <h1>Score Management UI</h1>
    <p>This UI developed to handle Score Registration.</p>
    <v-row>
      <v-col sm="12">
        <v-alert v-if="responseSuccess" dense text type="success">
          You have successfully added score.
        </v-alert>
      </v-col>
      <v-col sm="6">
        <h3>Score Registration</h3>
        <v-text-field v-model="score.name" label="Player Name"></v-text-field>
        <v-text-field
          v-model="score.points"
          label="Playe Points"
        ></v-text-field>
        <v-btn color="primary" v-on:click="createScore">
          Enter
        </v-btn>
      </v-col>
      <v-col sm="6">
        <h3>Entered Scores</h3>
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
  </v-container>
</template>

<script>
import apiConnect from "@/service/apiConnect";
import Vue from "vue";
export default Vue.extend({
  name: "Score",
  data: () => ({
    score: {
      name: "",
      points: "",
    },
    enteredScores: [],
    responseSuccess: false,
  }),
  methods: {
    readAllScores: async function() {
      const data = await apiConnect.readAllScores();
      this.enteredScores = data;
    },
    readTopTenScores: async function() {
      const data = await apiConnect.readTopTenScores;
      this.enteredScores = data;
    },
    createScore: async function() {
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
  mounted() {
    this.readAllScores();
  },
});
</script>
