import React, { useState, useEffect } from 'react';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import '../Components/Profile.css';

const Profile = () => {
  let defaultUserData = {
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
  // const isAdmin = localStorage.getItem('isAdmin') === 'true';
  let isAdmin = localStorage.getItem('isAdmin') === 'true'; 

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

    const uniqueFileName = `${file.name}_${Date.now()}`;

    const updatedData = { ...userData };
    updatedData[fieldName] = file;
    setUserData(updatedData);
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
      <div className="bg-image">
        <img src="/apchome.jpg" alt="" />
      </div>
      {!isAdmin && (
        <div className="profile-photo-section">

          <div className="profile-photo">
            {userData.photo && (
              <div className="profile-field">
                {editMode ? (
                  <input className="file-input" type="file" accept="image/*" onChange={e => handleFileUpload(e, 'photo')} />
                ) : (
                  <img className="user-photo" src={userData.photo} alt="User Photo" />
                )}
              </div>
            )}
            {!isAdmin && (
              <div className="username">
                <p>{userData.username}</p>
              </div>
            )}
          </div>
        </div>
      )}



      <div className="profile-details">
        {/* Personal Details Section */}
        <div className={`flex ${isAdmin ? 'admin-flex' : 'flex'}`}>
          <div className={`profile-info-section ${isAdmin ? 'admin-info-section' : 'profile-info-section'}`}>

          <div className={`profile-info ${isAdmin ? 'admin-info' : 'profile-info'}`} >
              <h3>Personal Details</h3>
              {userData && Object.entries(userData).map(([key, value]) => (
                key !== 'password' && key !== 'stream' && !key.endsWith('Sheet') && key !== 'cv' && key !== 'photo' && (
                  <div key={key} className="profile-field" style={{ marginBottom:"10px"}}>
                    <label >{key.toUpperCase()}:  </label>
                    {editMode ? (
                      <input
                        className="text-input"
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className="user-data" style={{ fontSize: "1.5em"}}>{value}</span>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>


          {/* Render Documents section only if isAdmin is false */}
          {!isAdmin && (
            <div className="profile-docs-section">

              <h3>Documents</h3>
              <div className="profile-docs">
                {userData && Object.entries(userData).map(([key, value]) => (
                  (key.endsWith('Sheet') || key === 'cv') && (
                    <div key={key} className="profile-field">
                      <label>{key.toUpperCase()}</label>
                      {editMode ? (
                        <input className="file-input" type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, key)} />
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
        {/* Render Photo section only if isAdmin is false */}
      </div>

      {/* Edit/Save Buttons */}
      <div className="profile-buttons">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleUpdate}>Save Changes</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
