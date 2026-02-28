import { useState, useEffect, useRef } from 'react';

export default function ProfileModal({ user, setUser, onClose, isDarkMode, toggleTheme }) {
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => {
      overlayRef.current?.classList.add('show');
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    overlayRef.current?.classList.remove('show');
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      setUser(null);
      onClose();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const res = await fetch('/auth/delete-account', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Account deleted successfully.');
        setUser(null);
        onClose();
      } else {
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveError('File size too large (max 2MB)');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    
    const formData = new FormData();
    formData.append('displayName', displayName);
    formData.append('email', email);
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    try {
      const res = await fetch('/auth/update-profile', {
        method: 'POST',
        body: formData, 
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        setPreviewUrl(null);
        setSelectedFile(null);
      } else {
        setSaveError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = previewUrl || (user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:3000${user.profileImage}`) : 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=6366f1&color=fff&bold=true`);

  const provider = user?.googleId ? 'Google' : user?.githubId ? 'GitHub' : 'Email';

  return (
    <div
      className="profile-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="profile-modal-content premium-modal">
        {!editMode ? (
          /* View Mode */
          <>
            <div className="modal-header">
              <button className="icon-btn" onClick={handleClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <h3>Settings</h3>
              <div style={{ width: 40 }}></div>
            </div>

            <div className="premium-profile-header">
              <div className="glass-avatar-container">
                <img src={avatarUrl} alt="User" />
              </div>
              <div className="profile-info-main">
                <h2 className="profile-display-name">{user?.displayName || user?.username}</h2>
                <div className="badge-row">
                  <span className="user-badge silver">Member</span>
                  {user?.role === 'admin' && <span className="user-badge admin-badge">ADMIN</span>}
                  <span className="user-badge">{provider}</span>
                </div>
              </div>
              <button className="premium-btn primary" onClick={() => setEditMode(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 16, height: 16}}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            </div>

            <div className="settings-scroll-area">
              <div className="settings-section">
                <div className="section-title">Personal information</div>
                <div className="glass-settings-card">
                  <div className="setting-row">
                    <span className="setting-label">Email address</span>
                    <span className="setting-value">{user?.email || '—'}</span>
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">Username</span>
                    <span className="setting-value">@{user?.username}</span>
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">Account status</span>
                    <span className="setting-value active">Active</span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <div className="section-title">Application</div>
                <div className="glass-settings-card">
                  <div className="setting-row clickable" onClick={toggleTheme}>
                    <div className="row-start">
                      <div className="row-icon">🌙</div>
                      <span>Dark mode</span>
                    </div>
                    <div className={`toggle-mini ${isDarkMode ? 'active' : ''}`}></div>
                  </div>
                </div>
              </div>

              {user?.role === 'admin' && (
                <div className="settings-section">
                  <div className="section-title">Administrator</div>
                  <div className="glass-settings-card">
                    <div className="setting-row clickable" onClick={() => { handleClose(); window.location.href='/admin'; }}>
                      <div className="row-start">
                        <div className="row-icon">🧠</div>
                        <span>Train Chatbot</span>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 18, height: 18}}>
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="settings-section">
                <div className="section-title">Account Session</div>
                <div className="glass-settings-card">
                  <div className="setting-row logout-row clickable" onClick={handleLogout}>
                    <div className="row-start">
                      <div className="row-icon">🚪</div>
                      <span>Logout Account</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 18, height: 18}}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                  <div className="setting-row delete-row clickable" onClick={handleDeleteAccount}>
                    <div className="row-start">
                      <div className="row-icon">🗑️</div>
                      <span className="text-danger">Delete Account</span>
                    </div>
                    <span className="danger-badge">Permanent</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Edit Mode */
          <>
            <div className="modal-header">
              <button className="text-btn" onClick={() => { setEditMode(false); setSaveError(''); setPreviewUrl(null); }}>
                Cancel
              </button>
              <h3>Profile Info</h3>
              <button className={`premium-btn ${saving ? 'disabled' : ''}`} onClick={handleSave} disabled={saving}>
                {saving ? '...' : 'Save'}
              </button>
            </div>

            <div className="edit-form-premium">
              {saveError && (
                <div className="premium-error">{saveError}</div>
              )}
              
              <div className="avatar-edit-section">
                <div className="avatar-preview-ring" onClick={() => fileInputRef.current?.click()}>
                  <img src={avatarUrl} alt="Preview" />
                  <div className="upload-overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button className="text-btn change-photo-btn" onClick={() => fileInputRef.current?.click()} style={{ fontSize: '0.85rem', color: '#6366f1', marginTop: '0.5rem', fontWeight: '600' }}>
                   Change Photo
                </button>
              </div>

              <div className="premium-input-group">
                <label>Display Name</label>
                <div className="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="E.g. John Doe"
                  />
                </div>
              </div>

              <div className="premium-input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="edit-footer-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 14, height: 14, marginRight: 6}}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Username is locked to <strong>{user?.username}</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

