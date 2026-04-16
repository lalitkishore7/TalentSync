import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, DollarSign, Clock, Trash2, ArrowRight } from 'lucide-react';
import './SavedJobs.css';

const SAVED = [
  { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Remote', salary: '$95k – $130k', type: 'Full-time', tags: ['React', 'TypeScript'], savedAt: '2 days ago', logo: 'G', color: '#4285F4' },
  { id: 2, title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$140k – $180k', type: 'Full-time', tags: ['Python', 'PyTorch'], savedAt: '4 days ago', logo: 'O', color: '#10b981' },
  { id: 3, title: 'UX Designer', company: 'Figma', location: 'Remote', salary: '$90k – $120k', type: 'Full-time', tags: ['Figma', 'Prototyping'], savedAt: '1 week ago', logo: 'F', color: '#a259ff' },
  { id: 4, title: 'Backend Engineer', company: 'Stripe', location: 'Hybrid · NYC', salary: '$110k – $150k', type: 'Full-time', tags: ['Go', 'Kubernetes'], savedAt: '1 week ago', logo: 'S', color: '#635BFF' },
];

export default function SavedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(SAVED);

  const remove = (id) => setJobs(jobs.filter(j => j.id !== id));

  return (
    <div className="saved-page">
      <div className="saved-header">
        <div>
          <h1>Saved Jobs</h1>
          <p>{jobs.length} job{jobs.length !== 1 ? 's' : ''} bookmarked</p>
        </div>
        <button className="browse-btn" onClick={() => navigate('/dashboard/student/jobs')}>
          Browse More <ArrowRight size={15} />
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="saved-empty">
          <Bookmark size={40} />
          <h2>No saved jobs yet</h2>
          <p>Browse AI-matched jobs and bookmark the ones that interest you.</p>
          <button onClick={() => navigate('/dashboard/student/jobs')}>Explore Jobs</button>
        </div>
      ) : (
        <div className="saved-list">
          {jobs.map(job => (
            <div key={job.id} className="saved-item">
              <div className="saved-logo" style={{ background: `${job.color}22`, color: job.color }}>
                {job.logo}
              </div>
              <div className="saved-info">
                <h3>{job.title}</h3>
                <span className="saved-company">{job.company}</span>
                <div className="saved-meta">
                  <span><MapPin size={12} /> {job.location}</span>
                  <span><DollarSign size={12} /> {job.salary}</span>
                  <span><Clock size={12} /> {job.type}</span>
                </div>
                <div className="saved-tags">
                  {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="saved-actions">
                <span className="saved-date">Saved {job.savedAt}</span>
                <button className="apply-saved-btn" onClick={() => navigate(`/dashboard/student/apply/${job.id}`)}>
                  Apply <ArrowRight size={14} />
                </button>
                <button className="remove-saved-btn" onClick={() => remove(job.id)} title="Remove">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}