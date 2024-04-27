import React, { useState, useEffect } from "react";
import ApiService from "../Components/ApiServer/ApiServer";

function PlacedStudent() {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const [formData, setFormData] = useState({
    companyName: "",
    year: "",
    package: "",
  });
  const [previousSubmits, setPreviousSubmits] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [placedData, setPlacedData] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const transformedValue =
      name === "companyName" ? value.toUpperCase() : value; // Convert companyName to uppercase
    setFormData((prevState) => ({
      ...prevState,
      [name]: transformedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.placed(formData);
      setFormData({
        companyName: "",
        year: "",
        package: "",
      });
      await fetchPreviousSubmits(); // Call fetchPreviousSubmits after successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const fetchPreviousSubmits = async () => {
    try {
      const response = await ApiService.prevSubmission();
      if (response && Array.isArray(response.data)) {
        setPreviousSubmits(response.data);
      } else {
        setPreviousSubmits([]);
      }
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching previous submits:", error);
      setFetchError(
        error.message || "An error occurred while fetching previous submits"
      );
    }
  };

  const fetchPlacedData = async () => {
    try {
      const response = await ApiService.placedData();
      if (response && Array.isArray(response.data)) {
        setPlacedData(response.data);
      } else {
        setPlacedData([]);
      }
    } catch (error) {
      console.error("Error fetching placed data:", error);
    }
  };

  const handleApproveRequest = async (postId) => {
    try {
      await ApiService.approveReq(postId);
      setPlacedData(prevData => prevData.map(data => {
        if (data._id === postId) {
          return { ...data, approved: true };
        }
        return data;
      }));
      alert('Request approved successfully.');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request.');
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      fetchPreviousSubmits();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchPlacedData();
    }
  }, [isAdmin]);

  return (
    <>
      {isAdmin ? (
        <div>
          <div>You are an admin.</div>
          {placedData.length > 0 && (
            <div className="data">
              <div className ="pendingReq">
              <h3>Pending Request</h3>
              <ul>
                {placedData.map(
                  (data, index) =>
                    !data.approved && (
                      <p key={data._id}>
                      <li>
                        Name: {data.username}, Roll Number: {data.rollNumber},
                        Company Name: {data.companyName}, Year: {data.year},
                        Stream: {data.stream}, Package: {data.salary}, Status:{" "}
                        {data.approved ? "Approved" : "Pending"}
                        <button onClick={() => handleApproveRequest(data._id)}>Approve Request</button>
                      </li>
                      </p>
                    )
                )}
              </ul>
              </div>

              <div className="ApprovedReq">
              <h3>Approved Request</h3>
              <ul>
                {placedData.map(
                  (data, index) =>
                    data.approved && (
                      <li key={data._id}>
                        Name: {data.username}, Roll Number: {data.rollNumber},
                        Company Name: {data.companyName}, Year: {data.year},
                        Stream: {data.stream}, Package: {data.salary}, Status:{" "}
                        {data.approved ? "Approved" : "Pending"}
                      </li>
                    )
                )}
              </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="year">Year:</label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="package">Package (LPA):</label>
            <input
              type="number"
              id="package"
              name="package"
              value={formData.package}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
          <div>
            {fetchError ? (
              <div>Error fetching previous submits: {fetchError}</div>
            ) : previousSubmits.length > 0 ? (
              <div>
                <h3>Previous Submits</h3>
                <ul>
                  {previousSubmits.map((submit, index) => (
                    <p key={submit._id}>
                      <li>
                        Company Name: {submit.companyName}, Year: {submit.year},
                        Stream: {submit.stream}, Package: {submit.salary},
                        Status: {submit.approved ? "Approved" : "Pending"}
                      </li>
                    </p>
                  ))}
                </ul>
              </div>
            ) : (
              <div>No previous submits.</div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default PlacedStudent;
