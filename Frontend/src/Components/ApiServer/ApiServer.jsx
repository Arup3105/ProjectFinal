import axios from 'axios';

const ApiService = {
  // Define your backend base URL
  baseURL: 'http://localhost:5000',

  // Function to perform login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${ApiService.baseURL}/user/login`, credentials, {
        withCredentials: true, // Include credentials (like cookies) in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Return the response data
      return response.data;
    } catch (error) {
      // If there's an error, throw it so it can be handled by the caller
      throw error.response.data;
    }
  },
};

export default ApiService;
