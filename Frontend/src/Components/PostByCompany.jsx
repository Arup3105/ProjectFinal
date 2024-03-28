import React, { useEffect, useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { useParams } from "react-router-dom";
import '../Components/PostByCompany.css';

const PostsByCompany = () => {
  const { companyName, startYear, endYear, targetedStreams } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to decode base64 data
  const decodeBase64 = (base64String, type) => {
    try {
      let decodedString;
      if (type === "image") {
        decodedString = base64String;
      } else {
        // Remove data URI prefix
        const base64Data = base64String.split(",")[1];
        // Convert base64 string to ArrayBuffer
        const binaryString = window.atob(base64Data);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        // Create a Blob from ArrayBuffer
        const blob = new Blob([byteArray], { type: "application/pdf" });
        // Return the Blob
        return blob;
      }
      //console.log('Decoded String:', decodedString); // Print decoded result
      return decodedString;
    } catch (error) {
      console.error("Error decoding base64:", error);
      return "Error decoding base64";
    }
  };

  useEffect(() => {
    // Fetch posts for the selected company based on companyName, startYear, and endYear
    ApiService.getPostsByCompany(
      companyName,
      startYear,
      endYear,
      targetedStreams
    )
      .then((data) => {
        if (Array.isArray(data)) {
          // Reverse the order of posts
          setPosts(data.reverse());
          setLoading(false);
        } else if (
          data &&
          data.message &&
          data.message.startsWith("No posts found")
        ) {
          // Handle the case when no posts are found
          setPosts([]); // Set an empty array for posts
          setLoading(false);
        } else {
          // Handle unexpected response
          console.error("Invalid response from the server:", data);
          setError(new Error("Invalid response from the server"));
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching posts:", error);
        setError(error);
        setLoading(false);
      });
  }, [companyName, startYear, endYear, targetedStreams]);

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
          <h4>{post.title}</h4>
          <p>{post.content}</p>
          {/* Displaying attachments */}
          {post.attachments &&
            post.attachments.map((attachment, index) => (
              <div key={index}>
                {attachment.type === "image" && (
                  <img
                    src={decodeBase64(attachment.data, "image")}
                    alt={attachment.fileName}
                  />
                )}
                {attachment.type === "file" && (
                  <div className="download-box">
                    <a
                      href={URL.createObjectURL(
                        new Blob([decodeBase64(attachment.data, "file")], {
                          type: "application/pdf",
                        })
                      )}
                      download={attachment.fileName}
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            ))}
          <p>
            Created at:{" "}
            {new Date(post.createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              timeZone: "UTC", // Timezone is already in IST
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostsByCompany;
