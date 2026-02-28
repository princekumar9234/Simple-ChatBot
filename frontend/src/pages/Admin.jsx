import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [intents, setIntents] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchIntents = async () => {
    try {
      const res = await fetch('/api/admin/intents');
      const data = await res.json();
      if (data.success) {
        setIntents(data.data.intents);
      }
    } catch (err) {
      setError('Failed to load intents');
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/admin/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, response }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Knowledge added! Chatbot is now trained.');
        setKeyword('');
        setResponse('');
        fetchIntents();
      } else {
        setError(data.error?.message || 'Failed to add knowledge');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this knowledge?')) return;
    
    try {
      const res = await fetch(`/api/admin/intent/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchIntents();
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  return (
    <div className="landing-container admin-page">
      <nav className="landing-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">✨</div>
          <span>Arise AI</span>
        </Link>
        <div className="nav-actions">
          <Link to="/chat" className="nav-btn secondary">Back to Chat</Link>
        </div>
      </nav>

      <div className="admin-grid">
        <div className="train-section">
          <div className="glass-settings-card train-card">
            <h3>Train Chatbot</h3>
            <p className="admin-subtitle">Add keywords and responses to improve Arise's intelligence.</p>
            
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message" style={{color: '#4ade80', marginBottom: '1rem', fontWeight: '600'}}>{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="premium-input-group">
                <label>Keyword (Trigger)</label>
                <div className="input-with-icon">
                   <input 
                     type="text" 
                     className="auth-input" 
                     placeholder="e.g. hello, pricing, help" 
                     value={keyword}
                     onChange={e => setKeyword(e.target.value)}
                     required
                   />
                </div>
              </div>

              <div className="premium-input-group" style={{marginTop: '1rem'}}>
                <label>Bot Response</label>
                <div className="input-with-icon">
                   <textarea 
                     className="auth-input admin-textarea" 
                     placeholder="What should the bot say?" 
                     value={response}
                     onChange={e => setResponse(e.target.value)}
                     required
                   />
                </div>
              </div>

              <button type="submit" className="premium-btn primary" style={{width: '100%', marginTop: '1.5rem'}} disabled={loading}>
                {loading ? 'Processing...' : 'Add Knowledge'}
              </button>
            </form>
          </div>
        </div>

        <div className="intents-list">
          <div className="section-title">Knowledge Base ({intents.length})</div>
          <div className="intents-container">
            {intents.map(intent => (
              <div key={intent._id} className="glass-settings-card intent-item">
                <div className="intent-main">
                  <div className="intent-keyword">
                    <span className="badge">KEYWORD</span> {intent.keyword}
                  </div>
                  <div className="intent-response">{intent.response}</div>
                </div>
                <button className="delete-btn-icon" onClick={() => handleDelete(intent._id)}>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                   </svg>
                </button>
              </div>
            ))}
            {intents.length === 0 && <p style={{color: 'var(--text-muted)'}}>No custom knowledge yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
