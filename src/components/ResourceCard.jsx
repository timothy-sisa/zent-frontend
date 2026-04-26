// src/components/ResourceCard.jsx
// Card shown in the resource grid — links to the detail page.
// Author: Alazar Kidane

import { Link } from 'react-router-dom';
import './ResourceCard.css';

// Maps resourceType enum values to readable labels.
const TYPE_LABELS = {
  lecture_notes: 'Lecture Notes',
  past_paper:    'Past Paper',
  study_guide:   'Study Guide',
  other:         'Other',
};

function ResourceCard({ resource }) {
  const { _id, title, description, category, resourceType, averageRating, viewCount, uploadedBy } = resource;

  return (
    <div className="resource-card">
      {/* Resource type badge */}
      <span className="card-badge">{TYPE_LABELS[resourceType] || resourceType}</span>

      <h3 className="card-title">{title}</h3>
      <p className="card-category">{category}</p>
      <p className="card-description">{description}</p>

      <div className="card-meta">
        <span className="card-rating">★ {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}</span>
        <span className="card-views">{viewCount} views</span>
        {uploadedBy && <span className="card-author">by {uploadedBy.username}</span>}
      </div>

      {/* Links to the detail page — maps to GET /api/resources/:id */}
      <Link to={`/resources/${_id}`} className="card-btn">View Resource</Link>
    </div>
  );
}

export default ResourceCard;
