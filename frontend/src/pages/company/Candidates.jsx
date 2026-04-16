import { useState } from 'react';
import { 
  Users, Mail, Phone, Download, CheckCircle2, XCircle, 
  ExternalLink, Search, Filter, MoreVertical, Building2 
} from 'lucide-react';
import './CompanyDashboard.css'; // Reusing base panel styles

const CANDIDATES = [
  { id: 1, name: 'Arjun Mehta', role: 'Frontend Developer', email: 'arjun@example.com', match: 94, status: 'Shortlisted', applied: '2 days ago', avatar: 'AM' },
  { id: 2, name: 'Sarah Jenkins', role: 'UX Designer', email: 'sarah.j@example.com', match: 89, status: 'New', applied: '5 hours ago', avatar: 'SJ' },
  { id: 3, name: 'Michael Chen', role: 'Backend Engineer', email: 'mchen@example.com', match: 82, status: 'Under Review', applied: '1 day ago', avatar: 'MC' },
  { id: 4, name: 'Priya Sharma', role: 'Frontend Developer', email: 'psharma@example.com', match: 78, status: 'Rejected', applied: '3 days ago', avatar: 'PS' },
];

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="company-dash" style={{ padding: '48px 56px' }}>
      <div className="dash-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="dash-title">Candidate Pipeline</h1>
          <p className="dash-subtitle">Manage applicants and track their status through the hiring funnel.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <div className="search-wrap" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '10px', 
                padding: '10px 16px 10px 36px', 
                color: 'var(--text-main)',
                width: '260px'
              }} 
            />
          </div>
          <button className="filter-btn" style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '10px', 
            padding: '10px 16px', 
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="dash-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>CANDIDATE</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>APPLIED ROLE</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>MATCH %</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>APPLIED</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', 
                      background: 'rgba(255,107,0,0.1)', color: 'var(--accent)', 
                      display: 'flex', alignItems: 'center', justifyCenter: 'center', 
                      fontSize: '13px', fontWeight: '700',
                      justifyContent: 'center'
                    }}>
                      {c.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{c.role}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.match}%`, height: '100%', background: 'var(--accent)' }}></div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{c.match}%</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                    background: c.status === 'Shortlisted' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                    color: c.status === 'Shortlisted' ? '#10b981' : 'var(--text-muted)',
                    border: c.status === 'Shortlisted' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{c.applied}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Mail size={16} /></button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Download size={16} /></button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
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
