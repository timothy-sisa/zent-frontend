// src/components/ResourceCard.jsx
// Card shown in the resource grid — links to the detail page.
// Author: Alazar Kidane

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Star } from 'lucide-react';
import './ResourceCard.css';

const API = import.meta.env.VITE_API_URL;

// Maps resourceType enum values to readable labels.
const TYPE_LABELS = {
  lecture_notes: 'Lecture Notes',
  past_paper:    'Past Paper',
  study_guide:   'Study Guide',
  other:         'Other',
};

function ResourceCard({ resource }) {
  const { _id, title, description, category, resourceType, averageRating, reviewCount, uploadedBy } = resource;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);

  const handleFavouriteToggle = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    // Optimistic UI toggle
    const newFavState = !isFavourite;
    setIsFavourite(newFavState);

    try {
      const res = await fetch(`${API}/api/resources/${_id}/favourite`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        // Sync with actual backend state
        setIsFavourite(data.favourited);
      } else {
        // Revert on failure
        setIsFavourite(!newFavState);
      }
    } catch (err) {
      console.error("Failed to toggle favourite:", err);
      setIsFavourite(!newFavState);
    }
  };

  return (
    <div className="resource-card">
      {/* Resource type badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="card-badge">{TYPE_LABELS[resourceType] || resourceType}</span>
        <button 
          onClick={handleFavouriteToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart size={20} fill={isFavourite ? "#ef4444" : "none"} color={isFavourite ? "#ef4444" : "currentColor"} />
        </button>
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-category">{category}</p>
      <p className="card-description">{description}</p>

      <div className="card-meta">
        <span className="card-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} fill="#eab308" color="#eab308" /> {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}</span>
        <span className="card-views">{reviewCount} reviews</span>
        {uploadedBy && <span className="card-author">by {uploadedBy.username}</span>}
      </div>

      {/* Links to the detail page — maps to GET /api/resources/:id */}
      <Link to={`/resources/${_id}`} className="card-btn">View Resource</Link>
    </div>
  );
}

export default ResourceCard;
