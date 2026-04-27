// src/pages/ResourceDetailPage.jsx
// VIEW 5: Resource detail — full resource info, star rating, and comments.
// Maps to: GET /api/resources/:id, POST /api/resources/:id/rate,
//          GET|POST /api/resources/:id/comments, DELETE /api/resources/comments/:commentId
// Author: Alazar Kidane

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Star, Download } from 'lucide-react';
import './ResourceDetailPage.css';

// Mock data — same records as BrowsePage for consistent navigation.
const MOCK_RESOURCES = {
  '1': {
    _id: '1',
    title: 'Operating Systems Lecture Notes',
    description: 'Complete notes covering processes, threads, memory management and scheduling algorithms. Ideal for exam preparation and revision.',
    category: 'Computer Science',
    resourceType: 'lecture_notes',
    originalFileName: 'os-lecture-notes.pdf',
    averageRating: 4.5,
    reviewCount: 121,
    uploadedBy: { username: 'timothysisa', role: 'student' },
  },
  '2': {
    _id: '2',
    title: 'Web Technologies Past Paper 2023',
    description: 'Full past exam paper with model answers for the WT module semester 2. Covers REST APIs, React, Node.js and database integration.',
    category: 'Web Technologies',
    resourceType: 'past_paper',
    originalFileName: 'wt-past-paper-2023.pdf',
    averageRating: 4.8,
    reviewCount: 341,
    uploadedBy: { username: 'alazarkidane', role: 'student' },
  },
  '3': {
    _id: '3',
    title: 'Data Structures Study Guide',
    description: 'Comprehensive study guide covering arrays, linked lists, trees, graphs and sorting. Includes worked examples and complexity analysis.',
    category: 'Computer Science',
    resourceType: 'study_guide',
    originalFileName: 'data-structures-guide.pdf',
    averageRating: 4.2,
    reviewCount: 88,
    uploadedBy: { username: 'adarshpandit', role: 'student' },
  },
  '4': {
    _id: '4',
    title: 'Database Systems Lecture Notes',
    description: 'Full semester notes covering relational models, SQL, normalisation and transactions.',
    category: 'Computer Science',
    resourceType: 'lecture_notes',
    originalFileName: 'db-lecture-notes.pdf',
    averageRating: 3.9,
    reviewCount: 66,
    uploadedBy: { username: 'timothysisa', role: 'student' },
  },
  '5': {
    _id: '5',
    title: 'Mathematics for Computing Past Paper 2022',
    description: 'Past exam questions and solutions covering discrete maths, logic and probability.',
    category: 'Mathematics',
    resourceType: 'past_paper',
    originalFileName: 'maths-past-paper-2022.pdf',
    averageRating: 4.0,
    reviewCount: 211,
    uploadedBy: { username: 'alazarkidane', role: 'student' },
  },
  '6': {
    _id: '6',
    title: 'Software Engineering Study Guide',
    description: 'Summary of Agile, SDLC, UML diagrams, design patterns and testing strategies.',
    category: 'Software Engineering',
    resourceType: 'study_guide',
    originalFileName: 'se-study-guide.pdf',
    averageRating: 4.6,
    reviewCount: 156,
    uploadedBy: { username: 'adarshpandit', role: 'student' },
  },
};

// Seed comments for the mock — replaced by GET /api/resources/:id/comments in production.
const MOCK_COMMENTS = [
  {
    _id: 'c1',
    body: 'These notes are really helpful, covers everything in the syllabus.',
    author: { _id: 'u1', username: 'alazarkidane', role: 'student' },
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    _id: 'c2',
    body: 'Can anyone clarify the section on deadlock prevention? I found it confusing.',
    author: { _id: 'u2', username: 'adarshpandit', role: 'student' },
    createdAt: '2026-03-11T14:30:00Z',
  },
];

// Human-readable labels for resourceType enum values.
const TYPE_LABELS = {
  lecture_notes: 'Lecture Notes',
  past_paper:    'Past Paper',
  study_guide:   'Study Guide',
  other:         'Other',
};

function ResourceDetailPage() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Look up the resource using the URL param.
  const resource = MOCK_RESOURCES[id];

  const [comments, setComments]         = useState(MOCK_COMMENTS);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingMsg, setRatingMsg]       = useState('');
  const [averageRating, setAverageRating] = useState(resource?.averageRating || 0);
  const [commentBody, setCommentBody]   = useState('');
  const [commentError, setCommentError] = useState('');
  const [isFavourite, setIsFavourite]   = useState(false);

  // Unknown resource ID — show a clear error state.
  if (!resource) {
    return (
      <div className="detail-page">
        <p className="status-msg error">Resource not found.</p>
      </div>
    );
  }

  // Simulates POST /api/resources/:id/rate — replace with real fetch in production.
  const handleRate = () => {
    if (!user) return navigate('/login');

    if (selectedRating === 0) {
      setRatingMsg('Please select a star rating.');
      return;
    }

    // Mock average: average the current value and the new star selection.
    const newAvg = ((averageRating + selectedRating) / 2).toFixed(1);
    setAverageRating(parseFloat(newAvg));
    setRatingMsg(`Rating submitted! New average: ${newAvg}`);
  };

  const handleFavouriteToggle = () => {
    if (!user) return navigate('/login');
    setIsFavourite(!isFavourite);
  };

  // Simulates POST /api/resources/:id/comments — replace with real fetch in production.
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentError('');

    if (!user) return navigate('/login');

    // Validate comment length.
    if (commentBody.trim().length === 0) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    if (commentBody.length > 1000) {
      setCommentError('Comment cannot exceed 1000 characters.');
      return;
    }

    // Append locally to simulate the server response.
    const newComment = {
      _id:       `c${Date.now()}`,
      body:      commentBody,
      author:    { _id: user._id || 'mock', username: user.username, role: user.role },
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setCommentBody('');
  };

  // Simulates DELETE /api/resources/comments/:commentId — replace with real fetch in production.
  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div className="detail-page">

      {/* Resource header */}
      <div className="detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="detail-badge">{TYPE_LABELS[resource.resourceType]}</span>
          <button 
            onClick={handleFavouriteToggle}
            className="btn-favourite"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart size={24} fill={isFavourite ? "#ef4444" : "none"} color={isFavourite ? "#ef4444" : "currentColor"} />
          </button>
        </div>
        <h1 className="detail-title">{resource.title}</h1>
        <p className="detail-category">{resource.category}</p>
        <p className="detail-meta">
          Uploaded by <strong>{resource.uploadedBy?.username}</strong> ·
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Star size={16} fill="#eab308" color="#eab308" /> {averageRating > 0 ? averageRating : 'No ratings'}</span> ·
          {resource.reviewCount} reviews
        </p>
      </div>

      {/* Description */}
      <div className="detail-section">
        <h2>About this resource</h2>
        <p>{resource.description}</p>
      </div>

      {/* Download — maps to GET /api/resources/:id/file in production */}
      <div className="detail-section">
        <p className="download-note">Download available once connected to the backend.</p>
        <button className="btn-download" disabled style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={20} /> {resource.originalFileName}
        </button>
      </div>

      {/* Star rating — maps to POST /api/resources/:id/rate */}
      <div className="detail-section">
        <h2>Rate this Resource</h2>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star ${selectedRating >= star ? 'star-active' : ''}`}
              onClick={() => setSelectedRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Star size={24} fill={selectedRating >= star ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          ))}
        </div>
        <button className="btn-rate" onClick={handleRate}>Submit Rating</button>
        {ratingMsg && <p className="rating-msg">{ratingMsg}</p>}
      </div>

      {/* Comments — maps to GET|POST /api/resources/:id/comments */}
      <div className="detail-section">
        <h2>Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Share your thoughts on this resource..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              rows={3}
              maxLength={1000}
              aria-label="Comment body"
            />
            {commentError && <span className="field-error">{commentError}</span>}
            <button type="submit" className="btn-comment">Post Comment</button>
          </form>
        ) : (
          // Prompt guests to log in before commenting.
          <p className="login-prompt">
            <a href="/login">Log in</a> to leave a comment.
          </p>
        )}

        <div className="comment-list">
          {comments.length === 0 && <p className="no-comments">No comments yet. Be the first!</p>}

          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.author?.username}</strong>
                <span className="comment-role">{comment.author?.role}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-body">{comment.body}</p>

              {/* Delete visible to the comment author or a lecturer */}
              {user && (user.username === comment.author?.username || user.role === 'lecturer') && (
                <button
                  className="btn-delete-comment"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ResourceDetailPage;
