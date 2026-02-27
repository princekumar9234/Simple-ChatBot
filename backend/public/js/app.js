/**
 * Chatbot Frontend Application
 * Handles user interactions and API communication
 */

// DOM Elements
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatWindow = document.getElementById('chatWindow');
const typingIndicator = document.getElementById('typingIndicator');

// ========== UTILITY FUNCTIONS ==========

/**
 * Format timestamp to readable time
 */
function formatTime(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return messageDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

/**
 * Scroll chat window to bottom
 */
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  scrollToBottom();
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

/**
 * Disable input during processing
 */
function setInputState(disabled) {
  messageInput.disabled = disabled;
  sendButton.disabled = disabled;
}

// ========== MESSAGE RENDERING ==========

/**
 * Create user message element
 */
function createUserMessage(message, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="/images/user.jpg" alt="User Avatar">
    </div>
    <div class="message-content">
      <p>${escapeHtml(message)}</p>
      <span class="message-time">${formatTime(timestamp)}</span>
    </div>
  `;
  
  return messageDiv;
}

/**
 * Create bot message element
 */
function createBotMessage(message, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="/images/logo.jpg" alt="Bot Logo">
    </div>
    <div class="message-content">
      <p>${escapeHtml(message)}</p>
      <span class="message-time">${formatTime(timestamp)}</span>
    </div>
  `;
  
  return messageDiv;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Add message to chat window
 */
function addMessage(messageElement) {
  chatWindow.appendChild(messageElement);
  scrollToBottom();
}

// ========== API COMMUNICATION ==========

/**
 * Send message to backend API
 */
async function sendMessage(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send message');
    }

    return data.data;

  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// ========== EVENT HANDLERS ==========

/**
 * Handle form submission
 */
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  // Disable input
  setInputState(true);

  // Add user message to chat
  const userMessageElement = createUserMessage(message, new Date());
  addMessage(userMessageElement);

  // Clear input
  messageInput.value = '';

  // Show typing indicator
  showTypingIndicator();

  try {
    // Send message to backend
    const response = await sendMessage(message);

    // Simulate typing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Hide typing indicator
    hideTypingIndicator();

    // Add bot response to chat
    const botMessageElement = createBotMessage(
      response.botReply, 
      response.timestamp
    );
    addMessage(botMessageElement);

  } catch (error) {
    // Hide typing indicator
    hideTypingIndicator();

    // Show error message
    const errorMessageElement = createBotMessage(
      'Sorry, something went wrong. Please try again.',
      new Date()
    );
    addMessage(errorMessageElement);

  } finally {
    // Re-enable input
    setInputState(false);
    messageInput.focus();
  }
});

/**
 * Auto-resize input on Enter key
 */
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

// ========== INITIALIZATION ==========

/**
 * Load chat history on page load
 */
async function loadChatHistory() {
  try {
    const response = await fetch('/api/chat/history?limit=20');
    const data = await response.json();

    if (data.success && data.data.chats.length > 0) {
      // Clear welcome message
      chatWindow.innerHTML = '';

      // Add historical messages
      data.data.chats.forEach(chat => {
        const userMsg = createUserMessage(chat.userMessage, chat.timestamp);
        const botMsg = createBotMessage(chat.botReply, chat.timestamp);
        addMessage(userMsg);
        addMessage(botMsg);
      });
    }

  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

// Focus input on page load
window.addEventListener('DOMContentLoaded', () => {
  messageInput.focus();
  // Load chat history on page load
  loadChatHistory();
});
