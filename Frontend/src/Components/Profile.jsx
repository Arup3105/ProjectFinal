import React, { useState, useEffect } from 'react';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import '../Components/Profile.css';

const Profile = () => {
  const defaultUserData = {
    username: '',
    rollNumber: '',
    regNumber: '',
    email: '',
    mobileNumber: '',
    address: '',
    photo: '',
    tenthMarks: null,
    tenthMarkSheet: '',
    twelfthMarks: null,
    twelfthMarkSheet: '',
    cgpa: null,
    firstSemMarkSheet: '',
    secondSemMarkSheet: '',
    thirdSemMarkSheet: '',
    forthSemMarkSheet: null,
    fifthSemMarkSheet: null,
    sixthSemMarkSheet: null,
    cv: '',
    stream: '',
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setUserData(null); // Reset userData to null before fetching new data
      setLoading(true); // Set loading state to true while fetching data
      try {
        const data = await ApiService.getProfileData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error);
      } finally {
        setLoading(false); // Set loading state to false after fetching data (whether success or error)
      }
    };

    fetchData();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { ...userData };
      await ApiService.updateUserData(updatedData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(error);
    }
  };
  
  

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    try {
      const base64Image = await fileToBase64(file);
      setUserData(prevData => ({
        ...prevData,
        [fieldName]: base64Image,
      }));
    } catch (error) {
      console.error('Error converting file to base64:', error);
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        {userData && Object.entries(userData).map(([key, value]) => (
          key !== 'password' && key !== 'stream' && (
            <div key={key} className="profile-field">
              <label>{key.toUpperCase()}</label>
              {key.endsWith('Sheet') || key === 'cv' || key === 'photo' ? (
                <>
                  {editMode ? (
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, key)} />
                  ) : null}
                  {value ? (
                    <img src={value} alt={key} />
                  ) : (
                    <span>No image available</span>
                  )}
                </>
              ) : (
                editMode ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{value}</span>
                )
              )}
            </div>
          )
        ))}
        <div className="profile-buttons">
          {editMode ? (
            <>
              <button onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
