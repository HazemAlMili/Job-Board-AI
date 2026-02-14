import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/welcome.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isHR } = useAuth();

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🤖</span>
            <span>AI-Powered Recruitment</span>
          </div>
          
          <h1 className="hero-title">
            Find Your Dream Job with
            <span className="gradient-text"> AI Intelligence</span>
          </h1>
          
          <p className="hero-description">
            Experience the future of job hunting. Our AI evaluates your resume instantly,
            matching you with the perfect opportunities while helping employers find top talent.
          </p>
          
          <div className="hero-actions">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate(isHR() ? '/hr/dashboard' : '/jobs')} 
                className="btn-hero-primary"
              >
                {isHR() ? 'Go to Dashboard' : 'Browse Jobs'}
                <span className="btn-arrow">→</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/register')} 
                  className="btn-hero-primary"
                >
                  Get Started Free
                  <span className="btn-arrow">→</span>
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn-hero-secondary"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Match Accuracy</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Evaluation</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📄</div>
            <div className="card-text">Upload Resume</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🤖</div>
            <div className="card-text">AI Analysis</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">✨</div>
            <div className="card-text">Perfect Match</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-subtitle">
            Powered by cutting-edge AI technology to revolutionize your job search
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Instant AI Evaluation</h3>
            <p>
              Get your resume analyzed in seconds. Our AI provides detailed feedback
              and matches you with suitable positions instantly.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Smart Job Matching</h3>
            <p>
              Advanced algorithms match your skills and experience with the perfect
              job opportunities tailored just for you.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Insights</h3>
            <p>
              Track your application status, view AI scores, and get actionable
              feedback to improve your chances.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast & Efficient</h3>
            <p>
              No more waiting weeks for responses. Get instant feedback and
              accelerate your job search process.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>
              Your data is encrypted and protected. We prioritize your privacy
              and security at every step.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>For Everyone</h3>
            <p>
              Whether you're a job seeker or employer, our platform streamlines
              the entire recruitment process.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to your dream job
          </p>
        </div>
        
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Profile</h3>
              <p>Sign up in seconds and set up your professional profile</p>
            </div>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Upload & Apply</h3>
              <p>Browse jobs and submit your resume with one click</p>
            </div>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Matched</h3>
              <p>Receive instant AI evaluation and connect with employers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of professionals who found their dream jobs with AI assistance</p>
          <div className="cta-buttons">
            <button 
              onClick={() => navigate('/register')} 
              className="btn-cta-primary"
            >
              Start Your Journey
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="btn-cta-secondary"
            >
              I Have an Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>&copy; 2026 AI Job Board. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default Welcome;
