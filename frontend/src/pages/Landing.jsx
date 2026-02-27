import { Link } from 'react-router-dom';

export default function Landing({ user, isDarkMode, toggleTheme }) {
  return (
    <div className="landing-container">
      {/* Background Decor */}
      <div className="landing-bg">
        <div className="landing-blob blob-1"></div>
        <div className="landing-blob blob-2"></div>
      </div>

      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">✨</div>
          <span>Arise AI</span>
        </div>
        <div className="nav-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          {user ? (
            <Link to="/chat" className="nav-btn primary">Go to Chat</Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn secondary">Login</Link>
              <Link to="/register" className="nav-btn primary">Create Account</Link>
            </>
          )}
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge">New Experience</span>
          <h1 className="hero-title">
            The Next Generation of <br />
            <span>Intelligent Chat</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of communication with Arise AI. 
            Beautifully designed, exceptionally fast, and built for everyone.
          </p>
          <div className="hero-btns">
            {user ? (
                <Link to="/chat" className="hero-btn-primary">Continue Chatting</Link>
            ) : (
                <Link to="/register" className="hero-btn-primary">Get Started Free</Link>
            )}
            <a href="#features" className="hero-btn-secondary">Learn More</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mockup-container">
            <div className="mockup-header">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
            </div>
            <div className="mockup-content">
                <div className="mock-chat bot">
                    <div className="mock-avatar">🤖</div>
                    <div className="mock-bubble">Hello! I'm your AI assistant. How can I help you build something amazing today?</div>
                </div>
                <div className="mock-chat user">
                    <div className="mock-bubble">Can you help me design a premium dashboard?</div>
                </div>
                <div className="mock-chat bot">
                    <div className="mock-avatar">🤖</div>
                    <div className="mock-bubble">Absolutely! Let's focus on glassmorphism and vibrant gradients.</div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure & Private</h3>
          <p>Your conversations are encrypted and never shared. Priority on privacy.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Optimized for performance with instant responses and smooth animations.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Premium UI</h3>
          <p>Hand-crafted design with glassmorphism, dark mode, and stunning visuals.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Arise AI Chatbot. Created with ❤️ by Prince Kumar</p>
      </footer>
    </div>
  );
}
