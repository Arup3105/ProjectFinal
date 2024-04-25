import React, { useEffect, useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { useParams } from "react-router-dom";
import "../Components/PostByCompany.css";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

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
  const [formField, setFormField] = useState({});

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
      editPostId,
        Object.keys(formDataValues).forEach((fieldName) => {
          formDataToSend[fieldName] = formDataValues[fieldName];
        });
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
                  <button onClick={handleSaveButtonClick} className="save-btn">
                    Save
                  </button>
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
                {typeof attachment === "string" &&
                (attachment.toLowerCase().endsWith(".jpg")|| attachment.toLowerCase().endsWith(".jpeg")|| attachment.toLowerCase().endsWith(".png")) ? (
                  <div className="image-box">
                    <img src={attachment} alt={`Image ${index}`} />
                    {/* Download button for images */}
                    <div className="download-box">
                      <a href={attachment} target="_blank" rel="noreferrer">
                        View
                      </a>
                      <a href={attachment} download>
                        Download Image
                      </a>
                    </div>
                  </div>
                ) : typeof attachment === "string" &&
                  attachment.toLowerCase().endsWith(".pdf") ? (
                  <div className="download-box">
                    <span>{attachment}</span>
                    <a href={attachment} download>
                      {/* PDF icon */}
                      <img
                        src="/pdf-icon.png"
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
                ) : null}
              </div>
            ))}

          {localStorage.getItem("isAdmin") &&
            post.formData &&
            Object.keys(post.formData).length > 0 && (
              <div className="form-container">
                <h2>Form Attached</h2>
                <form>
                  {Object.keys(post.formData).map((fieldName) => (
                    <div key={fieldName}>
                      <label htmlFor={fieldName}>{fieldName}</label>
                    </div>
                  ))}
                </form>
              </div>
            )}

          {!localStorage.getItem("isAdmin") && post.formData && (
            <div className="form-container">
              <h2>Form for Interested Student</h2>

              <form>
                {Object.keys(formField).map((fieldName) =>
                  post.formData[fieldName] !== undefined ? (
                    <div key={`${post._id}-${fieldName}`}>
                      <label htmlFor={fieldName}>{fieldName}</label>

                      <input
                        type="text"
                        id={fieldName}
                        name={fieldName}
                        value={
                          (formDataValues[post._id] &&
                            formDataValues[post._id][fieldName]) ||
                          ""
                        }
                        onChange={(e) => handleFormInputChange(e, fieldName)}
                      />
                    </div>
                  ) : null
                )}

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
