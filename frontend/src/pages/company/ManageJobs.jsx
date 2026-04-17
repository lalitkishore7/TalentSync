import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pause, Play, Trash2, Users, Plus } from 'lucide-react';
import './ManageJobs.css';

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter for current company's jobs if not already filtered by backend
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      // Fallback mocks
      setJobs([
        { id: 1, title: 'Frontend Developer', applicants: 42, posted: '5 days ago', deadline: '2025-12-31', active: true, tags: ['React', 'TypeScript'] },
        { id: 2, title: 'ML Engineer', applicants: 29, posted: '1 week ago', deadline: '2026-01-15', active: true, tags: ['Python', 'PyTorch'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/jobs/${id}`, 
        { active: !jobs.find(j => (j.id || j._id) === id).active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map(j => (j.id || j._id) === id ? { ...j, active: !j.active } : j));
    } catch (err) {
      console.error('Error toggling job:', err);
    }
  };

  const remove = async (id) => {
    try {
      if (!window.confirm('Delete this job posting forever?')) return;
      const token = localStorage.getItem('token');
      await axios.delete(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter(j => (j.id || j._id) !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  if (loading) return <div className="loading-state">Syncing your dashboard...</div>;

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
            <div key={job.id || job._id} className="table-row">
              <div className="tr-title">
                <span>{job.title}</span>
                <div className="tr-tags">
                  {job.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="tr-applicants">
                <Users size={14} /> {job.applicants || 0}
              </div>
              <span className="tr-meta">{job.posted || 'recently'}</span>
              <span className="tr-meta">{job.deadline || 'ongoing'}</span>
              <span className={`tr-status ${job.active ? 'active' : 'paused'}`}>
                {job.active ? 'Active' : 'Paused'}
              </span>
              <div className="tr-actions">
                <button className="action-btn" onClick={() => toggle(job.id || job._id)} title={job.active ? 'Pause' : 'Activate'}>
                  {job.active ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button className="action-btn danger" onClick={() => remove(job.id || job._id)} title="Delete">
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