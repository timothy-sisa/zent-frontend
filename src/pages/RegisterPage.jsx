// src/pages/RegisterPage.jsx
// Authors: Timothy Sisa, Alazar Kidane, Adarsh Pandit
// VIEW 2: Registration page — collects user details and posts to POST /api/auth/register

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

const API = import.meta.env.VITE_API_URL;

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "", role: "student",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Client-side validation mirrors the express-validator rules on the backend.
  const validate = () => {
    const newErrors = {};
    if (formData.username.trim().length < 3) newErrors.username = "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) newErrors.username = "Username may only contain letters and numbers.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      // Maps to POST /api/auth/register
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || "Registration failed."); return; }
      login(data.user);
      navigate("/resources");
    } catch (err) {
      setServerError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Join ZENT to upload and discover academic resources</p>
        {serverError && <p className="error-banner">{serverError}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" placeholder="Enter a username"
              value={formData.username} onChange={handleChange} className={errors.username ? "input-error" : ""} />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email"
              value={formData.email} onChange={handleChange} className={errors.email ? "input-error" : ""} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="At least 6 characters"
              value={formData.password} onChange={handleChange} className={errors.password ? "input-error" : ""} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat your password"
              value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "input-error" : ""} />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login now</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;
