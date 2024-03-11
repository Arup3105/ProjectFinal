import React, { useEffect, useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { useParams, useNavigate } from "react-router-dom";

const SeeCompany = () => {
  const { startYear, endYear } = useParams();
  const [companyDetails, setCompanyDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.seeCompany(startYear, endYear)
      .then((data) => {
        setCompanyDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching company details:", error);
        setError(error);
        setLoading(false);
      });
  }, [startYear, endYear]);

  const handleCompanyClick = (companyName, targetedStreams) => {
    navigate(
      `/postsByCompany/${companyName}/${startYear}/${endYear}/${targetedStreams}`
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching company details: {error.message}</div>;
  }

  return (
    <div className="feed">
      {companyDetails.map((company, index) => (
        <div key={index} className="card">
          <h4
            onClick={() =>
              handleCompanyClick(company.name, company.targetedStreams)
            }
            style={{ cursor: "pointer" }}>
            {company.name}
          </h4>
          <h6>{company.targetedStreams.join(' , ')}</h6>
          <ul>
            {company.sessions.map((session, sessionIndex) => (
              <li key={sessionIndex}>
                {`${session.startYear}-${session.endYear}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SeeCompany;
