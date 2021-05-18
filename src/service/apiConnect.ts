import axios from "axios";

const apiClient = {
  async readAllScores() {
    const response = await axios.get("/scores");
    return response.data;
  },
  async readTopTenScores() {
    const response = await axios.get("/topten");
    return response.data;
  },
  async createScore(newScore: any) {
    const response = await axios.post("/scores", newScore);
    return response.data;
  },
  async deleteScore(scoreId: string) {
    const response = await axios.delete("/scores" + scoreId);
    return response.data;
  },
};

export default apiClient;
