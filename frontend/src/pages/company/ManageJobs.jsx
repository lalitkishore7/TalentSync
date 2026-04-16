import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, Trash2, Users, Plus } from 'lucide-react';
import './ManageJobs.css';

const INITIAL_JOBS = [
  { id: 1, title: 'Frontend Developer', applicants: 42, posted: '5 days ago', deadline: '2025-12-31', active: true, tags: ['React', 'TypeScript'] },
  { id: 2, title: 'ML Engineer', applicants: 29, posted: '1 week ago', deadline: '2026-01-15', active: true, tags: ['Python', 'PyTorch'] },
  { id: 3, title: 'Backend Engineer', applicants: 67, posted: '2 weeks ago', deadline: '2025-12-15', active: false, tags: ['Go', 'Kubernetes'] },
  { id: 4, title: 'UX/UI Designer', applicants: 18, posted: '3 weeks ago', deadline: '2026-02-01', active: true, tags: ['Figma', 'Research'] },
];

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  const toggle = (id) => setJobs(jobs.map(j => j.id === id ? { ...j, active: !j.active } : j));
  const remove = (id) => setJobs(jobs.filter(j => j.id !== id));

  return (
    <div className="manage-page">
      <div className="manage-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>{jobs.filter(j => j.active).length} active · {jobs.filter(j => !j.active).length} paused</p>
        </div>
        <button className="mj-post-btn" onClick={() => navigate('/dashboard/company/post-job')}>
          <Plus size={15} /> Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="manage-empty">
          <p>No job postings yet.</p>
          <button onClick={() => navigate('/dashboard/company/post-job')}>Create Your First Job</button>
        </div>
      ) : (
        <div className="jobs-table">
          <div className="table-head">
            <span>Role</span><span>Applicants</span><span>Posted</span><span>Deadline</span><span>Status</span><span>Actions</span>
          </div>
          {jobs.map(job => (
            <div key={job.id} className="table-row">
              <div className="tr-title">
                <span>{job.title}</span>
                <div className="tr-tags">
                  {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="tr-applicants">
                <Users size={14} /> {job.applicants}
              </div>
              <span className="tr-meta">{job.posted}</span>
              <span className="tr-meta">{job.deadline}</span>
              <span className={`tr-status ${job.active ? 'active' : 'paused'}`}>
                {job.active ? 'Active' : 'Paused'}
              </span>
              <div className="tr-actions">
                <button className="action-btn" onClick={() => toggle(job.id)} title={job.active ? 'Pause' : 'Activate'}>
                  {job.active ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button className="action-btn danger" onClick={() => remove(job.id)} title="Delete">
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