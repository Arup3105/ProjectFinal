import React, { useEffect, useState } from 'react';
import '../Components/Feed.css';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../Components/ApiServer/ApiServer.jsx';

const Feed = () => {
  const [years, setYears] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.ShortByYear()
      .then(data => {
        setYears(data);
      })
      .catch(error => {
        if (error.message === 'Unauthorized') {
          console.log('Unauthorized access. Redirecting to login.');
          navigate('/login');
        } else {
          console.error('Error fetching year details:', error);
        }
      });
  }, [navigate]);

  return (
    <div className='back-img'>
        <img src="/apc.png" alt="APC" />
      <div className="feed">
        {years.map((year, index) => (
          <Link to={`/seeCompany/${year.startYear}/${year.endYear}`} key={index}>
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
