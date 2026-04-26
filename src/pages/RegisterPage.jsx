// src/pages/RegisterPage.jsx
// VIEW 3: Register — collects user details and validates inputs client-side.
// Maps to POST /api/auth/register in production.
// Author: Alazar Kidane

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function RegisterPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [formData, setFormData] = useState({
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    role:            'student',
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  // Clear the field error as soon as the user edits it.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Client-side validation — mirrors server-side rules for POST /api/auth/register.
  const validate = () => {
    const errs = {};

    if (formData.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters.';
    }
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      errs.username = 'Username may only contain letters and numbers.';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

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

    // Simulates POST /api/auth/register — replace with real fetch when backend is ready.
    setTimeout(() => {
      login({
        username: formData.username,
        email:    formData.email,
        role:     formData.role,
      });
      navigate('/resources');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Join ZENT to upload and discover academic resources</p>

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter a username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {/* Role selection — stored on the user document in the backend */}
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login now</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
