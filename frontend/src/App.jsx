import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') !== 'light');

  // Check if user is already logged in (session exists)
  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Theme Sync
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing user={user} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/chat"
          element={user ? <Chat user={user} setUser={setUser} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/chat" />}
        />
        <Route
          path="/register"
          element={!user ? <Register setUser={setUser} /> : <Navigate to="/chat" />}
        />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
