// PostsByCompany.jsx
import React, { useEffect, useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import { useParams } from "react-router-dom";

const PostsByCompany = () => {
  const { companyName, startYear, endYear } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts for the selected company based on companyName, startYear, and endYear
    ApiService.getPostsByCompany(companyName, startYear, endYear)
      .then((data) => {
        // Reverse the order of posts
        setPosts(data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching posts:", error);
        setError(error);
        setLoading(false);
      });
  }, [companyName, startYear, endYear]);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error fetching posts: {error.message}</div>;
  }

  return (
    <div>
      <h2>Posts for {companyName}</h2>
      {posts.map((post, index) => (
        <div key={index} className="post">
          <h4>{post.title}</h4>
          <p>{post.content}</p>
          <img src={post.imageUrl} alt={post.title} />
          <p>
            Created at:{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

export default PostsByCompany;
