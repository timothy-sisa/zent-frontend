// src/pages/UploadPage.jsx
// Authors: Timothy Sisa, Alazar Kidane, Adarsh Pandit
// VIEW 6: Upload page — sends multipart/form-data to POST /api/resources

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

const API = import.meta.env.VITE_API_URL;

function UploadPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", description: "", category: "", resourceType: "" });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validates file type and size client-side matching the Multer middleware rules on the backend.
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const allowedTypes = [
      "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];
    if (!allowedTypes.includes(selected.type)) {
      setErrors({ ...errors, file: "Only PDF, Word, PowerPoint, and plain text files are accepted." });
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, file: "File size must not exceed 10 MB." });
      return;
    }
    setFile(selected);
    setErrors({ ...errors, file: "" });
  };

  // Client-side validation mirrors the express-validator chains on the backend route.
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (formData.title.length > 150) newErrors.title = "Title cannot exceed 150 characters.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (formData.description.length > 1000) newErrors.description = "Description cannot exceed 1000 characters.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";
    if (!formData.resourceType) newErrors.resourceType = "Please select a resource type.";
    if (!file) newErrors.file = "Please select a file to upload.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    // Build FormData for multipart upload — maps to POST /api/resources
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("resourceType", formData.resourceType);
    payload.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/resources`, {
        method: "POST",
        credentials: "include",
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setSuccess(true);
      setTimeout(() => navigate(`/resources/${data.resource._id}`), 1500);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1 className="upload-title">Upload a Resource</h1>
        <p className="upload-subtitle">Share lecture notes, past papers, or study guides with the community</p>
        {serverError && <p className="error-banner">{serverError}</p>}
        {success && <p className="success-banner">Resource uploaded! Redirecting...</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" placeholder="e.g. Operating Systems Lecture Notes"
              value={formData.title} onChange={handleChange} maxLength={150} className={errors.title ? "input-error" : ""} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Briefly describe what this resource covers"
              value={formData.description} onChange={handleChange} rows={4} maxLength={1000}
              className={errors.description ? "input-error" : ""} />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input id="category" name="category" type="text" placeholder="e.g. Computer Science, Mathematics"
              value={formData.category} onChange={handleChange} className={errors.category ? "input-error" : ""} />
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="resourceType">Resource Type</label>
            <select id="resourceType" name="resourceType" value={formData.resourceType} onChange={handleChange}
              className={errors.resourceType ? "input-error" : ""}>
              <option value="">Select a type...</option>
              <option value="lecture_notes">Lecture Notes</option>
              <option value="past_paper">Past Paper</option>
              <option value="study_guide">Study Guide</option>
              <option value="other">Other</option>
            </select>
            {errors.resourceType && <span className="field-error">{errors.resourceType}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="file">Upload File</label>
            <div className={`file-drop ${errors.file ? "input-error" : ""}`}>
              <input id="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" onChange={handleFileChange} />
              <p className="file-hint">{file ? file.name : "Click to select a file (PDF, Word, PowerPoint, TXT — max 10MB)"}</p>
            </div>
            {errors.file && <span className="field-error">{errors.file}</span>}
          </div>
          <button type="submit" className="btn-submit" disabled={loading || success}>
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
