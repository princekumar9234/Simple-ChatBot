const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/profile/');
  },
  filename: function(req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).single('profileImage');

exports.uploadAvatar = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    next();
  });
};


// @desc    Register user (JSON API - for React)
// @route   POST /auth/register
exports.register = async (req, res) => {
  const { username, displayName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    const updateData = { 
      username, 
      displayName, 
      email, 
      password 
    };

    if (req.file) {
      updateData.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      updateData.role = 'admin';
    }

    const user = await User.create(updateData);

    req.session.user = {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role
    };

    return res.json({
      success: true,
      user: { 
        id: user._id, 
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message || 'Error registering user' });
  }
};

// @desc    Login user (JSON API - for React)
// @route   POST /auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role
    };

    return res.json({
      success: true,
      user: { 
        id: user._id, 
        username: user.username, 
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Error logging in' });
  }
};

// @desc    Logout user (JSON API - for React)
// @route   POST /auth/logout  (also supports GET for backward compat)
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
};

// @desc    Mock Social Login (For Demo Purposes)
// @route   GET /auth/social/:provider
exports.mockSocialLogin = async (req, res) => {
  const provider = req.params.provider;
  const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
  const mockUsername = `${capitalizedProvider}User`;

  try {
    let user = await User.findOne({ username: mockUsername });
    if (!user) {
      user = await User.create({
        username: mockUsername,
        password: 'dummy_password_for_social_login'
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      isSocial: true,
      provider: provider
    };

    // Social logins redirect to home (React SPA will handle routing)
    res.redirect('/');
  } catch (error) {
    console.error(`Error in mock ${provider} login:`, error);
    res.redirect('/?error=Social+Login+Failed');
  }
};

// @desc    Update user profile
// @route   POST /auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, email } = req.body;

    let userId;
    if (req.session && req.session.user) {
      userId = req.session.user.id || req.session.user._id;
    } else if (req.user) {
      userId = req.user.id || req.user._id;
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No session found' });
    }

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (email) updateData.email = email;
    
    if (req.file) {
      updateData.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (req.session.user) {
      req.session.user = { 
        ...req.session.user, 
        ...updateData,
        // Ensure we send back the updated user data structure
        profileImage: updatedUser.profileImage,
        displayName: updatedUser.displayName,
        email: updatedUser.email
      };
    }

    req.session.save((err) => {
      if (err) console.error('Session save error:', err);
      return res.json({ success: true, user: updatedUser });
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Delete user account
// @route   DELETE /auth/delete-account
exports.deleteAccount = async (req, res) => {
  try {
    let userId;
    if (req.session && req.session.user) {
      userId = req.session.user.id || req.session.user._id;
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    await User.findByIdAndDelete(userId);

    req.session.destroy((err) => {
      if (err) console.error('Error destroying session during delete:', err);
      res.clearCookie('connect.sid');
      return res.json({ success: true, message: 'Account deleted successfully' });
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Legacy GET handlers (kept for backward compat but return JSON)
exports.getRegister = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.redirect('/');
};

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.redirect('/');
};
