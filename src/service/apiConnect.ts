import axios from 'axios';

const apiClient = {
  // gets all scores from db
  async readAllScores() {
    const response = await axios.get('/scores');
    return response.data;
  },
  // gets top tenn scores from db
  async readTopTenScores() {
    const response = await axios.get('/topten');
    return response.data;
  },
  // sends new score to db
  async createScore(newScore: any) {
    try {
      const res = await axios.put('/scores', newScore);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  // deletes score by given ID from db
  async deleteScore(scoreId: string) {
    const response = await axios.delete('/scores' + scoreId);
    return response.data;
  },
};

export default apiClient;
