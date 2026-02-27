# Arise AI Chatbot - MERN Stack

Arise is a premium, modern AI chatbot application built with the MERN stack (MongoDB, Express, React, Node.js). It features a "glassmorphism" design, full authentication system, and real-time feel.

## ✨ Features

- **Premium UI**: Hand-crafted design with glassmorphism, smooth animations, and a modern aesthetic.
- **Smart Dashboard**: A professional landing page entry point for all users.
- **Authentication**: Secure Login and Registration system with session management.
- **Profile Management**:
  - Upload and change profile pictures.
  - Update display name and email.
  - Multi-mode UI (View/Edit).
- **Dark Mode**: Fully synced Dark/Light theme support that persists in your browser.
- **Account Controls**: Secure logout and permanent account deletion options.
- **AI Chat Experience**: Interactive chat interface with typing indicators and conversational flow.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile devices.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, Lucide-like SVG Icons.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Session**: Express-Session with Connect-Mongo.
- **File Uploads**: Multer for profile image management.
- **Security**: Bcrypt.js for password hashing.

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/princekumar9234/Simple-ChatBot.git
   cd Simple-Chat
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   SESSION_SECRET=your_secret_key
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

4. **Start the Application**:
   Go back to the `backend` folder and start the server:
   ```bash
   cd ../backend
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📸 Screenshots

| Dashboard | Chat Interface | Profile Modal |
|-----------|----------------|---------------|
| ![Dashboard](https://via.placeholder.com/300x200?text=Dashboard) | ![Chat](https://via.placeholder.com/300x200?text=Chat+Interface) | ![Profile](https://via.placeholder.com/300x200?text=Profile+Modal) |

---

Created with ❤️ by **Prince Kumar**
