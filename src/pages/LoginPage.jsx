// src/pages/LoginPage.jsx
// VIEW 2: Login — validates credentials and simulates session creation.
// Maps to POST /api/auth/login in production.
// Author: Alazar Kidane

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData]     = useState({ email: '', password: '' });
  const [errors, setErrors]         = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]       = useState(false);

  // Clear the error for a field as soon as the user starts typing.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Client-side validation — mirrors server rules for POST /api/auth/login.
  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    // Simulates POST /api/auth/login — replace with real fetch when backend is ready.
    setTimeout(() => {
      if (formData.password === 'wrongpassword') {
        // Simulate an invalid-credentials response from the API.
        setServerError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Derive username from email for the mock session object.
      const username = formData.email.split('@')[0];
      login({ username, email: formData.email, role: 'student' });
      navigate('/resources');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to access your resources and uploads</p>

        {/* Server-level error (e.g. wrong credentials) */}
        {serverError && <p className="error-banner">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
