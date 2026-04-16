const axios = require('axios');
const News = require('../models/News');

// @desc    Get latest IT news
// @route   GET /api/news/latest
exports.getLatestNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // If no API key, return mocks
    if (!apiKey || apiKey === 'your_news_api_key_here') {
      return res.json([
        { title: 'AI Hiring Surges in 2026', source: 'TechCrunch', url: '#', category: 'Hiring' },
        { title: 'New Quantum Computing Breakthrough', source: 'Wired', url: '#', category: 'Technology' },
        { title: 'Startup Funding Reaches New Heights', source: 'Forbes', url: '#', category: 'Startups' }
      ]);
    }

    const response = await axios.get(`https://newsapi.org/v2/everything?q=IT+Hiring+OR+Technology&sortBy=publishedAt&apiKey=${apiKey}`);
    
    const articles = response.data.articles.slice(0, 10).map(art => ({
      title: art.title,
      source: art.source.name,
      url: art.url,
      publishedAt: art.publishedAt
    }));

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
