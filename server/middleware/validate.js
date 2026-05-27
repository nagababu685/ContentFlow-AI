const { body, validationResult } = require('express-validator');

/**
 * Validation rules for different routes
 * 
 * Why validate on the server even if we validate on the frontend?
 * Because anyone can bypass the frontend and send raw HTTP requests.
 * Server-side validation is the last line of defense.
 */

// Validation rules for user registration
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Validation rules for creating/updating posts
const postValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Post content is required')
    .isLength({ max: 2200 }).withMessage('Content cannot exceed 2200 characters'),
  body('platform')
    .notEmpty().withMessage('Platform is required')
    .isIn(['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok'])
    .withMessage('Invalid platform selected'),
];

/**
 * Middleware to check validation results
 * If there are errors, return them as a 400 response.
 * If no errors, call next() to proceed to the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  postValidation,
  validate,
};
