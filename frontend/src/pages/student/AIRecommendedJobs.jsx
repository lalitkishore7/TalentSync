import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import JobCard from '../../components/ui/JobCard';
import './AIRecommendedJobs.css';

const MOCK_JOBS = [
  { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Remote', salary: '$95k – $130k', type: 'Full-time', tags: ['React', 'TypeScript', 'GraphQL'], posted: '1 day ago', verified: true, match: 96 },
  { id: 2, title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$140k – $180k', type: 'Full-time', tags: ['Python', 'PyTorch', 'LLMs'], posted: '3 days ago', verified: true, match: 91 },
  { id: 3, title: 'Backend Engineer', company: 'Stripe', location: 'Hybrid · NYC', salary: '$110k – $150k', type: 'Full-time', tags: ['Go', 'Kubernetes', 'PostgreSQL'], posted: '2 days ago', verified: true, match: 88 },
  { id: 4, title: 'Data Scientist', company: 'Netflix', location: 'Remote', salary: '$120k – $160k', type: 'Full-time', tags: ['Python', 'Spark', 'Tableau'], posted: '5 days ago', verified: true, match: 85 },
  { id: 5, title: 'iOS Developer', company: 'Apple', location: 'Cupertino, CA', salary: '$130k – $170k', type: 'Full-time', tags: ['Swift', 'SwiftUI', 'Xcode'], posted: '1 week ago', verified: true, match: 80 },
  { id: 6, title: 'DevOps Engineer', company: 'Amazon', location: 'Remote', salary: '$105k – $140k', type: 'Contract', tags: ['AWS', 'Terraform', 'CI/CD'], posted: '4 days ago', verified: true, match: 79 },
  { id: 7, title: 'UX/UI Designer', company: 'Figma', location: 'Remote', salary: '$90k – $120k', type: 'Full-time', tags: ['Figma', 'Prototyping', 'Research'], posted: '2 days ago', verified: true, match: 74 },
  { id: 8, title: 'Security Engineer', company: 'Cloudflare', location: 'Remote', salary: '$115k – $155k', type: 'Full-time', tags: ['Security', 'Rust', 'Networking'], posted: '6 days ago', verified: true, match: 70 },
];

const FILTERS = ['All', 'Remote', 'Full-time', 'Contract', 'Internship'];
const DOMAINS = ['All', 'Frontend', 'Backend', 'ML/AI', 'Data', 'Design', 'DevOps'];

export default function AIRecommendedJobs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeDomain, setActiveDomain] = useState('All');

  const filtered = MOCK_JOBS.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || job.type === activeFilter || job.location.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  const handleApply = (job) => {
    navigate(`/dashboard/student/apply/${job.id}`);
  };

  return (
    <div className="ai-jobs-page">
      {/* Hero Banner */}
      <div className="ai-jobs-hero">
        <div className="hero-text">
          <div className="ai-badge"><Sparkles size={13} /> Powered by AI</div>
          <h1>Your Personalized Job Matches</h1>
          <p>Curated based on your skills, resume, and career goals.</p>
        </div>
        <div className="match-ring">
          <svg viewBox="0 0 100 100" className="ring-svg">
            <circle cx="50" cy="50" r="40" className="ring-bg" />
            <circle cx="50" cy="50" r="40" className="ring-fill" strokeDasharray={`${96 * 2.51} 251`} />
          </svg>
          <div className="ring-label"><span>96%</span><small>Top Match</small></div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="jobs-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search roles, companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="icon-btn"><SlidersHorizontal size={16} /></button>
      </div>

      {/* Domain Tags */}
      <div className="domain-row">
        {DOMAINS.map(d => (
          <button key={d} className={`domain-btn ${activeDomain === d ? 'active' : ''}`} onClick={() => setActiveDomain(d)}>
            {d}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="jobs-count">{filtered.length} jobs found</div>
      <div className="jobs-grid">
        {filtered.map(job => (
          <div key={job.id} className="job-card-wrap">
            <div className="match-score-badge">{job.match}% match</div>
            <JobCard job={job} onApply={handleApply} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-jobs">
            <p>No jobs matching "<strong>{search}</strong>"</p>
            <button onClick={() => setSearch('')}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}