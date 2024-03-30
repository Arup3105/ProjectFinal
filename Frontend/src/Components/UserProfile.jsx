import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../Components/ApiServer/ApiServer.jsx';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const { rollNumber } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const newUserData = await ApiService.getUserData(rollNumber);
        //console.log(newUserData)
        setUserData(newUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [rollNumber]);

  const renderImage = (value) => {
    // Check if the value is a base64 encoded string
    if (typeof value === 'string' && value.startsWith('data:image')) {
      return <img src={value} alt="User Image" />;
    }
    return <span>{value}</span>;
  };

  return (
    <div>
      {userData ? (
        <div className="profile-container">
          <h2>Profile of Roll Number {rollNumber}</h2>
          <div className="profile-info">
            {Object.entries(userData).map(([key, value]) => (
              key !== 'password' && key !== 'stream' && (
                <div key={key} className="profile-field">
                  <label>{key.toUpperCase()}</label>
                  {key.endsWith('Sheet') || key === 'cv' || key === 'photo' ? (
                    renderImage(value)
                  ) : (
                    <span>{value}</span>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
