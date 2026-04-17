const axios = require('axios');
const News = require('../models/News');

// @desc    Get latest IT news
// @route   GET /api/news/latest
exports.getLatestNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // Attempt to fetch real news if key is present and not default
    if (apiKey && apiKey !== 'your_news_api_key_here') {
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=IT+Hiring+OR+Software+Development+OR+Tech+Trends&sortBy=publishedAt&language=en&apiKey=${apiKey}`);
        const rawArticles = response.data?.articles;
        
        if (Array.isArray(rawArticles) && rawArticles.length > 0) {
          const articles = rawArticles.slice(0, 10).map(art => ({
            title: art.title,
            source: art.source?.name || 'Tech News',
            url: art.url,
            publishedAt: art.publishedAt,
            description: art.description,
            urlToImage: art.urlToImage
          }));
          return res.json(articles);
        }
      } catch (apiErr) {
        console.warn('NewsAPI fetch failed, falling back to mocks:', apiErr.message);
      }
    }

    // High-quality fallback artifacts
    res.json([
      { title: 'The Rise of AI Agents in Software Engineering', source: 'TalentSync Insights', url: '#', publishedAt: new Date().toISOString(), description: 'How autonomous agents are reshaping the CI/CD pipeline and code reviews.' },
      { title: 'Next.js 15 Features Every Developer Should Know', source: 'Frontend Weekly', url: '#', publishedAt: new Date().toISOString(), description: 'A deep dive into the new partial prerelease and hydration improvements.' },
      { title: 'Why Rust is Becoming the Industry Standard for Systems', source: 'DevOps Journal', url: '#', publishedAt: new Date().toISOString(), description: 'Analyzing the performance and safety benefits making Rust indispensable for cloud infra.' },
      { title: 'Quantum Computing: Ready for Production by 2027?', source: 'Future Tech', url: '#', publishedAt: new Date().toISOString(), description: 'Leading researchers discuss the timeline for quantum advantage in cryptography.' }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
