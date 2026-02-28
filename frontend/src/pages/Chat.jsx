import { useState, useEffect, useRef } from 'react';
import ProfileModal from '../components/ProfileModal';

function formatTime(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const m = Math.floor(diffInSeconds / 60);
    return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const h = Math.floor(diffInSeconds / 3600);
    return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  }
  return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default function Chat({ user, setUser, isDarkMode, toggleTheme }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: "👋 Hello! I'm your AI Assistant. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
    inputRef.current?.focus();
  }, []);

  const loadChatHistory = async () => {
    try {
      const res = await fetch('/api/chat/history?limit=20');
      const data = await res.json();
      if (data.success && data.data.chats.length > 0) {
        const historyMessages = [];
        data.data.chats.forEach(chat => {
          historyMessages.push({
            id: chat._id + '-user',
            type: 'user',
            text: chat.userMessage,
            timestamp: chat.timestamp,
          });
          historyMessages.push({
            id: chat._id + '-bot',
            type: 'bot',
            text: chat.botReply,
            timestamp: chat.timestamp,
          });
        });
        setMessages(historyMessages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || disabled) return;

    setDisabled(true);
    const userMsgId = Date.now() + '-user';
    setMessages(prev => [...prev, { id: userMsgId, type: 'user', text: message, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || 'Failed to send message');

      // Simulate typing delay
      await new Promise(r => setTimeout(r, 500));

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + '-bot',
        type: 'bot',
        text: data.data.botReply,
        timestamp: data.data.timestamp,
      }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + '-err',
        type: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setDisabled(false);
      inputRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
  };

  const avatarUrl = user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:3000${user.profileImage}`) : 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=random&color=fff`;

  return (
    <>
      <div className="background-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="page-wrapper">
        <div className="container">
          {/* Header */}
          <header className="chat-header">
            <div className="header-content">
              <div className="bot-avatar">
                <div className="logo-icon-small">✨</div>
              </div>
              <div className="header-info">
                <h1 className="bot-name">Arise</h1>
                <p className="bot-status">
                  <span className="status-indicator"></span>
                  Online
                </p>
              </div>

              {user && (
                <div className="user-controls">
                  <button className="theme-toggle-btn header-toggle" onClick={toggleTheme}>
                    {isDarkMode ? '☀️' : '🌙'}
                  </button>
                  <div
                    className="user-profile-pill"
                    onClick={() => setShowProfile(true)}
                    title="Open Profile"
                  >
                    <img src={avatarUrl} alt="User" />
                  </div>

                  <button
                    className="logout-icon-btn"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M15 12L2 12M2 12L6 16M2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Chat Window */}
          <div className="chat-window" ref={chatWindowRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.type === 'bot' ? 'bot-message' : 'user-message'}`}>
                <div className="message-avatar">
                  {msg.type === 'bot' ? (
                    <img src="/images/logo.jpg" alt="Bot" onError={e => { e.target.style.display='none'; }} />
                  ) : (
                    <img src={avatarUrl} alt="User" />
                  )}
                </div>
                <div className="message-content">
                  <p dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }} />
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="message-input"
                placeholder="Type your message here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={disabled}
                maxLength={500}
                autoComplete="off"
                ref={inputRef}
              />
              <button type="submit" className="send-button" disabled={disabled || !input.trim()}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          user={user}
          setUser={setUser}
          onClose={() => setShowProfile(false)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
}
