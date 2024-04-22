import React, { useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import "./AdminPostCreation.css";

const AdminPostCreation = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [company, setCompany] = useState("");
  const [targetedStreams, setTargetedStreams] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      if (!title || !content || !company || !targetedStreams) {
        setError("Title, content, company, and targeted streams cannot be empty.");
        return;
      }

      setLoading(true);
      
      const postData = { title, content, attachments, company, targetedStreams, userForm: formData };

      const response = await ApiService.createPost(postData);

      if (response.status === 201) {
        setMessage("Post created successfully");
        setTimeout(() => {
          window.location.href = "/feed";
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    try {
      const base64Files = await Promise.all(selectedFiles.map(fileToBase64));
      setAttachments(base64Files);
    } catch (error) {
      setError("Failed to read files");
      console.error("Error reading files:", error);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        console.log("Base64 string:", reader.result);
        resolve({ data: reader.result, fileName: file.name });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const handleAddField = () => {
    const fieldName = prompt("Enter field name:");
    if (fieldName) {
      setFormFields([...formFields, fieldName]);
      setFormData({ ...formData, [fieldName]: "" });
    }
  };

  const handleRemoveField = (fieldName) => {
    const updatedFields = formFields.filter(field => field !== fieldName);
    const updatedFormData = { ...formData };
    delete updatedFormData[fieldName];
    setFormFields(updatedFields);
    setFormData(updatedFormData);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  return (
    <div className="custom-container">
      <div className="form">
        <form onSubmit={handleAddPost}>
          <div className="input-box">
            <input
              type="text"
              value={title}
              required="required"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={content}
              required="required"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
          </div>
          <div className="input-box">
            <label htmlFor="attachment">Attachment</label>
            <input type="file" id="attachment" onChange={handleFileChange} multiple />
          </div>
          {attachments.map((attachment, index) => (
            <div key={index}>
              <img src={attachment.data} alt={attachment.fileName} style={{ maxWidth: "100px" }} />
              <button type="button" onClick={() => handleRemoveAttachment(index)}>Remove</button>
            </div>
          ))}
          <div className="input-box">
            <input
              type="text"
              value={company}
              required="required"
              onChange={(e) => setCompany(e.target.value.toUpperCase())}
              placeholder="Company Name"
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={targetedStreams}
              required="required"
              onChange={(e) =>
                setTargetedStreams(
                  e.target.value
                    .split(",")
                    .map((stream) => stream.trim().toUpperCase())
                )
              }
              placeholder="Stream Name"
            />
          </div>
          <div className="willingness-form">
            <p style={{color: "black"}}>Willingness Form</p>
          {formFields.map((fieldName, index) => (
            <div key={index} className="input-box">
              <input
                type="text"
                value={formData[fieldName] || ""}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                placeholder={fieldName}
              />
              <button type="button" onClick={() => handleRemoveField(fieldName)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddField}>Add Field</button>
          </div>
          <button type="submit">Add Post</button>
        </form>
        {loading && <p style={{ color: "blue" }}>This may take a while. Please wait...</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminPostCreation;
