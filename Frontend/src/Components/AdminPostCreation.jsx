import React, { useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import "./AdminPostCreation.css";

const AdminPostCreation = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [company, setCompany] = useState("");
  const [targetedStreams, setTargetedStreams] = useState("");
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
      
      const postData = { title, content, attachments, company, targetedStreams };

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

  return (
    <div className="custom-container">
      <div className="form">
      <form onSubmit={handleAddPost}>
        <div className="input-box">
          
          <input
            type="text"
            id="title"
            value={title}
            required="required"
            onChange={(e) => setTitle(e.target.value)}
          />
          <span>Title</span>
        </div>
        <div className="input-box">
          
          <input
            type="text"
            id="content"
            value={content}
            required="required"
            onChange={(e) => setContent(e.target.value)}
          />
          <span>Content</span>

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
            id="company"
            value={company}
            required="required"
            onChange={(e) => setCompany(e.target.value.toUpperCase())}
          />
          <span>Company Name</span>

        </div>
        <div className="input-box">
            <input
            type="text"
            id="streams"
            value={targetedStreams}
            required="required"
            onChange={(e) =>
              setTargetedStreams(
                e.target.value
                  .split(",")
                  .map((stream) => stream.trim().toUpperCase())
              )
            }
          />
          <span>Stream Name</span>
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
