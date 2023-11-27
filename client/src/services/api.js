import axios from "axios";

const api = {
    fetchQuestions: () => {
      return axios.get('/questions');
    },
  
    postQuestion: (questionData) => {
      return axios.post('/questions', questionData);
    },
  
    fetchQuestion: (questionId) => {
      return axios.get(`/questions/${questionId}`);
    },
  
    postAnswer: (questionId, answerData) => {
      return axios.post(`/questions/${questionId}/answers`, answerData);
    },
  
    fetchTags: () => {
      return axios.get('/tags');
    },
  
    search: (searchTerm) => {
      return axios.get(`/search?query=${encodeURIComponent(searchTerm)}`);
    },
  
};
  

export default api;

