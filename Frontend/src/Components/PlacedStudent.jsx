import React, { useState, useEffect } from 'react';
import ApiService from '../Components/ApiServer/ApiServer';
import * as XLSX from 'xlsx';
import '../Components/PlacedStudent.css';
import { SiGooglesheets } from 'react-icons/si';

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
  const [filterYear, setFilterYear] = useState('all');
  const [streamOptions, setStreamOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [multipleOffers, setMultipleOffers] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const transformedValue =
      name === 'companyName' ? value.toUpperCase() : value; // Convert companyName to uppercase
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

        // Extract stream, company, and year options from the data
        const streams = new Set(response.data.map((item) => item.stream));
        const companies = new Set(response.data.map((item) => item.companyName));
        const years = new Set(response.data.map((item) => item.year));

        setStreamOptions(Array.from(streams));
        setCompanyOptions(Array.from(companies));
        setYearOptions(Array.from(years));
      } else {
        setPlacedData([]);
      }
    } catch (error) {
      console.error('Error fetching placed data:', error);
    }
  };

  const handleApproveRequest = async (postId) => {
    try {
      await ApiService.approveReq(postId);
      setPlacedData((prevData) =>
        prevData.map((data) => {
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
      const approvedData = filteredData.filter((item) => item.approved === true);
      const excludedFields = ['_id', 'userId', 'approved', 'approvedBy', '__v', 'createdAt'];

      const modifiedData = approvedData.map((item) => {
        const newItem = { ...item };
        excludedFields.forEach((field) => delete newItem[field]);
        return newItem;
      });

      const fieldsOrder = ['username', 'stream', 'companyName', 'salary', 'year'];
      const rearrangedData = modifiedData.map((item) => {
        const rearrangedItem = {};
        fieldsOrder.forEach((field) => {
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
      ? placedData.filter((data) =>
        data[selectedValue]?.toLowerCase().includes(inputValue?.toLowerCase())
      )
      : placedData;

  // Filter by year
  if (filterYear !== 'all') {
    filteredData = filteredData.filter((data) => data.year === filterYear);
  }

  // Apply sorting based on selected sort order
  if (sortBy === 'high') {
    filteredData = filteredData.slice().sort((a, b) => b.salary - a.salary);
  } else if (sortBy === 'low') {
    filteredData = filteredData.slice().sort((a, b) => a.salary - b.salary);
  }

  // Count multiple offers for each user
  const countMultipleOffers = () => {
    const offersCount = {};
    placedData.forEach((item) => {
      if (offersCount[item.userId]) {
        offersCount[item.userId]++;
      } else {
        offersCount[item.userId] = 1;
      }
    });
    return offersCount;
  };

  const offersCount = countMultipleOffers();

  return (
    <>
      {isAdmin ? (
        <div className="placed-students">
          {placedData.length > 0 && (
            <div className="data">
              <div className="pendingReq">
                <h3>Pending Request</h3>
                <table className='pending-table'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Company Name</th>
                      <th>Year</th>
                      <th>Stream</th>
                      <th>Package (LPA)</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placedData.map((data) =>
                      !data.approved ? (
                        <tr key={data._id}>
                          <td>{data.username}</td>
                          <td>{data.rollNumber}</td>
                          <td>{data.companyName}</td>
                          <td>{data.year}</td>
                          <td>{data.stream}</td>
                          <td>{data.salary}</td>
                          <td>{data.approved ? 'Approved' : 'Pending'}</td>
                          <td>
                            <button onClick={() => handleApproveRequest(data._id)} className="apv-btn">
                              Approve Request
                            </button>
                          </td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ApprovedReq">
                <div>
                  <h3>Approved Request</h3>
                  <select
                    name="filterYear"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                    <option value="all">All Years</option>
                    {yearOptions.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    name="selectedValue"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="username">Username</option>
                    <option value="stream">Stream</option>
                    <option value="companyName">Company Name</option>
                  </select>
                  {selectedValue === 'username' && (
                    <input className='Search-value'
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Search by Username"
                    />
                  )}
                  {selectedValue === 'stream' && (
                    <select
                      name="stream"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    >
                      <option value="">Select Stream</option>
                      {streamOptions.map((stream, index) => (
                        <option key={index} value={stream}>
                          {stream}
                        </option>
                      ))}
                    </select>
                  )}
                  {selectedValue === 'companyName' && (
                    <select
                      name="companyName"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    >
                      <option value="">Select Company</option>
                      {companyOptions.map((company, index) => (
                        <option key={index} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  )}
                  {selectedValue === 'multipleOffers' && (
                    <p>Total Users with Multiple Offers: {Object.keys(offersCount).filter(key => offersCount[key] > 1).length}</p>
                  )}
                  <select
                    name="sort"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                  >
                    <option>Sort Packages by</option>
                    <option value="high">High to Low</option>
                    <option value="low">Low to High</option>
                  </select>
                  <div className="excel-btn-wrap">
                    <button onClick={handleDownloadExcel} className="excel-btn">
                      <SiGooglesheets className="excel" /> Download Excel
                    </button>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Company Name</th>
                      <th>Year</th>
                      <th>Stream</th>
                      <th>Package (LPA)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((data) =>
                      data.approved ? (
                        <tr key={data._id}>
                          <td>{data.username}</td>
                          <td>{data.rollNumber}</td>
                          <td>{data.companyName}</td>
                          <td>{data.year}</td>
                          <td>{data.stream}</td>
                          <td>{data.salary}</td>
                          <td>{data.approved ? 'Approved' : 'Pending'}</td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='stu-form-main'>
          <form onSubmit={handleSubmit} className='stu-form'>
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              placeholder='companyName'
            />
            <label htmlFor="year">Year:</label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              placeholder='Passing year'
            />
            <label htmlFor="package">Package (LPA):</label>
            <input
              type="number"
              id="package"
              name="package"
              value={formData.package}
              onChange={handleInputChange}
              required
              placeholder='Only Number'
            />
            <button type="submit" className='stu-btn'>Submit</button>
          </form>
          <div className="previous-submits">
            {fetchError ? (
              <div>Error fetching previous submits: {fetchError}</div>
            ) : previousSubmits.length > 0 ? (
              <div>
                <h3>Previous Submits</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Year</th>
                      <th>Stream</th>
                      <th>Package (LPA)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousSubmits.map((submit) => (
                      <tr key={submit._id}>
                        <td>{submit.companyName}</td>
                        <td>{submit.year}</td>
                        <td>{submit.stream}</td>
                        <td>{submit.salary}</td>
                        <td>{submit.approved ? 'Approved' : 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            ) : (
              <div className='stu-pre'>No previous submits.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PlacedStudent;
