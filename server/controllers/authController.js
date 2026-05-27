const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * 
 * Flow: Validate input → Check if email exists → Create user → Set JWT cookie → Return user data
 * The password is automatically hashed by the User model's pre-save hook.
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists with this email
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user — password gets hashed automatically by mongoose pre-save hook
    const user = await User.create({ name, email, password });

    if (user) {
      // Generate JWT and set as httpOnly cookie
      generateToken(res, user._id);

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          connectedPlatforms: user.connectedPlatforms,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    // If status hasn't been set to an error code, use 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 * 
 * Flow: Find user by email → Compare password → Set JWT cookie → Return user data
 * We use .select('+password') because password has select:false in the schema.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include the password field for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Compare entered password with hashed password using bcrypt
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate JWT and set as httpOnly cookie
    generateToken(res, user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        connectedPlatforms: user.connectedPlatforms,
      },
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 * 
 * We clear the JWT cookie by setting it to an empty string with an immediate expiry.
 * Since the cookie is httpOnly, the frontend can't delete it — only the server can.
 */
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.json({ success: true, message: 'Logged out successfully' });
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private (requires auth middleware)
 * 
 * req.user is already populated by the auth middleware.
 * This endpoint is used by the frontend to check if the user is still logged in.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        connectedPlatforms: user.connectedPlatforms,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update only the fields that were sent
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.connectedPlatforms) {
      user.connectedPlatforms = req.body.connectedPlatforms;
    }

    // If password is being updated, the pre-save hook will hash it
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        connectedPlatforms: updatedUser.connectedPlatforms,
      },
    });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getMe, updateProfile };
