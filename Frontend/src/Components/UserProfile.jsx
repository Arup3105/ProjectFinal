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
        setUserData(newUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [rollNumber]);

  const downloadDocument = (documentUrl) => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.setAttribute('download', 'document');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {userData ? (
        <div className="profile-container">
          <h2>Profile of Roll Number {rollNumber}</h2>
          <div className="bg-image">
            <img src="/apchome.jpg" alt="" />
          </div>

          <div className="profile-photo-section">
            <div className="profile-photo">
              {userData.photo && (
                <div className="profile-field">
                  <img className="user-photo" src={userData.photo} alt="User Photo" />
                </div>
              )}
            </div>
          </div>
          <div className="username">
            <p>{userData.username}</p>
          </div>
          
          <div className="profile-details">
            {/* Personal Details Section */}
            <div className="flex">
              <div className="profile-info-section">
                <div className="profile-info">
                  <h3>Personal Details</h3>
                  {userData && Object.entries(userData).map(([key, value]) => (
                    key !== 'password' && key !== 'stream' && !key.endsWith('Sheet') && key !== 'cv' && key !== 'photo' && (
                      <div key={key} className="profile-field" style={{ marginBottom:"10px"}}>
                        <label>{key.toUpperCase()}</label>
                        <span className="user-data">{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
              {/* Render Documents section */}
              <div className="profile-docs-section">
                <h3>Documents</h3>
                <div className="profile-docs">
                  {userData && Object.entries(userData).map(([key, value]) => (
                    (key.endsWith('Sheet') || key === 'cv') && (
                      <div key={key} className="profile-field">
                        <label>{key.toUpperCase()}</label>
                        <div className="document-options">
                          {value ? (
                            <>
                              <span className="user-document">
                                {key === 'cv' ? (
                                  <a href={value} target="_blank" rel="noopener noreferrer">
                                    <img src="/pdf-icon.png" alt={key} style={{ width:"50px"}} />
                                  </a>
                                ) : (
                                  <img src={value} alt={key} />
                                )}
                              </span>
                              <button onClick={() => downloadDocument(value)}>Download</button>
                            </>
                          ) : (
                            <span className="default-icon">
                              {key === 'cv' ? (
                                <img src="/pdf-icon.png" alt="PDF Icon" />
                              ) : (
                                'No document available'
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
