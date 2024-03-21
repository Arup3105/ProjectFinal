import React, { useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import "./AdminPostCreation.css";

const AdminPostCreation = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]); // Update state to hold attachments
  const [company, setCompany] = useState("");
  const [targetedStreams, setTargetedStreams] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      if (!title || !content || !company || !targetedStreams) {
        setError("Title, content, company, and targeted streams cannot be empty.");
        return;
      }

      setLoading(true); // Set loading to true when the request starts
      
      const postData = { title, content, attachments, company, targetedStreams };

      const response = await ApiService.createPost(postData);

      if (response.status === 201) {
        setMessage("Post created successfully");
        setTimeout(() => {
          window.location.href = "/feed"; // Redirect to feed page
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error creating post:", error);
    } finally {
      setLoading(false); // Set loading to false when the request finishes
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
        // Verify if reader.result looks like a valid base64 string
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
    <div>
      <form onSubmit={handleAddPost}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <input
            type="text"
            id="content"
            placeholder="Enter Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="attachment">Attachment</label>
          <input type="file" id="attachment" onChange={handleFileChange} multiple />
        </div>
        {attachments.map((attachment, index) => (
          <div key={index}>
            <img src={attachment.data} alt={attachment.fileName} style={{ maxWidth: "100px" }} />
            <button type="button" onClick={() => handleRemoveAttachment(index)}>Remove</button>
          </div>
        ))}
        <div>
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            id="company"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label htmlFor="streams">Targeted Streams</label>
          <input
            type="text"
            id="streams"
            placeholder="Enter Targeted Streams (comma-separated)"
            value={targetedStreams}
            onChange={(e) =>
              setTargetedStreams(
                e.target.value
                  .split(",")
                  .map((stream) => stream.trim().toUpperCase())
              )
            }
          />
        </div>
        <button type="submit">Add Post</button>
      </form>
      {loading && <p style={{ color: "blue" }}>This may take a while. Please wait...</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminPostCreation;
