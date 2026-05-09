// src/pages/BrowsePage.jsx
// Authors: Timothy Sisa, Alazar Kidane, Adarsh Pandit
// VIEW 4: Browse resources page — search, filter, sort and paginate via GET /api/resources

import { useState, useEffect } from "react";
import ResourceCard from "../components/ResourceCard";
import "./BrowsePage.css";

const API = import.meta.env.VITE_API_URL;

function BrowsePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetches resources from the backend whenever filters or page changes.
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ sort, page, limit: 9 });
        if (search) params.append("search", search);
        if (type) params.append("type", type);

        // Maps to GET /api/resources?search=...&type=...&sort=...&page=...
        const res = await fetch(`${API}/api/resources?${params}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch resources.");
        setResources(data.resources);
        setTotalPages(data.pagination.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [search, type, sort, page]);

  // Resets to page 1 when any filter changes.
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="browse-page">
      <h1 className="browse-title">Resource Catalog</h1>
      <div className="browse-controls">
        <input type="text" className="search-input"
          placeholder="Search by title, description or category..."
          value={search} onChange={handleFilterChange(setSearch)} />
        <div className="filter-row">
          <select value={type} onChange={handleFilterChange(setType)} className="filter-select">
            <option value="">All Types</option>
            <option value="lecture_notes">Lecture Notes</option>
            <option value="past_paper">Past Papers</option>
            <option value="study_guide">Study Guides</option>
            <option value="other">Other</option>
          </select>
          <select value={sort} onChange={handleFilterChange(setSort)} className="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="most_viewed">Most Viewed</option>
          </select>
        </div>
      </div>

      {loading && <p className="status-msg">Loading resources...</p>}
      {error && <p className="status-msg error">{error}</p>}
      {!loading && !error && resources.length === 0 && (
        <p className="status-msg">No resources found. Try a different search or filter.</p>
      )}

      <div className="resource-grid">
        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="page-btn">← Prev</button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="page-btn">Next →</button>
        </div>
      )}
    </div>
  );
}

export default BrowsePage;
