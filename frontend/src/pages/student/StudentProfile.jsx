import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Camera, Plus, X, Save, 
  Lock, Bell, FileText, ExternalLink
} from 'lucide-react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import './StudentProfile.css';

export default function StudentProfile() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    bio: '', university: '', degree: '', year: '1st Year',
    skills: [], github: '', linkedin: ''
  });
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const studentData = res.data;
      setForm({
        firstName: studentData.user?.firstName || '',
        lastName: studentData.user?.lastName || '',
        email: studentData.user?.email || '',
        phone: studentData.phone || '',
        bio: studentData.bio || '',
        university: studentData.university || '',
        degree: studentData.degree || '',
        year: studentData.year || '1st Year',
        skills: studentData.skills || [],
        github: studentData.github || '',
        linkedin: studentData.linkedin || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setSaved(false);
      const token = localStorage.getItem('token');
      await axios.put('/api/student/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes.');
    }
  };

  const handleChange = (e) => { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
    setSaved(false); 
  };

  const addSkill = () => { 
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) { 
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] }); 
      setNewSkill(''); 
    } 
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(sk => sk !== s) });

  if (loading) return <div className="loading-state">Syncing your profile...</div>;

  if (activeTab === 'settings') {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h1>Account Settings</h1>
          <button className="save-profile-btn" onClick={handleSave}>
            <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="profile-grid">
          <div className="settings-card" style={{gridColumn: 'span 2'}}>
            <h3 className="settings-section-title"><Lock size={18} style={{marginRight: 8, verticalAlign: 'middle', color: '#3b82f6'}}/> Password & Security</h3>
            <div className="settings-content-wrapper">
              <div className="profile-field-row">
                <div className="profile-field">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" className="p-input settings-input" />
                </div>
              </div>
              <div className="profile-field-row">
                <div className="profile-field">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" className="p-input settings-input" />
                </div>
                <div className="profile-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="p-input settings-input" />
                </div>
              </div>
              <div className="settings-divider"></div>
              <button className="btn-change-password">Update Password</button>
            </div>
          </div>

          <div className="settings-card" style={{gridColumn: 'span 2'}}>
            <h3 className="settings-section-title"><Bell size={18} style={{marginRight: 8, verticalAlign: 'middle', color: '#3b82f6'}}/> Notification Preferences</h3>
            <div className="settings-content-wrapper">
              <div className="settings-toggle-list">
                {[
                  { label: 'Job Alerts', desc: 'Get notified when new jobs matching your skills are posted.' },
                  { label: 'Application Updates', desc: 'Alerts when a company reviews or updates your application status.' },
                  { label: 'Platform Messages', desc: 'Notifications for direct messages from recruiters.' },
                  { label: 'Tech News Digest', desc: 'Weekly summary of top IT news and trends.' }
                ].map((item, index) => (
                  <div key={item.label}>
                    <div className="settings-toggle-row">
                      <div>
                        <div className="settings-toggle-label">{item.label}</div>
                        <div className="settings-toggle-desc">{item.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                    {index < 3 && <div className="settings-divider"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button className="save-profile-btn" onClick={handleSave}>
          <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="profile-grid">
        <div className="profile-panel avatar-panel">
          <div className="avatar-circle">
            <span>{form.firstName[0]}{form.lastName[0]}</span>
            <button className="avatar-edit"><Camera size={14} /></button>
          </div>
          <h2 className="avatar-name">{form.firstName} {form.lastName}</h2>
          <span className="avatar-school">{form.university || 'University not set'} · {form.year}</span>
          <div className="avatar-links">
            <a href={form.github ? `https://${form.github}` : '#'} target="_blank" rel="noreferrer" className="profile-link">GitHub</a>
            <a href={form.linkedin ? `https://${form.linkedin}` : '#'} target="_blank" rel="noreferrer" className="profile-link">LinkedIn</a>
          </div>
        </div>

        <div className="profile-panel">
          <h3 className="section-title">Personal Information</h3>
          <div className="profile-field-row">
            <div className="profile-field">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="p-input" disabled />
            </div>
            <div className="profile-field">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="p-input" disabled />
            </div>
          </div>
          <div className="profile-field-row">
            <div className="profile-field">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="p-input" disabled />
            </div>
            <div className="profile-field">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="p-input" />
            </div>
          </div>
          <div className="profile-field">
            <label>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="p-textarea" rows={3} />
          </div>
        </div>

        <div className="profile-panel">
          <h3 className="section-title">Education</h3>
          <div className="profile-field-row">
            <div className="profile-field">
              <label>University</label>
              <input name="university" value={form.university} onChange={handleChange} className="p-input" />
            </div>
            <div className="profile-field">
              <label>Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange} className="p-input" />
            </div>
          </div>
          <div className="profile-field">
            <CustomDropdown 
              label="Year of Study"
              options={['1st Year','2nd Year','3rd Year','4th Year','Graduate']}
              value={form.year}
              onChange={(val) => setForm({ ...form, year: val })}
            />
          </div>
        </div>

        <div className="profile-panel">
          <h3 className="section-title">My Resume</h3>
          <div className="resume-status-card">
            <div className="resume-info">
              <div className="resume-icon-bg">
                <FileText size={20} />
              </div>
              <div className="resume-details">
                <span className="file-name">{form.firstName}_Resume.pdf</span>
                <span className="upload-date">Ready for AI Matching</span>
              </div>
            </div>
            <button className="view-resume-btn" onClick={() => navigate('/dashboard/student/resume')}>
              Manage <ExternalLink size={14} />
            </button>
          </div>
        </div>

        <div className="profile-panel">
          <h3 className="section-title">Skills</h3>
          <div className="skills-chips">
            {form.skills.map(s => (
              <span key={s} className="skill-tag">
                {s}
                <button onClick={() => removeSkill(s)}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="add-skill-row">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill..."
              className="p-input"
            />
            <button className="add-skill-btn" onClick={addSkill}><Plus size={16} /></button>
          </div>
        </div>

        <div className="profile-panel">
          <h3 className="section-title">Social Links</h3>
          <div className="profile-field">
            <label>GitHub</label>
            <input name="github" value={form.github} onChange={handleChange} className="p-input" placeholder="github.com/username" />
          </div>
          <div className="profile-field">
            <label>LinkedIn</label>
            <input name="linkedin" value={form.linkedin} onChange={handleChange} className="p-input" placeholder="linkedin.com/in/username" />
          </div>
        </div>
      </div>
    </div>
  );
}