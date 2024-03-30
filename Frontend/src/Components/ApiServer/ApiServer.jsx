import axios from "axios";

const ApiService = {

  baseURL: "http://localhost:5000",


  userLogin: async (credentials) => {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/user/login`,
        credentials,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  ShortByYear: async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw { message: "No token, authorization denied" };
      }

      const response = await axios.get(
        `${ApiService.baseURL}/posts/shortByYear`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  seeCompany: async (startYear, endYear) => {
    try {
      const token = localStorage.getItem("jwtToken");
  
      if (!token) {
        throw { message: "No token, authorization denied" };
      }
  
      const response = await axios.get(
        `${ApiService.baseURL}/posts/seeCompany/${startYear}/${endYear}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getPostsByCompany: async (companyName, startYear, endYear, targetedStreams) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${ApiService.baseURL}/posts/postsByCompany/${companyName}/${startYear}/${endYear}/${targetedStreams}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  adminLogin: async (employeeId, password, secretCode) => {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/admin/login`,
        { employeeId, password, secretCode },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  },

  register: async (formData) => {
    try {
      const formDataObj = new FormData();
      for (const [key, value] of formData.entries()) {
        formDataObj.append(key, value);
      }
      const response = await axios.post(
        `${ApiService.baseURL}/user/register`,
        formDataObj,
        {
          withCredentials: true,
          onUploadProgress: progressEvent => {
            console.log('Upload Progress:', (progressEvent.loaded / progressEvent.total) * 100);
          }
        }
      );
  
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  adminregister: async (formData) => {
    try {
      const response = await axios.post(`${ApiService.baseURL}/admin/create`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  createPost: async (postData) => {
    try {
const postDataString = JSON.stringify(postData);

      const token = localStorage.getItem("jwtToken");
      //console.log(postData)
      const response = await axios.post(
        `${ApiService.baseURL}/admin/createPost`,
        postData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error.response.data;
    }
  },
  
  getProfileData: async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token, authorization denied");
      }

      const response = await axios.get(`${ApiService.baseURL}/user/profile`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error.response.data;
    }
  },

  updateUserData: async (updatedData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put(
        `${ApiService.baseURL}/user/updateProfile`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error.response.data;
    }
  },

  searchData: async (searchQuery) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${ApiService.baseURL}/admin/searchUser`,
        { searchQuery },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getUserData: async (rollNumber) => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token, authorization denied");
      }
      
      const response = await axios.get(
        `${ApiService.baseURL}/admin/user?rollNumber=${rollNumber}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to send roll number");
    }
  },
  
};


export default ApiService;
