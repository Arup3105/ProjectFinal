import React, { useEffect, useState } from 'react';
import '../Components/Feed.css';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../Components/ApiServer/ApiServer.jsx';


const Feed = () => {
  const [years, setYears] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the year details from the backend using the API service
    ApiService.ShortByYear()
      .then(data => {
        setYears(data);
      })
      .catch(error => {
        // Handle unauthorized access by redirecting to login
        if (error.message === 'Unauthorized') {
          console.log('Unauthorized access. Redirecting to login.');
          navigate('/login');
        } else {
          // Handle other errors
          console.error('Error fetching year details:', error);
        }
      });
  }, [navigate]);

  return (
    <div>
      <div className="feed">
        {years.map((year, index) => (
          <Link to={`/${year.startYear}-${year.endYear}`} key={index}>
            <div className="card">
              <h4>{`${year.startYear}-${year.endYear}`}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Feed;
