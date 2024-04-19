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
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

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
    return <div className='load-body'>
      <div className="load-container">
        <div className="load-ring"></div>
        <div className="load-ring"></div>
        <div className="load-ring"></div>
        <div className="loading">Loading...</div>
      </div>
    </div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      {!isAdmin && (
        <div className="profile-section">

          <div className="profile-info">
            <h3>Photo</h3>
            {userData.photo && (
              <div className="profile-field">
                <label>Photo</label>
                {editMode ? (
                  <input className="file-input" type="file" accept="image/*" onChange={e => handleFileUpload(e, 'photo')} />
                ) : (
                  <img className="user-photo" src={userData.photo} alt="User Photo" />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personal Details Section */}
      <div className="profile-section">
        <div className="flex">

          <div className="profile-info">
            <h3>Personal Details</h3>
            {userData && Object.entries(userData).map(([key, value]) => (
              key !== 'password' && key !== 'stream' && !key.endsWith('Sheet') && key !== 'cv' && key !== 'photo' && (
                <div key={key} className="profile-field">
                  <label>{key.toUpperCase()}</label>
                  {editMode ? (
                    <input
                      className="text-input"
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span className="user-data">{value}</span>
                  )}
                </div>
              )
            ))}
          </div>


          {/* Render Documents section only if isAdmin is false */}
          {!isAdmin && (
            <div className="profile-section">

              <div className="profile-info">
                <h3>Documents</h3>
                {userData && Object.entries(userData).map(([key, value]) => (
                  (key.endsWith('Sheet') || key === 'cv') && (
                    <div key={key} className="profile-field">
                      <label>{key.toUpperCase()}</label>
                      {editMode ? (
                        <input className="file-input" type="file" accept="image/*" onChange={e => handleFileUpload(e, key)} />
                      ) : (
                        <span className="user-document">{value ? <img src={value} alt={key} /> : 'No document available'}</span>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      {/* Render Photo section only if isAdmin is false */}


      {/* Edit/Save Buttons */}
      <div className="profile-buttons">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleUpdate}>Save Changes</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
