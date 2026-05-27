const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * 
 * This runs BEFORE any protected route handler.
 * Flow: Extract JWT from cookie → Verify it → Find user → Attach to request
 * 
 * If any step fails, we return 401 (Unauthorized) and the route handler
 * never executes. This is the gatekeeper for all protected endpoints.
 */
const protect = async (req, res, next) => {
  let token;

  // Read JWT from the httpOnly cookie
  token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    // Verify token — this throws if the token is expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token payload, excluding the password
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next(); // User is authenticated — proceed to the route handler
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
};

module.exports = { protect };
