const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set it as an httpOnly cookie
 * 
 * Why httpOnly? It prevents JavaScript from reading the cookie,
 * protecting against XSS attacks. The browser sends it automatically.
 * 
 * Why sameSite: 'lax'? It prevents the cookie from being sent in
 * cross-site POST requests (CSRF protection), while still allowing
 * normal navigation.
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });

  res.cookie('jwt', token, {
    httpOnly: true,                                    // Not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production',     // HTTPS only in production
    sameSite: 'lax',                                   // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000,                 // 30 days in milliseconds
  });

  return token;
};

module.exports = generateToken;
