import React, { useState, useEffect } from "react";
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
        setError(
          "Title, content, company, and targeted streams cannot be empty."
        );
        return;
      }

      setLoading(true);

      let postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("company", company);
      postData.append("targetedStreams", targetedStreams.join(","));

      attachments.forEach((file, index) => {
        //console.log("File appended:", file); // Add this line
        postData.append(`attachments`, file);
      });
      const formDataString = JSON.stringify(formData);
      postData.append("formData", formDataString);
      console.log("Payload:", Object.fromEntries(postData));
      //const payload=Object.fromEntries(postData);
      // console.log("payload",payload);
      console.log("postdata direct", postData);
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

  useEffect(() => {
    console.log("Attachments:", attachments);
  }, [attachments]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected Files:", files);
    const updatedAttachments = [...attachments, ...files];
    console.log("Updated Attachments:", updatedAttachments);
    setAttachments(updatedAttachments);
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
    const updatedFields = formFields.filter((field) => field !== fieldName);
    const updatedFormData = { ...formData };
    delete updatedFormData[fieldName];
    setFormFields(updatedFields);
    setFormData(updatedFormData);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleCheckboxChange = (stream, checked) => {
    if (checked) {
      setTargetedStreams([...targetedStreams, stream]);
    } else {
      setTargetedStreams(targetedStreams.filter((item) => item !== stream));
    }
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
            <input
              type="file"
              id="attachment"
              onChange={handleFileChange}
              multiple
            />
          </div>
          {attachments.map((attachment, index) => (
            <div key={index}>
              <span>{attachment.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(index)}
                className="remove-btn"
              >
                Remove
              </button>
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
          <div className="input-check-box">
            <label>
              <input
                type="checkbox"
                checked={targetedStreams.includes("BCA")} // Assuming targetedStreams is an array of selected streams
                onChange={(e) => handleCheckboxChange("BCA", e.target.checked)} // Handle checkbox change for BCA stream
              />
              BCA
            </label>
            <label>
              <input
                type="checkbox"
                checked={targetedStreams.includes("BBA")}
                onChange={(e) => handleCheckboxChange("BBA", e.target.checked)}
              />
              BBA
            </label>
            <label>
              <input
                type="checkbox"
                checked={targetedStreams.includes("BBA(H.M)")}
                onChange={(e) =>
                  handleCheckboxChange("BBA(H.M)", e.target.checked)
                }
              />
              BBA (H.M)
            </label>
            <label>
              <input
                type="checkbox"
                checked={targetedStreams.includes("BBA(Supply Chain)")}
                onChange={(e) =>
                  handleCheckboxChange("BBA(Supply Chain)", e.target.checked)
                }
              />
              BBA (Supply Chain)
            </label>
            <label>
              <input
                type="checkbox"
                checked={targetedStreams.includes("Optometry")}
                onChange={(e) =>
                  handleCheckboxChange("Optometry", e.target.checked)
                }
              />
              Optometry
            </label>
            <label>
              <input
                type="checkbox"
                checked={targetedStreams.includes("Lab Technology")}
                onChange={(e) =>
                  handleCheckboxChange("Lab Technology", e.target.checked)
                }
              />
              Lab Technology
            </label>
          </div>

          <div className="willingness-form">
            <p style={{ color: "black" }}>Willingness Form</p>
            {formFields.map((fieldName, index) => (
              <div key={index} className="input-box">
                <input
                  type="text"
                  value={formData[fieldName] || ""}
                  onChange={(e) => handleInputChange(fieldName, e.target.value)}
                  placeholder={fieldName}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(fieldName)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddField}>
              Add Field
            </button>
          </div>
          <button type="submit">Add Post</button>
        </form>
        {loading && (
          <p style={{ color: "blue" }}>This may take a while. Please wait...</p>
        )}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminPostCreation;
