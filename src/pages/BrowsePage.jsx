// src/pages/BrowsePage.jsx
// VIEW 4: Resource catalog — search, filter, and sort the resource library.
// Maps to GET /api/resources in production.
// Author: Alazar Kidane

import { useState } from 'react';
import ResourceCard from '../components/ResourceCard';
import './BrowsePage.css';

// Mock data — replaced by GET /api/resources response in production.
const MOCK_RESOURCES = [
  {
    _id: '1',
    title: 'Operating Systems Lecture Notes',
    description: 'Complete notes covering processes, threads, memory management and scheduling algorithms.',
    category: 'Computer Science',
    resourceType: 'lecture_notes',
    averageRating: 4.5,
    reviewCount: 120,
    uploadedBy: { username: 'timothysisa' },
  },
  {
    _id: '2',
    title: 'Web Technologies Past Paper 2023',
    description: 'Full past exam paper with model answers for the WT module semester 2.',
    category: 'Web Technologies',
    resourceType: 'past_paper',
    averageRating: 4.8,
    reviewCount: 340,
    uploadedBy: { username: 'alazarkidane' },
  },
  {
    _id: '3',
    title: 'Data Structures Study Guide',
    description: 'Comprehensive study guide covering arrays, linked lists, trees, graphs and sorting.',
    category: 'Computer Science',
    resourceType: 'study_guide',
    averageRating: 4.2,
    reviewCount: 87,
    uploadedBy: { username: 'adarshpandit' },
  },
  {
    _id: '4',
    title: 'Database Systems Lecture Notes',
    description: 'Full semester notes covering relational models, SQL, normalisation and transactions.',
    category: 'Computer Science',
    resourceType: 'lecture_notes',
    averageRating: 3.9,
    reviewCount: 65,
    uploadedBy: { username: 'timothysisa' },
  },
  {
    _id: '5',
    title: 'Mathematics for Computing Past Paper 2022',
    description: 'Past exam questions and solutions covering discrete maths, logic and probability.',
    category: 'Mathematics',
    resourceType: 'past_paper',
    averageRating: 4.0,
    reviewCount: 210,
    uploadedBy: { username: 'alazarkidane' },
  },
  {
    _id: '6',
    title: 'Software Engineering Study Guide',
    description: 'Summary of Agile, SDLC, UML diagrams, design patterns and testing strategies.',
    category: 'Software Engineering',
    resourceType: 'study_guide',
    averageRating: 4.6,
    reviewCount: 155,
    uploadedBy: { username: 'adarshpandit' },
  },
];

function BrowsePage() {
  // Search, type filter, and sort — map to query params (?search=&type=&sort=) on GET /api/resources.
  const [search, setSearch] = useState('');
  const [type, setType]     = useState('');
  const [sort, setSort]     = useState('newest');

  // Filter and sort locally — mirrors the backend query logic.
  const filtered = MOCK_RESOURCES
    .filter((resource) => {
      const matchesSearch =
        !search ||
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase()) ||
        resource.category.toLowerCase().includes(search.toLowerCase());

      const matchesType = !type || resource.resourceType === type;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sort === 'highest_rated') return b.averageRating - a.averageRating;
      return 0; // 'newest' / 'oldest' order is preserved from the array for mock data
    });

  return (
    <div className="browse-page">
      <h1 className="browse-title">Resource Catalog</h1>

      {/* Controls — values become query params on the API call */}
      <div className="browse-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search resources"
        />

        <div className="filter-row">
          {/* Type filter — maps to ?type= */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="filter-select"
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            <option value="lecture_notes">Lecture Notes</option>
            <option value="past_paper">Past Papers</option>
            <option value="study_guide">Study Guides</option>
            <option value="other">Other</option>
          </select>

          {/* Sort control — maps to ?sort= */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="filter-select"
            aria-label="Sort results"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rated">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="status-msg">No resources found. Try a different search or filter.</p>
      )}

      {/* Resource grid — each card links to the detail page */}
      <div className="resource-grid">
        {filtered.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export default BrowsePage;
