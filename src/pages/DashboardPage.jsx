// src/pages/DashboardPage.jsx
// Authors: Timothy Sisa, Alazar Kidane, Adarsh Pandit
// VIEW 7: User Dashboard — Profile, Uploads, Favourites, Recently Viewed.
// Fetches real data from the backend API.

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Upload, Heart, Clock, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import './DashboardPage.css';

const API = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // ── Profile tab state ────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  // Updates username and email — maps to PATCH /api/users/me
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError('');
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: profileForm.username, email: profileForm.email }),
      });
      const data = await res.json();
      if (!res.ok) { setProfileError(data.error || 'Update failed.'); return; }
      login({ ...user, username: data.user.username, email: data.user.email });
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileError('Could not connect to the server.');
    }
  };

  // ── Uploads tab state ────────────────────────────────────────────────────
  const [uploads, setUploads] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetches all resources uploaded by the current user — maps to GET /api/users/:id/resources
  useEffect(() => {
    if (activeTab !== 'uploads' || !user) return;
    const fetchUploads = async () => {
      setUploadsLoading(true);
      try {
        const res = await fetch(`${API}/api/users/${user._id}/resources`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setUploads(data.resources);
      } catch (err) {
        console.error('Fetch uploads error:', err);
      } finally {
        setUploadsLoading(false);
      }
    };
    fetchUploads();
  }, [activeTab, user]);

  const startEdit = (resource) => { setEditingId(resource._id); setEditForm(resource); };
  const cancelEdit = () => setEditingId(null);

  // Saves edited resource metadata — maps to PUT /api/resources/:id
  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/resources/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          resourceType: editForm.resourceType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUploads(uploads.map(u => u._id === editingId ? data.resource : u));
        setEditingId(null);
      }
    } catch (err) {
      console.error('Save edit error:', err);
    }
  };

  // Deletes a resource — maps to DELETE /api/resources/:id
  const deleteUpload = async (id) => {
    try {
      const res = await fetch(`${API}/api/resources/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setUploads(uploads.filter(u => u._id !== id));
    } catch (err) {
      console.error('Delete upload error:', err);
    }
  };

  // ── Favourites tab state ─────────────────────────────────────────────────
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoading, setFavouritesLoading] = useState(false);

  // Fetches current user profile including favourites — maps to GET /api/auth/me
  useEffect(() => {
    if (activeTab !== 'favourites') return;
    const fetchFavourites = async () => {
      setFavouritesLoading(true);
      try {
        const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setFavourites(data.user.favourites || []);
      } catch (err) {
        console.error('Fetch favourites error:', err);
      } finally {
        setFavouritesLoading(false);
      }
    };
    fetchFavourites();
  }, [activeTab]);

  // Toggles favourite off — maps to POST /api/resources/:id/favourite
  const removeFavourite = async (id) => {
    try {
      const res = await fetch(`${API}/api/resources/${id}/favourite`, { method: 'POST', credentials: 'include' });
      if (res.ok) setFavourites(favourites.filter(f => f._id !== id));
    } catch (err) {
      console.error('Remove favourite error:', err);
    }
  };

  // ── Recently Viewed tab state ────────────────────────────────────────────
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // Fetches recently viewed resources from session — maps to GET /api/resources/recently-viewed
  useEffect(() => {
    if (activeTab !== 'recent') return;
    const fetchRecent = async () => {
      setRecentLoading(true);
      try {
        const res = await fetch(`${API}/api/resources/recently-viewed`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setRecent(data.resources);
      } catch (err) {
        console.error('Fetch recent error:', err);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecent();
  }, [activeTab]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={18} /> Profile
        </button>
        <button className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`} onClick={() => setActiveTab('uploads')}>
          <Upload size={18} /> My Uploads
        </button>
        <button className={`tab-btn ${activeTab === 'favourites' ? 'active' : ''}`} onClick={() => setActiveTab('favourites')}>
          <Heart size={18} /> Favourites
        </button>
        <button className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>
          <Clock size={18} /> Recently Viewed
        </button>
      </div>

      <div className="dashboard-content">

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-pane fade-in">
            <h2>Profile Settings</h2>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">{user?.username?.[0]?.toUpperCase()}</div>
                <div>
                  <h3>{user?.username}</h3>
                  <span className="role-badge">{user?.role}</span>
                </div>
              </div>
              <form className="profile-form" onSubmit={handleProfileSave}>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" value={profileForm.username}
                    onChange={e => setProfileForm({ ...profileForm, username: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                </div>
                <button type="submit" className="btn-save"><Save size={16} /> Save Changes</button>
                {profileMsg && <p className="success-msg">{profileMsg}</p>}
                {profileError && <p className="field-error">{profileError}</p>}
              </form>
            </div>
          </div>
        )}

        {/* Uploads Tab */}
        {activeTab === 'uploads' && (
          <div className="tab-pane fade-in">
            <h2>My Uploads</h2>
            {uploadsLoading && <p className="empty-state">Loading uploads...</p>}
            {!uploadsLoading && uploads.length === 0 && <p className="empty-state">You haven't uploaded any resources yet.</p>}
            <div className="uploads-grid">
              {uploads.map(upload => (
                <div key={upload._id} className="upload-card">
                  {editingId === upload._id ? (
                    <form onSubmit={saveEdit} className="edit-form">
                      <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" required />
                      <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={3} required />
                      <div className="edit-row">
                        <input value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" />
                        <select value={editForm.resourceType} onChange={e => setEditForm({ ...editForm, resourceType: e.target.value })}>
                          <option value="lecture_notes">Lecture Notes</option>
                          <option value="past_paper">Past Paper</option>
                          <option value="study_guide">Study Guide</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="edit-actions">
                        <button type="submit" className="btn-save" style={{ marginTop: 0 }}><Save size={14} /> Save</button>
                        <button type="button" className="btn-cancel" onClick={cancelEdit}><X size={14} /> Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="upload-header">
                        <span className="upload-badge">{upload.resourceType?.replace('_', ' ')}</span>
                        <div className="upload-actions">
                          <button onClick={() => startEdit(upload)} aria-label="Edit"><Pencil size={16} /></button>
                          <button onClick={() => deleteUpload(upload._id)} className="text-danger" aria-label="Delete"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <h3 className="upload-title">{upload.title}</h3>
                      <p className="upload-category">{upload.category}</p>
                      <p className="upload-desc">{upload.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favourites Tab */}
        {activeTab === 'favourites' && (
          <div className="tab-pane fade-in">
            <h2>Favourites</h2>
            {favouritesLoading && <p className="empty-state">Loading favourites...</p>}
            {!favouritesLoading && favourites.length === 0 && <p className="empty-state">No favourites yet.</p>}
            <div className="favourites-grid">
              {favourites.map(fav => (
                <div key={fav._id} className="favourite-wrapper">
                  <ResourceCard resource={fav} />
                  <button className="btn-remove-fav" onClick={() => removeFavourite(fav._id)}>
                    <X size={14} /> Remove from Favourites
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Tab */}
        {activeTab === 'recent' && (
          <div className="tab-pane fade-in">
            <h2>Recently Viewed</h2>
            {recentLoading && <p className="empty-state">Loading...</p>}
            {!recentLoading && recent.length === 0 && <p className="empty-state">No recent activity this session.</p>}
            <div className="recent-list">
              {recent.map(item => (
                <Link key={item._id} to={`/resources/${item._id}`} className="recent-item">
                  <div className="recent-info">
                    <h3>{item.title}</h3>
                    <span className="recent-category">{item.category}</span>
                  </div>
                  <div className="recent-rating">
                    <Star size={14} fill="#F5A623" color="#F5A623" />
                    {item.averageRating > 0 ? item.averageRating.toFixed(1) : 'No ratings'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
