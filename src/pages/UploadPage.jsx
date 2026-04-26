// src/pages/UploadPage.jsx
// VIEW 6: Upload — lets authenticated users submit a new academic resource.
// Maps to POST /api/resources (multipart/form-data) in production.
// Author: Adarsh Pandit

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title:        '',
    description:  '',
    category:     '',
    resourceType: '',
  });

  const [file, setFile]         = useState(null);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  // Clear the field error as the user types.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Validate file type and size before storing it in state.
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];

    if (!allowedTypes.includes(selected.type)) {
      setErrors({ ...errors, file: 'Only PDF, Word, PowerPoint, and plain text files are accepted.' });
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, file: 'File size must not exceed 10 MB.' });
      return;
    }

    setFile(selected);
    setErrors({ ...errors, file: '' });
  };

  // Client-side validation — mirrors server-side rules for POST /api/resources.
  const validate = () => {
    const errs = {};

    if (!formData.title.trim())               errs.title = 'Title is required.';
    if (formData.title.length > 150)          errs.title = 'Title cannot exceed 150 characters.';
    if (!formData.description.trim())         errs.description = 'Description is required.';
    if (formData.description.length > 1000)   errs.description = 'Description cannot exceed 1000 characters.';
    if (!formData.category.trim())            errs.category = 'Category is required.';
    if (!formData.resourceType)               errs.resourceType = 'Please select a resource type.';
    if (!file)                                errs.file = 'Please select a file to upload.';

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    // Simulates POST /api/resources with FormData — replace with real fetch in production.
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      // Redirect to the catalog after a brief success message.
      setTimeout(() => navigate('/resources'), 1500);
    }, 1000);
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1 className="upload-title">Upload a Resource</h1>
        <p className="upload-subtitle">Share lecture notes, past papers, or study guides with the community</p>

        {/* Success message shown before redirect */}
        {success && <p className="success-banner">Resource uploaded! Redirecting...</p>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Operating Systems Lecture Notes"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Briefly describe what this resource covers"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="e.g. Computer Science, Mathematics"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
            />
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="resourceType">Resource Type</label>
            <select
              id="resourceType"
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className={errors.resourceType ? 'input-error' : ''}
            >
              <option value="">Select a type...</option>
              <option value="lecture_notes">Lecture Notes</option>
              <option value="past_paper">Past Paper</option>
              <option value="study_guide">Study Guide</option>
              <option value="other">Other</option>
            </select>
            {errors.resourceType && <span className="field-error">{errors.resourceType}</span>}
          </div>

          {/* File picker — file is sent as multipart/form-data to POST /api/resources */}
          <div className="form-group">
            <label htmlFor="file">Upload File</label>
            <div className={`file-drop ${errors.file ? 'input-error' : ''}`}>
              <input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={handleFileChange}
              />
              <p className="file-hint">
                {file ? file.name : 'Click to select a file (PDF, Word, PowerPoint, TXT — max 10 MB)'}
              </p>
            </div>
            {errors.file && <span className="field-error">{errors.file}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading || success}>
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
