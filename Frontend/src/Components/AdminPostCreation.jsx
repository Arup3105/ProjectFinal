import React, { useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import "./AdminPostCreation.css";

const AdminPostCreation = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [company, setCompany] = useState("");
  const [targetedStreams, setTargetedStreams] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const postData = { title, content, files, company, targetedStreams };

      const response = await ApiService.createPost(postData);

      if (response.status === 201) {
        setMessage("Post created successfully");
        setTimeout(() => {
          window.location.href = "/feed";
        }, 5000);
      }
    } catch (error) {
      setError("Failed to create post");
      console.error("Error creating post:", error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    try {
      const base64Files = await Promise.all(selectedFiles.map(fileToBase64));
      setFiles(base64Files);
    } catch (error) {
      setError("Failed to read files");
      console.error("Error reading files:", error);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminPostCreation;
