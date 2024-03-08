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

  ShortByYear: async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        throw { message: 'No token, authorization denied' };
      }

      const response = await axios.get(`${ApiService.baseURL}/posts/shortByYear`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default ApiService;
