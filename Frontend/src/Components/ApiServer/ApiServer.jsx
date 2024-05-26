import axios from "axios";

const ApiService = {
  // baseURL: "http://localhost:5000",
 baseURL: "https://projectfinalbackend.onrender.com",

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

  getPostsByCompany: async (
    companyName,
    startYear,
    endYear,
    targetedStreams
  ) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${ApiService.baseURL}/posts/postsByCompany/${companyName}/${startYear}/${endYear}/${targetedStreams}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token, authorization denied");
      }

      const response = await axios.delete(
        `${ApiService.baseURL}/posts/delete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error.response.data;
    }
  },

  // Function to edit a post
  editPost: async (postId, newData) => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token, authorization denied");
      }

      const response = await axios.put(
        `${ApiService.baseURL}/posts/editpost/${postId}`,
        newData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error editing post:", error);
      throw error.response.data;
    }
  },

  adminLogin: async (employeeId, password) => {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/admin/login`,
        { employeeId, password},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error during admin login:", error);
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
          onUploadProgress: (progressEvent) => {
            console.log(
              "Upload Progress:",
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  adminregister: async (formData) => {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/admin/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  createPost: async (payload) => {
    try {
      const token = localStorage.getItem("jwtToken");
      console.log(payload);
      //const jsonStringPayload = JSON.stringify(payload);
      const response = await axios.post(
        `${ApiService.baseURL}/admin/createPost`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error creating post:", error);
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
      console.error("Error fetching user data:", error);
      throw error.response.data;
    }
  },

  updateUserData: async (updatedData) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `${ApiService.baseURL}/user/updateProfile`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user data:", error);
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
        `${ApiService.baseURL}/admin/user/${rollNumber}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to send roll number"
      );
    }
  },

  adminForgetPassword: async (
    employeeId,
    secretCode,
    newPassword
  ) => {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/admin/forgetPassword`,
        { employeeId, email, mobileNumber, secretCode, newPassword },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  userForgetPassword: async (
    rollNumber,
    regNumber,
    secretCode,
    newPassword
  ) => {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/user/forgetPassword`,
        { rollNumber, regNumber, secretCode, newPassword },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getNotificationCount: async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token, authorization denied");
      }
      const response = await axios.get(
        `${ApiService.baseURL}/user/notificationCount`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token, authorization denied");
      }
      const response = await axios.get(`${ApiService.baseURL}/user/read`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  formSubmit: async (formDataToSend) => {
    try {
      //console.log(formDataToSend);
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${ApiService.baseURL}/user/submitResponseForm`,
        { formDataToSend },
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

  downloadResponse: async (postId,checkedFields) => {
    try {
      //console.log(postId);
      const token = localStorage.getItem("jwtToken");
      console.log(postId ,checkedFields);
      const response = await axios.post(
        `${ApiService.baseURL}/posts/downloadResponse/${postId}`,
        { postId ,checkedFields},
        {
          responseType: 'blob',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(response)
      return response;
    } catch (error) {
      //console.log(error.response.data)
      throw error.response.data;
    }
  },

  placed: async (formData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log(formData)
      const response = await axios.post(`${ApiService.baseURL}/reviews/placed`, 
      formData, 
      {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      console.log('Response:', response);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error.response.data;
    }
  },
  prevSubmission: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${ApiService.baseURL}/reviews/prev-submission`, {
        withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      });
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },

  placedData: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${ApiService.baseURL}/reviews/placedStudentData`, {
        withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      }); 
      //console.log(response)
      return response;
    } catch (error) {
      throw new Error(`Error fetching placed data: ${error.message}`);
    }
  },

  approveReq: async (postId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(`${ApiService.baseURL}/reviews/approverdReq`,
      { postId}, 
      {
        withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      }); 
      //console.log(response)
      return response;
    } catch (error) {
      throw new Error(`Error fetching placed data: ${error.message}`);
    }
  },

};

export default ApiService;
