import React, { useState } from "react";
import "../Components/register.css";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { Link, useNavigate} from "react-router-dom";

const Register = () => {

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
  const [error, setError] = useState("");

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
        !thirdSemMarkSheet ||
        !cv ||
        !stream
      ) {
        setError("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("rollNumber", rollNumber);
      formData.append("regNumber", regNumber);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      formData.append("address", address);
      if (photo) {
        formData.append("photo", await compressAndConvertToBase64(photo));
      }
      formData.append("tenthMarks", tenthMarks);
      if (tenthMarkSheet) {
        formData.append("tenthMarkSheet", await compressAndConvertToBase64(tenthMarkSheet));
      }
      formData.append("twelfthMarks", twelfthMarks);
      if (twelfthMarkSheet) {
        formData.append("twelfthMarkSheet", await compressAndConvertToBase64(twelfthMarkSheet));
      }
      if (firstSemMarkSheet) {
        formData.append("firstSemMarkSheet", await compressAndConvertToBase64(firstSemMarkSheet));
      }
      if (secondSemMarkSheet) {
        formData.append("secondSemMarkSheet", await compressAndConvertToBase64(secondSemMarkSheet));
      }
      if (thirdSemMarkSheet) {
        formData.append("thirdSemMarkSheet", await compressAndConvertToBase64(thirdSemMarkSheet));
      }
      if (fourthSemMarkSheet) {
        formData.append("fourthSemMarkSheet", await compressAndConvertToBase64(fourthSemMarkSheet));
      }
      if (fifthSemMarkSheet) {
        formData.append("fifthSemMarkSheet", await compressAndConvertToBase64(fifthSemMarkSheet));
      }
      if (sixthSemMarkSheet) {
        formData.append("sixthSemMarkSheet", await compressAndConvertToBase64(sixthSemMarkSheet));
      }
      if (cv) {
        formData.append("cv", await compressAndConvertToBase64(cv));
      }
      formData.append("stream", stream);
      formData.append("cgpa", cgpa);

      const response = await ApiService.register(formData);

      if (response && response.token) {
        localStorage.clear();
        localStorage.setItem("jwtToken", response.token);
        navigate('/Login');
        setError("");
      } else {
        setError("Token not received from the server");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Failed to register user");
      }
    }
  };

  const compressAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        if (file.type.startsWith('image')) {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;
  
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
  
            canvas.toBlob((blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
  
              const compressedReader = new FileReader();
              compressedReader.readAsDataURL(compressedFile);
              compressedReader.onloadend = () => {
                resolve(compressedReader.result);
              };
            }, 'image/jpeg', 0.8);
          };
          img.onerror = (error) => {
            reject(error);
          };
        } else if (file.type === 'application/pdf') {
          resolve(event.target.result);
        } else {
          reject(new Error('Unsupported file type'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
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
                  <label htmlFor="stream">Stream</label>
                  <input
                    type="text"
                    placeholder="Enter Your Stream Here"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    id="stream"
                    name="stream"
                  />
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
                      placeholder="10th Marks Here"
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
                      accept="image/*, .pdf"
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
                      placeholder="12th Marks Here"
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
                      accept="image/*, .pdf"
                      onChange={(e) => setTwelfthMarkSheet(e.target.files[0])}
                      id="twelfthMarkSheet"
                      name="twelfthMarkSheet"
                    />
                  </div>
                </div>
                <div className="sem-marks">
                  <div className="first">
                    <label htmlFor="firstSemMarkSheet">First Sem Marksheet</label>
                    <input
                      type="file"
                      accept="image/*, .pdf"
                      onChange={(e) => setFirstSemMarkSheet(e.target.files[0])}
                      id="firstSemMarkSheet"
                      name="firstSemMarkSheet"
                    />
                  </div>
                  <div className="second">
                    <label htmlFor="secondSemMarkSheet">Second Sem Marksheet</label>
                    <input
                      type="file"
                      accept="image/*, .pdf"
                      onChange={(e) => setSecondSemMarkSheet(e.target.files[0])}
                      id="secondSemMarkSheet"
                      name="secondSemMarkSheet"
                    />
                  </div>
                  <div className="third">
                    <label htmlFor="thirdSemMarkSheet">Third Sem Marksheet</label>
                    <input
                      type="file"
                      accept="image/*, .pdf"
                      onChange={(e) => setThirdSemMarkSheet(e.target.files[0])}
                      id="thirdSemMarkSheet"
                      name="thirdSemMarkSheet"
                    />
                  </div>
                  <div className="fourth">
                    <label htmlFor="fourthSemMarkSheet">Fourth Sem Marksheet</label>
                    <input
                      type="file"
                      accept="image/*, .pdf"
                      onChange={(e) => setFourthSemMarkSheet(e.target.files[0])}
                      id="fourthSemMarkSheet"
                      name="fourthSemMarkSheet"
                    />
                  </div>
                  <div className="fifth">
                    <label htmlFor="fifthSemMarkSheet">Fifth Sem Marksheet</label>
                    <input
                      type="file"
                      accept="image/*, .pdf"
                      onChange={(e) => setFifthSemMarkSheet(e.target.files[0])}
                      id="fifthSemMarkSheet"
                      name="fifthSemMarkSheet"
                    />
                  </div>
                  <div className="sixth">
                    <label htmlFor="sixthSemMarkSheet">Sixth Sem Marksheet</label>
                    <input
                      type="file"
                      accept="image/*, .pdf"
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="reg-btn">
                  <button type="submit">Register</button> <br />
                  
                </div>
                
                <p>
                  Already have an account{" "}
                  <Link to="/" className="signin">
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
