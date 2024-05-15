import React, { useState, useEffect } from 'react';
import ApiService from '../Components/ApiServer/ApiServer';
import * as XLSX from 'xlsx';
import '../Components/PlacedStudent.css'
import { SiGooglesheets } from "react-icons/si";

function PlacedStudent() {
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const [formData, setFormData] = useState({
    companyName: '',
    year: '',
    package: '',
  });
  const [previousSubmits, setPreviousSubmits] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [placedData, setPlacedData] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;
    const transformedValue =
      name === 'companyName' ? value.toUpperCase() : value; // Convert companyName to uppercase
    setFormData(prevState => ({
      ...prevState,
      [name]: transformedValue,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await ApiService.placed(formData);
      setFormData({
        companyName: '',
        year: '',
        package: '',
      });
      await fetchPreviousSubmits(); // Call fetchPreviousSubmits after successful submission
    } catch (error) {
      console.error('Error submitting data:', error);
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
      console.error('Error fetching previous submits:', error);
      setFetchError(
        error.message || 'An error occurred while fetching previous submits'
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
      console.error('Error fetching placed data:', error);
    }
  };

  const handleApproveRequest = async postId => {
    try {
      await ApiService.approveReq(postId);
      setPlacedData(prevData =>
        prevData.map(data => {
          if (data._id === postId) {
            return { ...data, approved: true };
          }
          return data;
        })
      );
      alert('Request approved successfully.');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request.');
    }
  };

  const handleDownloadExcel = () => {
    if (filteredData.length > 0) {
      const approvedData = filteredData.filter(item => item.approved === true);
      const excludedFields = ['_id', 'userId', 'approved', 'approvedBy', '__v', 'createdAt'];

      const modifiedData = approvedData.map(item => {
        const newItem = { ...item };
        excludedFields.forEach(field => delete newItem[field]);
        return newItem;
      });

      const fieldsOrder = ['username', 'stream', 'companyName', 'salary', 'year'];
      const rearrangedData = modifiedData.map(item => {
        const rearrangedItem = {};
        fieldsOrder.forEach(field => {
          rearrangedItem[field] = item[field];
        });
        return rearrangedItem;
      });

      const ws = XLSX.utils.json_to_sheet(rearrangedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'PlacedStudentData.xlsx');
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

  let filteredData =
    selectedValue && inputValue
      ? placedData.filter(data =>
        data[selectedValue]?.toLowerCase().includes(inputValue?.toLowerCase())
      )
      : placedData;

  // Apply sorting based on selected sort order
  if (sortBy === 'high') {
    filteredData = filteredData.slice().sort((a, b) => b.salary - a.salary);
  } else if (sortBy === 'low') {
    filteredData = filteredData.slice().sort((a, b) => a.salary - b.salary);
  }

  console.log({ selectedValue });

  return (
    <>
      {isAdmin ? (
        <div className='placed-students'>
          {/* <div>You are an admin.</div> */}
          {placedData.length > 0 && (
            <div className="data">
              <div className="pendingReq">
                <h3>Pending Request</h3>
                <ul>
                  {placedData.map(
                    (data, index) =>
                      !data.approved && (
                        <p key={data._id}>
                          <li>
                            Name: {data.username}, Roll Number:{' '}
                            {data.rollNumber}, Company Name: {data.companyName},
                            Year: {data.year}, Stream: {data.stream}, Package:{' '}
                            {data.salary}/LPA, Status:{' '}
                            {data.approved ? 'Approved' : 'Pending'}
                            <div className="apv-btn-wrap">
                            <button
                              onClick={() => handleApproveRequest(data._id)}
                              className='apv-btn'
                            >
                              Approve Request
                            </button>
                            </div>
                          </li>
                        </p>
                      )
                  )}
                </ul>
              </div>

              <div className="ApprovedReq">
                <div>
                  <h3>Approved Request</h3>
                  <select
                    name="filter"
                    id="filter"
                    value={selectedValue}
                    onChange={e => {
                      setSelectedValue(e.target.value);
                    }}
                  >
                    <option value="username">Username</option>
                    <option value="companyName">Company Name</option>
                    <option value="stream">Stream</option>
                    <option value="year">Year</option>
                  </select>
                  <input
                    onChange={e => setInputValue(e.target.value)}
                    style={{ width: '20vw' }}
                  />
                  <select
                    name="sort"
                    id="sorter"
                    value={sortBy}
                    onChange={e => {
                      setSortBy(e.target.value);
                    }}
                  >
                    <option>Sort Packages by</option>
                    <option value="high">High to Low</option>
                    <option value="low">Low to Hight</option>
                  </select>
                  <div className="exel-btn-wrap">
                  <button onClick={handleDownloadExcel} className='exel-btn'><SiGooglesheets className='exel'/> Download Excel</button>
                  </div>
                </div>
                <ul>
                  {filteredData.map(
                    (data, index) =>
                      data.approved && (
                        <li key={data._id}>
                          Name: {data.username}, Roll Number: {data.rollNumber},
                          Company Name: {data.companyName}, Year: {data.year},
                          Stream: {data.stream}, Package: {data.salary}/LPA, Status:{' '}
                          {data.approved ? 'Approved' : 'Pending'}
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
                        Status: {submit.approved ? 'Approved' : 'Pending'}
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