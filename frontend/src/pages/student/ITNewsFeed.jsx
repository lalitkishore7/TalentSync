import { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../../components/ui/NewsCard';
import { Rss, RefreshCcw } from 'lucide-react';
import './ITNewsFeed.css';

const CATEGORIES = ['All', 'AI & ML', 'Frontend', 'Backend', 'DevOps', 'Languages'];

export default function ITNewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/news/latest');
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Could not load latest news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-page">
      <div className="news-header">
        <div className="news-header-left">
          <div className="news-badge"><Rss size={13} /> Live Feed</div>
          <h1>IT News & Insights</h1>
          <p>Stay ahead with real-time news curated for your career track.</p>
        </div>
        <button 
          className="refresh-news-btn" 
          onClick={fetchNews} 
          disabled={loading}
          title="Refresh news"
        >
          <RefreshCcw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="news-categories">
        {CATEGORIES.map((c, i) => (
          <button key={c} className={`news-cat-btn ${i === 0 ? 'active' : ''}`}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="news-loading-state">
          <RefreshCcw size={32} className="spin" />
          <p>Scraping the latest tech trends for you...</p>
        </div>
      ) : error ? (
        <div className="news-error-state">
          <p>{error}</p>
          <button onClick={fetchNews}>Try Again</button>
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article, idx) => (
            <NewsCard key={idx} article={{
              ...article,
              id: idx,
              source: typeof article.source === 'string' ? article.source : (article.source?.name || 'Tech News'),
              readTime: '4 min',
              category: 'Technology',
              summary: article.description || 'Global tech update from reliable sources.'
            }} />
          ))}
        </div>
      )}
    </div>
  );
}