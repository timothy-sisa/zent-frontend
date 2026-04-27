// src/pages/DashboardPage.jsx
// VIEW 6: User Dashboard — Profile, Uploads, Favourites, Recently Viewed.
// Author: Adarsh Pandit

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Upload, Heart, Clock, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import './DashboardPage.css';

// Mock data
const MOCK_UPLOADS = [
  {
    _id: 'u1',
    title: 'My Custom Notes',
    description: 'Notes on advanced React patterns.',
    category: 'Computer Science',
    resourceType: 'lecture_notes',
    averageRating: 0,
    reviewCount: 0,
  }
];

const MOCK_FAVOURITES = [
  {
    _id: '1',
    title: 'Operating Systems Lecture Notes',
    description: 'Complete notes covering processes, threads, memory management...',
    category: 'Computer Science',
    resourceType: 'lecture_notes',
    averageRating: 4.5,
    reviewCount: 121,
    uploadedBy: { username: 'timothysisa' },
  }
];

const MOCK_RECENT = [
  { _id: '2', title: 'Web Technologies Past Paper 2023', category: 'Web Technologies', averageRating: 4.8 },
  { _id: '3', title: 'Data Structures Study Guide', category: 'Computer Science', averageRating: 4.2 },
];

export default function DashboardPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Tab 1: Profile
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState('');

  // Simulates PATCH /api/users/me .
  const handleProfileSave = (e) => {
    e.preventDefault();
    login({ ...user, username: profileForm.username, email: profileForm.email });
    setProfileMsg('Profile updated successfully.');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  // Tab 2: Uploads (Simulates GET /api/users/:id/resources)
  const [uploads, setUploads] = useState(MOCK_UPLOADS);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (resource) => {
    setEditingId(resource._id);
    setEditForm(resource);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Simulates PUT /api/resources/:id 
  const saveEdit = (e) => {
    e.preventDefault();
    setUploads(uploads.map(u => u._id === editingId ? { ...u, ...editForm } : u));
    setEditingId(null);
  };

  // Simulates DELETE /api/resources/:id 
  const deleteUpload = (id) => {
    setUploads(uploads.filter(u => u._id !== id));
  };

  // Tab 3: Favourites (Simulates GET /api/auth/me for favourites array)
  const [favourites, setFavourites] = useState(MOCK_FAVOURITES);
  // Simulates DELETE /api/resources/:id/favourite 
  const removeFavourite = (id) => {
    setFavourites(favourites.filter(f => f._id !== id));
  };

  // Tab 4: Recently Viewed (Simulates GET /api/resources/recently-viewed)
  const [recent] = useState(MOCK_RECENT);

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
                  <input type="text" value={profileForm.username} onChange={e => setProfileForm({...profileForm, username: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                </div>
                <button type="submit" className="btn-save"><Save size={16} /> Save Changes</button>
                {profileMsg && <p className="success-msg">{profileMsg}</p>}
              </form>
            </div>
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="tab-pane fade-in">
            <h2>My Uploads</h2>
            {uploads.length === 0 ? <p className="empty-state">You haven't uploaded any resources yet.</p> : (
              <div className="uploads-grid">
                {uploads.map(upload => (
                  <div key={upload._id} className="upload-card">
                    {editingId === upload._id ? (
                      <form onSubmit={saveEdit} className="edit-form">
                        <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="Title" required />
                        <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Description" rows={3} required />
                        <div className="edit-row">
                          <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Web Technologies">Web Technologies</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Software Engineering">Software Engineering</option>
                          </select>
                          <select value={editForm.resourceType} onChange={e => setEditForm({...editForm, resourceType: e.target.value})}>
                            <option value="lecture_notes">Lecture Notes</option>
                            <option value="past_paper">Past Paper</option>
                            <option value="study_guide">Study Guide</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="edit-actions">
                          <button type="submit" className="btn-save" style={{ marginTop: 0 }}><Save size={14}/> Save</button>
                          <button type="button" className="btn-cancel" onClick={cancelEdit}><X size={14}/> Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="upload-header">
                          <span className="upload-badge">{upload.resourceType.replace('_', ' ')}</span>
                          <div className="upload-actions">
                            <button onClick={() => startEdit(upload)} aria-label="Edit"><Pencil size={16}/></button>
                            <button onClick={() => deleteUpload(upload._id)} className="text-danger" aria-label="Delete"><Trash2 size={16}/></button>
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
            )}
          </div>
        )}

        {activeTab === 'favourites' && (
          <div className="tab-pane fade-in">
            <h2>Favourites</h2>
            {favourites.length === 0 ? <p className="empty-state">No favourites yet.</p> : (
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
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="tab-pane fade-in">
            <h2>Recently Viewed</h2>
            {recent.length === 0 ? <p className="empty-state">No recent activity.</p> : (
              <div className="recent-list">
                {recent.map(item => (
                  <Link key={item._id} to={`/resources/${item._id}`} className="recent-item">
                    <div className="recent-info">
                      <h3>{item.title}</h3>
                      <span className="recent-category">{item.category}</span>
                    </div>
                    <div className="recent-rating">
                      <Star size={14} fill="#eab308" color="#eab308" /> {item.averageRating.toFixed(1)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
