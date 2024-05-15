import React, { useState } from "react";
import "../Components/register.css";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [tenthMarks, setTenthMarks] = useState("");
  const [tenthMarkSheet, setTenthMarkSheet] = useState(null);
  const [twelfthMarks, setTwelfthMarks] = useState("");
  const [twelfthMarkSheet, setTwelfthMarkSheet] = useState(null);
  const [cgpa, setCGPA] = useState("");
  const [firstSemMarkSheet, setFirstSemMarkSheet] = useState(null);
  const [secondSemMarkSheet, setSecondSemMarkSheet] = useState(null);
  const [thirdSemMarkSheet, setThirdSemMarkSheet] = useState(null);
  const [fourthSemMarkSheet, setFourthSemMarkSheet] = useState(null);
  const [fifthSemMarkSheet, setFifthSemMarkSheet] = useState(null);
  const [sixthSemMarkSheet, setSixthSemMarkSheet] = useState(null);
  const [cv, setCV] = useState(null);
  const [stream, setStream] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState("");

  // const fileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2MB limit.");
        e.target.value = null; // Reset the file input to clear the selected file
        return;
      }
      setError(""); // Clear any previous error
      setter(file); // Set the file to state
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (
        !name ||
        !rollNumber ||
        !password ||
        !email ||
        !mobileNumber ||
        !tenthMarks ||
        !tenthMarkSheet ||
        !twelfthMarks ||
        !twelfthMarkSheet ||
        !firstSemMarkSheet ||
        !secondSemMarkSheet ||
        !cv ||
        !secretCode ||
        !stream
      ) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!/^323\d{8}$/.test(rollNumber)) {
        setError("Roll number must be 11 digits and start with '323'.");
        return;
      }

      if (!/^\d{15}$/.test(regNumber)) {
        setError("Registration number must be exactly 15 digits.");
        return;
      }

      if (!/^\d{10}$/.test(mobileNumber)) {
        setError("Mobile number must be exactly 10 digits.");
        return;
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(password)) {
        setError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
        );
        return;
      }

      if (!/.{6}/.test(secretCode)) {
        setError("SecretCode must be exactly 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const tenthMarksFloat = parseFloat(tenthMarks);
      if (
        isNaN(tenthMarksFloat) ||
        tenthMarksFloat < 0 ||
        tenthMarksFloat > 100
      ) {
        setError("Tenth marks must be between 0 and 100.");
        return;
      }

      const twelfthMarksFloat = parseFloat(twelfthMarks);
      if (
        isNaN(twelfthMarksFloat) ||
        twelfthMarksFloat < 0 ||
        twelfthMarksFloat > 100
      ) {
        setError("Twelfth marks must be between 0 and 100.");
        return;
      }

      const cgpaFloat = parseFloat(cgpa);
      if (isNaN(cgpaFloat) || cgpaFloat < 0 || cgpaFloat > 10) {
        setError("CGPA must be between 0 and 10.");
        return;
      }

      if (!/^[a-zA-Z\s]+$/.test(name)) {
        setError("Username can only contain alphabetic characters and spaces.");
        return;
      }

      const formData = new FormData();

      if (photo) {
        formData.append("photo", photo);
      }
      formData.append("tenthMarks", tenthMarks);
      if (tenthMarkSheet) {
        formData.append("tenthMarkSheet", tenthMarkSheet);
      }
      formData.append("twelfthMarks", twelfthMarks);
      if (twelfthMarkSheet) {
        formData.append("twelfthMarkSheet", twelfthMarkSheet);
      }
      if (firstSemMarkSheet) {
        formData.append("firstSemMarkSheet", firstSemMarkSheet);
      }
      if (secondSemMarkSheet) {
        formData.append("secondSemMarkSheet", secondSemMarkSheet);
      }
      if (thirdSemMarkSheet) {
        formData.append("thirdSemMarkSheet", thirdSemMarkSheet);
      }
      if (fourthSemMarkSheet) {
        formData.append("fourthSemMarkSheet", fourthSemMarkSheet);
      }
      if (fifthSemMarkSheet) {
        formData.append("fifthSemMarkSheet", fifthSemMarkSheet);
      }
      if (sixthSemMarkSheet) {
        formData.append("sixthSemMarkSheet", sixthSemMarkSheet);
      }
      if (cv) {
        formData.append("cv", cv);
      }
      formData.append("name", name);
      formData.append("rollNumber", rollNumber);
      formData.append("regNumber", regNumber);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      formData.append("address", address);
      formData.append("stream", stream);
      formData.append("cgpa", cgpa);
      formData.append("secretCode", secretCode);

      setError("Creating your account. Please wait...");
      console.log(Object.fromEntries(formData));
      const response = await ApiService.register(formData);

      if (response && response.token) {
        localStorage.clear();
        navigate("/Login");
        setError("");
      } else {
        setError("Something Went Wrong");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div>
      <main>
        <div className="container">
          <div className="form">
            <form onSubmit={handleRegister}>
              <h2>Register Here</h2>
              <div className="formstyle">
                <div className="username">
                  <div className="name">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Your Name Here"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="name"
                      name="name"
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="numbers">
                  <div className="roll">
                    <label htmlFor="rollNumber">Roll Number</label>
                    <input
                      type="number"
                      placeholder="Enter Your Roll Number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      id="rollNumber"
                      name="rollNumber"
                    />
                  </div>
                  <div className="reg">
                    <label htmlFor="regNumber">Reg Number</label>
                    <input
                      type="number"
                      placeholder="Enter Your Reg Number"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      id="regNumber"
                      name="regNumber"
                    />
                  </div>
                </div>
                <div className="contact">
                  <div className="email">
                    <label htmlFor="email">Email ID</label>
                    <input
                      type="email"
                      placeholder="Enter Your Email ID Here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      name="email"
                      autoComplete="email"
                    />
                  </div>
                  <div className="phone">
                    <label htmlFor="mobileNumber">Phone No</label>
                    <input
                      type="number"
                      placeholder="Enter Your Phone Number Here"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      id="mobileNumber"
                      name="mobileNumber"
                    />
                  </div>
                </div>
                <div className="photo">
                  <label htmlFor="photo">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    id="photo"
                    name="photo"
                  />
                </div>
                <div className="cgpa">
                  <label htmlFor="cgpa">CGPA</label>
                  <input
                    type="text"
                    placeholder="Enter Your CGPA Here"
                    value={cgpa}
                    onChange={(e) => setCGPA(e.target.value)}
                    id="cgpa"
                    name="cgpa"
                  />
                </div>
                <div className="cv">
                  <label htmlFor="cv">CV</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCV(e.target.files[0])}
                    id="cv"
                    name="cv"
                  />
                </div>
                <div className="stream">
                  <label htmlFor="stream">Select Stream </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    id="stream"
                    name="stream"
                  >
                    <option value="">Select Stream</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="BBA(H.M)">BBA (H.M)</option>
                    <option value="BBA(Supply Chain)">
                      BBA (Supply Chain)
                    </option>
                    <option value="Optometry">Optometry</option>
                    <option value="Lab Technology">Lab Technology</option>
                  </select>
                </div>
                <div className="address">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    placeholder="Enter Your Address Here"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    id="address"
                    name="address"
                    autoComplete="address-line1"
                  />
                </div>
                <div className="tenth">
                  <div className="marks">
                    <label htmlFor="tenthMarks">10th Marks</label>
                    <input
                      type="number"
                      placeholder="10th Marks % Here"
                      value={tenthMarks}
                      onChange={(e) => setTenthMarks(e.target.value)}
                      id="tenthMarks"
                      name="tenthMarks"
                    />
                  </div>
                  <div className="marksheet">
                    <label htmlFor="tenthMarkSheet">10th Marksheet</label>
                    <input
                      type="file"
                      accept="image/*,"
                      onChange={(e) => setTenthMarkSheet(e.target.files[0])}
                      id="tenthMarkSheet"
                      name="tenthMarkSheet"
                    />
                  </div>
                </div>
                <div className="twelve">
                  <div className="marks">
                    <label htmlFor="twelfthMarks">12th Marks</label>
                    <input
                      type="number"
                      placeholder="12th Marks % Here"
                      value={twelfthMarks}
                      onChange={(e) => setTwelfthMarks(e.target.value)}
                      id="twelfthMarks"
                      name="twelfthMarks"
                    />
                  </div>
                  <div className="marksheet">
                    <label htmlFor="twelfthMarkSheet">12th Marksheet</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTwelfthMarkSheet(e.target.files[0])}
                      id="twelfthMarkSheet"
                      name="twelfthMarkSheet"
                    />
                  </div>
                </div>
                <div className="sem-marks">
                  <div className="first">
                    <label htmlFor="firstSemMarkSheet">
                      First Sem Marksheet
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFirstSemMarkSheet(e.target.files[0])}
                      id="firstSemMarkSheet"
                      name="firstSemMarkSheet"
                    />
                  </div>
                  <div className="second">
                    <label htmlFor="secondSemMarkSheet">
                      Second Sem Marksheet
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSecondSemMarkSheet(e.target.files[0])}
                      id="secondSemMarkSheet"
                      name="secondSemMarkSheet"
                    />
                  </div>
                  <div className="third">
                    <label htmlFor="thirdSemMarkSheet">
                      Third Sem Marksheet
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThirdSemMarkSheet(e.target.files[0])}
                      id="thirdSemMarkSheet"
                      name="thirdSemMarkSheet"
                    />
                  </div>
                  <div className="fourth">
                    <label htmlFor="fourthSemMarkSheet">
                      Fourth Sem Marksheet
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFourthSemMarkSheet(e.target.files[0])}
                      id="fourthSemMarkSheet"
                      name="fourthSemMarkSheet"
                    />
                  </div>
                  <div className="fifth">
                    <label htmlFor="fifthSemMarkSheet">
                      Fifth Sem Marksheet
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFifthSemMarkSheet(e.target.files[0])}
                      id="fifthSemMarkSheet"
                      name="fifthSemMarkSheet"
                    />
                  </div>
                  <div className="sixth">
                    <label htmlFor="sixthSemMarkSheet">
                      Sixth Sem Marksheet
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSixthSemMarkSheet(e.target.files[0])}
                      id="sixthSemMarkSheet"
                      name="sixthSemMarkSheet"
                    />
                  </div>
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                  />
                </div>
                <div className="Re-password">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    name="confirmPassword"
                  />
                </div>
                <div className="Secret-Code">
                  <label htmlFor="secretCode">Secret Code</label>
                  <input
                    type="password"
                    placeholder="Secret Code"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    id="secretCode"
                    name="secretCode"
                  />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="reg-btn">
                  <button type="submit">Register</button> <br />
                </div>

                <p>
                  Already have an account{" "}
                  <Link to="/Login" className="signin">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
