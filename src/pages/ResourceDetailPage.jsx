// src/pages/ResourceDetailPage.jsx
// Authors: Timothy Sisa, Alazar Kidane, Adarsh Pandit
// VIEW 5: Resource detail — GET /api/resources/:id, POST /api/resources/:id/rate,
// GET/POST /api/resources/:id/comments, DELETE /api/resources/comments/:commentId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ResourceDetailPage.css";

const API = import.meta.env.VITE_API_URL;

const TYPE_LABELS = {
  lecture_notes: "Lecture Notes",
  past_paper: "Past Paper",
  study_guide: "Study Guide",
  other: "Other",
};

function ResourceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingMsg, setRatingMsg] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetches resource details and comments on mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Maps to GET /api/resources/:id
        const resRes = await fetch(`${API}/api/resources/${id}`, { credentials: "include" });
        const resData = await resRes.json();
        if (!resRes.ok) throw new Error(resData.error);
        setResource(resData.resource);

        // Maps to GET /api/resources/:id/comments
        const commRes = await fetch(`${API}/api/resources/${id}/comments`, { credentials: "include" });
        const commData = await commRes.json();
        if (commRes.ok) setComments(commData.comments);
      } catch (err) {
        setError(err.message || "Failed to load resource.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Maps to POST /api/resources/:id/rate
  const handleRate = async () => {
    if (!user) return navigate("/login");
    if (selectedRating === 0) { setRatingMsg("Please select a star rating."); return; }
    try {
      const res = await fetch(`${API}/api/resources/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: selectedRating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRatingMsg(`Rating submitted! New average: ${data.averageRating}`);
      setResource((prev) => ({ ...prev, averageRating: data.averageRating }));
    } catch (err) {
      setRatingMsg(err.message || "Could not submit rating.");
    }
  };

  // Maps to POST /api/resources/:id/comments
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    if (!user) return navigate("/login");
    if (commentBody.trim().length === 0) { setCommentError("Comment cannot be empty."); return; }
    if (commentBody.length > 1000) { setCommentError("Comment cannot exceed 1000 characters."); return; }
    setCommentLoading(true);
    try {
      const res = await fetch(`${API}/api/resources/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: commentBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) => [...prev, data.comment]);
      setCommentBody("");
    } catch (err) {
      setCommentError(err.message || "Could not post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Maps to DELETE /api/resources/comments/:commentId
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${API}/api/resources/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return;
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  if (loading) return <div className="detail-page"><p className="status-msg">Loading resource...</p></div>;
  if (error) return <div className="detail-page"><p className="status-msg error">{error}</p></div>;
  if (!resource) return null;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <span className="detail-badge">{TYPE_LABELS[resource.resourceType]}</span>
        <h1 className="detail-title">{resource.title}</h1>
        <p className="detail-category">{resource.category}</p>
        <p className="detail-meta">
          Uploaded by <strong>{resource.uploadedBy?.username}</strong> ·
          ★ {resource.averageRating > 0 ? resource.averageRating.toFixed(1) : "No ratings"} ·
          {resource.viewCount} views
        </p>
      </div>

      <div className="detail-section">
        <h2>About this resource</h2>
        <p>{resource.description}</p>
      </div>

      {/* Maps to GET /api/resources/:id/file */}
      <div className="detail-section">
        <a href={`${API}/api/resources/${id}/file`} className="btn-download" target="_blank" rel="noreferrer">
          ⬇ Download {resource.originalFileName}
        </a>
      </div>

      <div className="detail-section">
        <h2>Rate this Resource</h2>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} className={`star ${selectedRating >= star ? "star-active" : ""}`}
              onClick={() => setSelectedRating(star)}>★</button>
          ))}
        </div>
        <button className="btn-rate" onClick={handleRate}>Submit Rating</button>
        {ratingMsg && <p className="rating-msg">{ratingMsg}</p>}
      </div>

      <div className="detail-section">
        <h2>Comments ({comments.length})</h2>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea placeholder="Share your thoughts on this resource..."
              value={commentBody} onChange={(e) => setCommentBody(e.target.value)} rows={3} maxLength={1000} />
            {commentError && <span className="field-error">{commentError}</span>}
            <button type="submit" className="btn-comment" disabled={commentLoading}>
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="login-prompt"><a href="/login">Log in</a> to leave a comment.</p>
        )}
        <div className="comment-list">
          {comments.length === 0 && <p className="no-comments">No comments yet. Be the first!</p>}
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.author?.username}</strong>
                <span className="comment-role">{comment.author?.role}</span>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="comment-body">{comment.body}</p>
              {user && (user.username === comment.author?.username || user.role === "lecturer") && (
                <button className="btn-delete-comment" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailPage;
