import React, { useEffect, useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { useParams } from "react-router-dom";
import "../Components/PostByCompany.css";

const PostsByCompany = () => {
  const { companyName, startYear, endYear, targetedStreams } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPostId, setEditPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [formData, setFormData] = useState({});
  const [formDataValues, setFormDataValues] = useState({});
  const [error, setError] = useState(null);
  const [formField ,setFormField]=useState({});

  const decodeBase64 = (base64String, type) => {
    try {
      let decodedString;
      if (type === "image") {
        decodedString = base64String;
      } else {
        const base64Data = base64String.split(",")[1];
        const binaryString = window.atob(base64Data);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: "application/pdf" });
        return blob;
      }

      return decodedString;
    } catch (error) {
      console.error("Error decoding base64:", error);
      return "Error decoding base64";
    }
  };

  useEffect(() => {
    ApiService.getPostsByCompany(
      companyName,
      startYear,
      endYear,
      targetedStreams
    )
    .then((data) => {
      if (Array.isArray(data)) {
        setPosts(data.reverse());
        setLoading(false);
        
        // Extracting keys from formData object and storing as an object in formField
        const formFieldKeys = {};
        data.forEach((post) => {
          const formField = post.formData || {};
          Object.keys(formField).forEach((fieldName) => {
            formFieldKeys[fieldName] = true;
          });
        });
        setFormField(formFieldKeys);

        } else if (
          data &&
          data.message &&
          data.message.startsWith("No posts found")
        ) {
          setPosts([]);
          setLoading(false);
        } else {
          console.error("Invalid response from the server:", data);
          setError(new Error("Invalid response from the server"));
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError(error);
        setLoading(false);
      });
  }, [companyName, startYear, endYear, targetedStreams]);

  const handleEditPost = async () => {
    if (window.confirm("Are you sure you want to edit this post?"))
      try {
        await ApiService.editPost(editPostId, {
          content: editedContent,
          title: editedTitle,
        });
        setEditPostId(null);
        setEditedContent("");
        ApiService.getPostsByCompany(
          companyName,
          startYear,
          endYear,
          targetedStreams
        ).then((data) => {
          if (Array.isArray(data)) {
            setPosts(data.reverse());
          }
        });
        alert("Post edited successfully.");
      } catch (error) {
        console.error("Error editing post:", error);
        alert("Error editing post.");
      }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?"))
      try {
        await ApiService.deletePost(postId);
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully.");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Error deleting post.");
      }
  };

  const handleEditButtonClick = (postId, title, content) => {
    setEditPostId(postId);
    setEditedTitle(title);
    setEditedContent(content);
  };

  const handleSaveButtonClick = () => {
    handleEditPost();
    setEditPostId(null);
  };

  const handleFormSubmitClick = async () => {
    try {
      const formDataToSend = {};
      // Construct the formDataToSend object with field names and values
      Object.keys(formDataValues).forEach((fieldName) => {
        formDataToSend[fieldName] = formDataValues[fieldName];
      });
      // Send a request to the API server to submit the form data
      console.log(formDataToSend);
      await ApiService.formSubmit(formDataToSend);
      alert("Form submitted successfully.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };

  const handleFormInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormDataValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error fetching posts: {error.message}</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found for the specified company and session</div>;
  }

  return (
    <div className="posts-container">
      <h2>Posts for {companyName}</h2>
      {posts.map((post, index) => (
        <div key={index} className="post">
          {localStorage.getItem("isAdmin") === "true" && (
            <div className="admin-buttons">
              {editPostId === post._id ? (
                <>
                  <button onClick={handleSaveButtonClick}>Save</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleEditButtonClick(post._id, post.title, post.content)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
          {editPostId === post._id ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            </>
          ) : (
            <>
              <h4>{post.title}</h4>
              <p>{post.content}</p>
            </>
          )}
          <p>Created by: {post.CreatedBy?.adminName || "Unknown"}</p>
          {post.attachments &&
            post.attachments.map((attachment, index) => (
              <div key={index}>
                {attachment.type === "image" && (
                  <div className="image-box">
                    <img
                      src={decodeBase64(attachment.data, "image")}
                      alt={attachment.fileName}
                    />
                    {/* Download button for images */}
                    <div className="download-box">
                      <a
                        href={decodeBase64(attachment.data, "image")}
                        download={attachment.fileName}
                      >
                        Download Image
                      </a>
                    </div>
                  </div>
                )}
                {attachment.type === "file" && (
                  <div className="download-box">
                    <span>{attachment.fileName}</span>
                    <a
                      href={URL.createObjectURL(
                        new Blob([decodeBase64(attachment.data, "file")], {
                          type: "application/pdf",
                        })
                      )}
                      download={attachment.fileName}
                    >
                      {/* PDF icon */}
                      <img
                        src="/pdf-icorn.png"
                        alt="PDF icon"
                        style={{
                          width: "32px",
                          height: "32px",
                          marginRight: "8px",
                        }}
                      />
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          

            {!localStorage.getItem("isAdmin") && (
              <div className="form-container">
                <h2>Form for Interested Student</h2>
                <form>
                  {Object.keys(formField).map((fieldName) => (
                    <div key={fieldName}>
                      <label htmlFor={fieldName}>{fieldName}</label>
                      <input
                        type="text"
                        id={fieldName}
                        name={fieldName}
                        value={formDataValues[fieldName] || ""}
                        onChange={(e) => handleFormInputChange(e, fieldName)}
                      />
                    </div>
                  ))}
                  <button onClick={handleFormSubmitClick}>Save Form</button>
                </form>
              </div>
            )}
          
          <p>
            Created at:{" "}
            {new Date(post.createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              timeZone: "UTC",
            })}
          </p>
          <p>
            Updated at:{" "}
            {new Date(post.updatedAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              timeZone: "UTC",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostsByCompany;
