/**
 * AI Content Generation Controller
 * 
 * This is the "AI wrapper" — it takes a user's prompt and generates
 * social media content. In production, you'd call OpenAI/Gemini API here.
 * 
 * For this project, we use a smart template-based generator that creates
 * realistic, platform-specific content. This demonstrates the full
 * async API pattern without requiring an API key.
 * 
 * To upgrade to real AI: just swap the generateContent() function
 * with an actual API call — the rest of the flow stays identical.
 */

// Platform-specific content templates and styles
const platformStyles = {
  twitter: {
    maxLength: 280,
    style: 'concise, punchy, with hashtags',
    format: 'short-form with emojis',
  },
  instagram: {
    maxLength: 2200,
    style: 'storytelling, engaging, hashtag-heavy',
    format: 'caption with line breaks and hashtags block',
  },
  linkedin: {
    maxLength: 1300,
    style: 'professional, thought-leadership, value-driven',
    format: 'structured with line breaks, no emojis overload',
  },
  facebook: {
    maxLength: 500,
    style: 'conversational, community-focused',
    format: 'medium-length, engaging question at end',
  },
  tiktok: {
    maxLength: 300,
    style: 'trendy, Gen-Z, hook-driven',
    format: 'short hook + CTA, trending hashtags',
  },
};

// Content generation templates based on topic categories
const contentTemplates = {
  twitter: [
    (topic) => `🚀 Just discovered something game-changing about ${topic}.\n\nHere's what most people get wrong:\n\nThey focus on quantity over quality.\n\nThe real secret? Consistency + authenticity.\n\n#${topic.replace(/\s+/g, '')} #ContentCreator #Growth`,
    (topic) => `Hot take: ${topic} is going to change everything in 2025.\n\nHere's why 👇\n\n1. It saves 10+ hours/week\n2. Engagement goes up 3x\n3. Your audience actually remembers you\n\nWho else is seeing this? 🙋‍♂️\n\n#${topic.replace(/\s+/g, '')} #SocialMedia`,
    (topic) => `Stop scrolling. Read this.\n\n${topic} isn't just a trend — it's the future.\n\nI spent 30 days testing it and here are my results:\n\n📈 47% more engagement\n💰 2x conversion rate\n🎯 Better audience targeting\n\nThread below 🧵`,
  ],
  instagram: [
    (topic) => `✨ Let's talk about ${topic}.\n\nI used to think success was about doing more. More posts, more stories, more reels.\n\nBut here's what actually moved the needle:\n\n→ Understanding my audience deeply\n→ Creating content that solves real problems\n→ Showing up consistently (not perfectly)\n\nThe truth? You don't need to go viral. You need to be valuable.\n\nSave this for later 🔖\n\n.\n.\n.\n\n#${topic.replace(/\s+/g, '')} #ContentStrategy #CreatorEconomy #SocialMediaTips #GrowthMindset #DigitalMarketing #ContentCreation #Authenticity`,
    (topic) => `📌 ${topic} — The Complete Guide\n\nSwipe through to learn everything you need to know 👉\n\nSlide 1: Why it matters NOW\nSlide 2: The 3 biggest mistakes\nSlide 3: My proven framework\nSlide 4: Real results from real creators\nSlide 5: Your action plan for this week\n\nWhich slide resonated with you most? Drop a number below 👇\n\n#${topic.replace(/\s+/g, '')} #LearnOnInstagram #CreatorTips #ContentMarketing`,
  ],
  linkedin: [
    (topic) => `I've been thinking a lot about ${topic} lately.\n\nAfter 3 years in this space, here's what I've learned:\n\n𝗧𝗵𝗲 𝗣𝗿𝗼𝗯𝗹𝗲𝗺:\nMost professionals approach ${topic} the same way they did 5 years ago. The landscape has fundamentally shifted.\n\n𝗧𝗵𝗲 𝗦𝗼𝗹𝘂𝘁𝗶𝗼𝗻:\n→ Start with your audience's pain points\n→ Build systems, not just content\n→ Measure what matters (hint: it's not vanity metrics)\n\n𝗧𝗵𝗲 𝗥𝗲𝘀𝘂𝗹𝘁:\nCreators who adopt this framework see 3-5x better results within 90 days.\n\nWhat's your biggest challenge with ${topic}? I'd love to hear your perspective.\n\n#${topic.replace(/\s+/g, '')} #ProfessionalDevelopment #ContentStrategy`,
    (topic) => `Unpopular opinion about ${topic}:\n\nYou don't need a massive following to make an impact.\n\nI've seen creators with 500 followers generate more meaningful engagement than accounts with 50K.\n\nThe difference?\n\n1️⃣ They know exactly who they're talking to\n2️⃣ Every post solves a specific problem\n3️⃣ They engage authentically in comments\n\nIn 2025, depth beats breadth. Every time.\n\nAgree or disagree? Let's discuss 👇`,
  ],
  facebook: [
    (topic) => `Hey everyone! 👋\n\nI wanted to share something about ${topic} that completely changed my perspective.\n\nFor the longest time, I was overthinking everything. But then I realized — the best content comes from genuine experiences.\n\nHere's my simple 3-step process:\n1. Listen to what your community is asking\n2. Share your honest experience\n3. Ask for their input\n\nWhat do you think? Has anyone else experienced this? Let me know in the comments! 💬`,
    (topic) => `🔥 Quick tip about ${topic}!\n\nI tried this last week and the results were incredible:\n\nInstead of posting and hoping for the best, I started engaging with 10 people in my niche BEFORE posting.\n\nThe result? My reach doubled and I got way more meaningful conversations going.\n\nTry it today and let me know how it goes! 👇`,
  ],
  tiktok: [
    (topic) => `POV: You just discovered the secret to ${topic} 🤯\n\nStep 1: Stop copying everyone else\nStep 2: Find YOUR unique angle\nStep 3: Post consistently for 30 days\nStep 4: Watch the magic happen ✨\n\nFollow for more tips! 🔥\n\n#${topic.replace(/\s+/g, '')} #ContentCreator #ViralTips #FYP #LearnOnTikTok`,
    (topic) => `Things nobody tells you about ${topic} 👀\n\n❌ You DON'T need expensive equipment\n❌ You DON'T need to post 5x a day\n❌ You DON'T need to follow every trend\n\n✅ You DO need authenticity\n✅ You DO need a clear message\n✅ You DO need patience\n\nSave this for later 📌\n\n#${topic.replace(/\s+/g, '')} #CreatorAdvice #SocialMediaGrowth #FYP`,
  ],
};

/**
 * Generate content based on prompt and platform
 * Simulates async AI processing with realistic delay
 */
const generateContent = (prompt, platform) => {
  const templates = contentTemplates[platform] || contentTemplates.twitter;
  const randomIndex = Math.floor(Math.random() * templates.length);
  const content = templates[randomIndex](prompt);

  // Generate relevant hashtags based on prompt words
  const words = prompt.split(/\s+/).filter(w => w.length > 3);
  const hashtags = words.slice(0, 5).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return {
    content,
    hashtags,
    platform,
    characterCount: content.length,
    maxCharacters: platformStyles[platform]?.maxLength || 280,
  };
};

/**
 * @desc    Generate AI content from a prompt
 * @route   POST /api/generate
 * @access  Private
 * 
 * This is the async API pattern:
 * Frontend sends prompt → Backend processes (simulated delay) → Returns generated content
 * The user can then review, edit, and save the result.
 */
const generatePostContent = async (req, res) => {
  try {
    const { prompt, platform } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt',
      });
    }

    if (!platform) {
      return res.status(400).json({
        success: false,
        message: 'Please select a platform',
      });
    }

    // Simulate AI processing delay (500-1500ms) — makes it feel like a real API call
    const delay = Math.floor(Math.random() * 1000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const result = generateContent(prompt.trim(), platform);

    res.json({
      success: true,
      data: {
        generatedContent: result.content,
        hashtags: result.hashtags,
        platform: result.platform,
        characterCount: result.characterCount,
        maxCharacters: result.maxCharacters,
        prompt: prompt.trim(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generatePostContent };
