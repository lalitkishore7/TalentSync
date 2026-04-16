import NewsCard from '../../components/ui/NewsCard';
import { Rss } from 'lucide-react';
import './ITNewsFeed.css';

const ARTICLES = [
  { id: 1, title: 'GPT-5 Unveiled — What It Means for Developers', source: 'TechCrunch', publishedAt: '1h ago', readTime: '5 min', category: 'AI & ML', summary: 'OpenAI has released GPT-5 with a significant leap in reasoning and code generation, reshaping how developers think about AI-assisted workflows.' },
  { id: 2, title: 'React 20 RC — Concurrent Features & New Hooks', source: 'Smashing Magazine', publishedAt: '3h ago', readTime: '4 min', category: 'Frontend', summary: 'The React team has shipped a release candidate for version 20 featuring new concurrent rendering APIs and a simplified server component model.' },
  { id: 3, title: 'Rust Tops the Stack Overflow Survey Again', source: 'Dev.to', publishedAt: '5h ago', readTime: '3 min', category: 'Languages', summary: 'For the ninth consecutive year, Rust is the most loved programming language among developers, with adoption in systems and WebAssembly growing rapidly.' },
  { id: 4, title: 'The Death of the REST API? GraphQL Surges', source: 'InfoQ', publishedAt: '8h ago', readTime: '6 min', category: 'Backend', summary: 'GraphQL adoption has hit an all-time high as teams prioritize flexibility and reduced over-fetching in microservice architectures.' },
  { id: 5, title: 'Kubernetes 2.0 Simplifies Developer Experience', source: 'The New Stack', publishedAt: '1d ago', readTime: '5 min', category: 'DevOps', summary: 'The CNCF has shipped a major overhaul to Kubernetes that dramatically reduces configuration boilerplate while adding better developer tooling.' },
  { id: 6, title: 'TypeScript 6 Introduces Nominal Types', source: 'Medium', publishedAt: '1d ago', readTime: '4 min', category: 'Frontend', summary: 'TypeScript 6 arrives with nominal typing support, strict enum improvements, and dramatically improved type inference for mapped types.' },
];

const CATEGORIES = ['All', 'AI & ML', 'Frontend', 'Backend', 'DevOps', 'Languages'];

export default function ITNewsFeed() {
  return (
    <div className="news-page">
      <div className="news-header">
        <div className="news-header-left">
          <div className="news-badge"><Rss size={13} /> Live Feed</div>
          <h1>IT News & Insights</h1>
          <p>Stay ahead with curated tech news relevant to your career track.</p>
        </div>
      </div>

      <div className="news-categories">
        {CATEGORIES.map((c, i) => (
          <button key={c} className={`news-cat-btn ${i === 0 ? 'active' : ''}`}>{c}</button>
        ))}
      </div>

      <div className="news-grid">
        {ARTICLES.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}