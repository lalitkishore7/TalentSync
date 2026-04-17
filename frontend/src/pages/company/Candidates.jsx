import { useState } from 'react';
import { 
  Mail, Download, MoreVertical, Search, Filter
} from 'lucide-react';
import './Candidates.css';

const CANDIDATES = [
  { id: 1, name: 'Arjun Mehta', role: 'Frontend Developer', email: 'arjun@example.com', match: 94, status: 'Shortlisted', applied: '2 days ago', avatar: 'AM' },
  { id: 2, name: 'Sarah Jenkins', role: 'UX Designer', email: 'sarah.j@example.com', match: 89, status: 'New', applied: '5 hours ago', avatar: 'SJ' },
  { id: 3, name: 'Michael Chen', role: 'Backend Engineer', email: 'mchen@example.com', match: 82, status: 'Under Review', applied: '1 day ago', avatar: 'MC' },
  { id: 4, name: 'Priya Sharma', role: 'Frontend Developer', email: 'psharma@example.com', match: 78, status: 'Rejected', applied: '3 days ago', avatar: 'PS' },
];

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'shortlisted';
      case 'new': return 'new';
      case 'under review': return 'under-review';
      case 'rejected': return 'rejected';
      default: return '';
    }
  };

  return (
    <div className="candidates-page">
      <div className="candidates-header">
        <div>
          <h1>Candidate Pipeline</h1>
          <p>Manage applicants and track their status through the hiring funnel.</p>
        </div>
        <div className="header-actions">
          <div className="search-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search candidates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="candidates-panel">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Applied Role</th>
              <th>Match %</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      {c.avatar}
                    </div>
                    <div>
                      <div className="candidate-name">{c.name}</div>
                      <div className="candidate-email">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="role-text">{c.role}</td>
                <td>
                  <div className="match-bar-wrap">
                    <div className="match-bar-bg">
                      <div className="match-bar-fill" style={{ width: `${c.match}%` }}></div>
                    </div>
                    <span className="match-percent">{c.match}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="applied-date">{c.applied}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn" title="Message"><Mail size={16} /></button>
                    <button className="action-btn" title="Download Resume"><Download size={16} /></button>
                    <button className="action-btn" title="More Options"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
