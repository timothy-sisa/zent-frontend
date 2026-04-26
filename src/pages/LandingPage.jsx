// src/pages/LandingPage.jsx
// VIEW 1: Landing page — introduces the platform and directs users to register or browse.
// Author: Timothy Sisa

import { Link } from 'react-router-dom';
import { Library, Star, MessageSquare, BookOpen, Upload, Users } from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing">
      {/* Decorative background blobs — home page only */}
      <div className="bg-blob blob-top-left"></div>
      <div className="bg-blob blob-bottom-right"></div>

      {/* Hero — primary call to action */}
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Centralized Study Resources</h1>
          <p className="hero-subtitle">
            Find lecture notes, past exam papers, and study guides — all in one place,
            rated and discussed by your peers.
          </p>
          {/* Buttons link to Browse (GET /api/resources) and Register (POST /api/auth/register) */}
          <div className="hero-actions">
            <Link to="/resources" className="btn-primary">Browse Resources</Link>
            <Link to="/register" className="btn-secondary">Register Now</Link>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon"><Library size={26} strokeWidth={1.5} /></div>
          <h3>Centralized Resources</h3>
          <p>All your study materials in one structured, searchable platform — no more scattered group chats.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><Star size={26} strokeWidth={1.5} /></div>
          <h3>Community Ratings</h3>
          <p>Peer ratings help you quickly identify the most useful resources before you download them.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><MessageSquare size={26} strokeWidth={1.5} /></div>
          <h3>Student Discussions</h3>
          <p>Comment on resources to ask questions, share insights, and collaborate with classmates.</p>
        </div>
      </section>

      {/* How it works — step-by-step guide */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <Users size={18} strokeWidth={1.5} className="step-icon" />
              <p>Create an account as a student or lecturer</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <Upload size={18} strokeWidth={1.5} className="step-icon" />
              <p>Upload your notes, past papers, or study guides</p>
            </div>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <BookOpen size={18} strokeWidth={1.5} className="step-icon" />
              <p>Browse, rate, and discuss resources with the community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
