import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Camera, Plus, X, Save, 
  Lock, Bell, Shield, Key, FileText, ExternalLink
} from 'lucide-react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import './StudentProfile.css';


const INITIAL = {
  firstName: 'Alex', lastName: 'Johnson',
  email: 'alex@example.com', phone: '+1 (555) 234-5678',
  bio: 'Passionate software engineering student with a focus on full-stack web development and machine learning.',
  university: 'MIT', degree: 'B.Sc. Computer Science', year: '3rd Year',
  skills: ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB'],
  github: 'github.com/alexj', linkedin: 'linkedin.com/in/alexj',
};

export default function StudentProfile() {
  const [form, setForm] = useState(INITIAL);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'profile';

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setSaved(false); };
  const addSkill = () => { if (newSkill.trim()) { setForm({ ...form, skills: [...form.skills, newSkill.trim()] }); setNewSkill(''); } };
  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(sk => sk !== s) });
  const handleSave = () => setSaved(true);

  if (activeTab === 'settings') {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h1>Account Settings</h1>
          <button className="save-profile-btn" onClick={handleSave}>
            <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="profile-grid">
          <div className="profile-panel" style={{gridColumn: 'span 2'}}>
            <h3 className="section-title"><Lock size={16} style={{marginRight: 8, verticalAlign: 'middle'}}/> Password & Security</h3>
            <div className="profile-field-row">
              <div className="profile-field">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" className="p-input" />
              </div>
            </div>
            <div className="profile-field-row">
              <div className="profile-field">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" className="p-input" />
              </div>
              <div className="profile-field">
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="p-input" />
              </div>
            </div>
            <button className="add-skill-btn" style={{width: 'fit-content', padding: '0 20px', marginTop: 10, fontSize: 13}}>Change Password</button>
          </div>

          <div className="profile-panel" style={{gridColumn: 'span 2'}}>
            <h3 className="section-title"><Bell size={16} style={{marginRight: 8, verticalAlign: 'middle'}}/> Notification Preferences</h3>
            <div className="settings-toggle-list">
              {[
                { label: 'Job Alerts', desc: 'Get notified when new jobs matching your skills are posted.' },
                { label: 'Application Updates', desc: 'Alerts when a company reviews or updates your application status.' },
                { label: 'Platform Messages', desc: 'Notifications for direct messages from recruiters.' },
                { label: 'Tech News Digest', desc: 'Weekly summary of top IT news and trends.' }
              ].map(item => (
                <div key={item.label} className="settings-toggle-row">
                  <div>
                    <div style={{fontWeight: '600', fontSize: '14px'}}>{item.label}</div>
                    <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{item.desc}</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              ))}
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

      <div className="profile-grid">
        {/* Avatar Card */}
        <div className="profile-panel avatar-panel">
          <div className="avatar-circle">
            <span>{form.firstName[0]}{form.lastName[0]}</span>
            <button className="avatar-edit"><Camera size={14} /></button>
          </div>
          <h2 className="avatar-name">{form.firstName} {form.lastName}</h2>
          <span className="avatar-school">{form.university} · {form.year}</span>
          <div className="avatar-links">
            <a href={`https://${form.github}`} target="_blank" rel="noreferrer" className="profile-link">GitHub</a>
            <a href={`https://${form.linkedin}`} target="_blank" rel="noreferrer" className="profile-link">LinkedIn</a>
          </div>
        </div>

        {/* Main Info */}
        <div className="profile-panel">
          <h3 className="section-title">Personal Information</h3>
          <div className="profile-field-row">
            <div className="profile-field">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="p-input" />
            </div>
            <div className="profile-field">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="p-input" />
            </div>
          </div>
          <div className="profile-field-row">
            <div className="profile-field">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="p-input" />
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

        {/* Education */}
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

        {/* Resume Section */}
        <div className="profile-panel">
          <h3 className="section-title">My Resume</h3>
          <div className="resume-status-card">
            <div className="resume-info">
              <div className="resume-icon-bg">
                <FileText size={20} />
              </div>
              <div className="resume-details">
                <span className="file-name">Alex_Johnson_Resume.pdf</span>
                <span className="upload-date">Uploaded on Apr 12, 2026</span>
              </div>
            </div>
            <button className="view-resume-btn" onClick={() => window.open('/resume_sample.pdf', '_blank')}>
              View <ExternalLink size={14} />
            </button>
          </div>
        </div>


        {/* Skills */}
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

        {/* Social */}
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