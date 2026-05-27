const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2200, 'Content cannot exceed 2200 characters'], // Instagram's limit
  },
  platform: {
    type: String,
    required: [true, 'Please select a platform'],
    enum: {
      values: ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok'],
      message: '{VALUE} is not a supported platform',
    },
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft',
  },
  mediaUrl: {
    type: String,
    default: '',
  },
  hashtags: [{
    type: String,
    trim: true,
  }],
  scheduledAt: {
    type: Date,
    default: null,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  // Embedded metrics object — always fetched with the post
  // No need for a separate collection since metrics are 1:1 with posts
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Index for faster queries: find all posts by a user, sorted by creation date
postSchema.index({ user: 1, createdAt: -1 });

// Index for finding scheduled posts that need to be published
postSchema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model('Post', postSchema);
