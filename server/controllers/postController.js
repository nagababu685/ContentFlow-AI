const Post = require('../models/Post');

/**
 * @desc    Get all posts for the logged-in user
 * @route   GET /api/posts
 * @access  Private
 * 
 * Supports query filters: ?platform=twitter&status=draft&page=1&limit=10
 * Why pagination? Without it, a user with 1000 posts would load ALL of them
 * at once — terrible for performance and UX.
 */
const getPosts = async (req, res) => {
  try {
    const { platform, status, page = 1, limit = 10 } = req.query;

    // Build dynamic filter object based on query params
    const filter = { user: req.user._id };
    if (platform) filter.platform = platform;
    if (status) filter.status = status;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })                    // Newest first
      .limit(Number(limit))                        // Max results per page
      .skip((Number(page) - 1) * Number(limit));   // Skip previous pages

    // Get total count for pagination metadata
    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Private
 * 
 * We check that the post belongs to the requesting user.
 * Without this check, any authenticated user could read anyone's posts.
 */
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Ensure the post belongs to the requesting user
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this post' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 * 
 * If scheduledAt is provided and in the future, status is set to 'scheduled'.
 * Otherwise it stays as 'draft'. This mimics how real platforms work —
 * you compose content now, decide when to publish it later.
 */
const createPost = async (req, res) => {
  try {
    const { content, platform, mediaUrl, hashtags, scheduledAt, status } = req.body;

    const postData = {
      user: req.user._id,
      content,
      platform,
      mediaUrl: mediaUrl || '',
      hashtags: hashtags || [],
      status: status || 'draft',
    };

    // If a future schedule date is provided, mark as scheduled
    if (scheduledAt) {
      postData.scheduledAt = new Date(scheduledAt);
      if (postData.scheduledAt > new Date()) {
        postData.status = 'scheduled';
      }
    }

    const post = await Post.create(postData);

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 * 
 * runValidators: true ensures Mongoose schema validations run on update too.
 * By default, Mongoose only validates on .create(), not .findByIdAndUpdate().
 */
const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,               // Return the updated document, not the old one
      runValidators: true,     // Run schema validations on update
    });

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get aggregated stats for the dashboard
 * @route   GET /api/posts/stats
 * @access  Private
 * 
 * Uses MongoDB aggregation pipeline — much faster than fetching all posts
 * and computing stats in JavaScript. The database does the heavy lifting.
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count posts by status
    const totalPosts = await Post.countDocuments({ user: userId });
    const draftPosts = await Post.countDocuments({ user: userId, status: 'draft' });
    const scheduledPosts = await Post.countDocuments({ user: userId, status: 'scheduled' });
    const publishedPosts = await Post.countDocuments({ user: userId, status: 'published' });

    // Aggregate engagement metrics across all posts
    const metricsAgg = await Post.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$metrics.likes' },
          totalComments: { $sum: '$metrics.comments' },
          totalShares: { $sum: '$metrics.shares' },
          totalReach: { $sum: '$metrics.reach' },
          totalImpressions: { $sum: '$metrics.impressions' },
        },
      },
    ]);

    // Count posts per platform
    const platformStats = await Post.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
        },
      },
    ]);

    const metrics = metricsAgg[0] || {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalReach: 0,
      totalImpressions: 0,
    };

    res.json({
      success: true,
      data: {
        posts: { total: totalPosts, draft: draftPosts, scheduled: scheduledPosts, published: publishedPosts },
        engagement: {
          likes: metrics.totalLikes,
          comments: metrics.totalComments,
          shares: metrics.totalShares,
          reach: metrics.totalReach,
          impressions: metrics.totalImpressions,
        },
        platforms: platformStats.map(p => ({ platform: p._id, count: p.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost, getStats };
