import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Camera, Save, Globe, Users, Building2, 
  Lock, Bell, Shield, Key, Eye, EyeOff
} from 'lucide-react';
import './CompanyProfile.css';

const INITIAL = {
  name: 'TechCorp Inc.', tagline: 'Building the future of technology.',
  industry: 'Software & Technology', size: '51-200',
  website: 'https://techcorp.io', email: 'hr@techcorp.io',
  founded: '2018', headquartersCity: 'San Francisco', headquartersCountry: 'USA',
  description: 'TechCorp is a fast-growing software company specializing in AI-powered developer tools and enterprise SaaS solutions.',
};

export default function CompanyProfile() {
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'profile';

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setSaved(false); };

  if (activeTab === 'settings') {
    return (
      <div className="cp-page">
        <div className="cp-header">
          <h1>Account Settings</h1>
          <button className="cp-save-btn" onClick={() => setSaved(true)}>
            <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="cp-grid">
          <div className="cp-panel">
            <h3 className="cp-section"><Lock size={16} style={{marginRight: 8}}/> Password & Security</h3>
            <div className="cp-field"><label>Current Password</label><input type="password" placeholder="••••••••" className="cp-input" /></div>
            <div className="cp-row">
              <div className="cp-field"><label>New Password</label><input type="password" placeholder="••••••••" className="cp-input" /></div>
              <div className="cp-field"><label>Confirm New Password</label><input type="password" placeholder="••••••••" className="cp-input" /></div>
            </div>
            <button className="logo-edit-btn" style={{marginTop: 8, width: 'fit-content'}}>Change Password</button>
          </div>

          <div className="cp-panel">
            <h3 className="cp-section"><Bell size={16} style={{marginRight: 8}}/> Notification Preferences</h3>
            <div className="settings-toggle-list">
              {[
                { label: 'New Applicants', desc: 'Get notified when someone applies for a job.' },
                { label: 'Application Reviews', desc: 'Alerts for when your team reviews an applicant.' },
                { label: 'Security Alerts', desc: 'Critical alerts about your account or verification status.' },
                { label: 'Newsletter', desc: 'Platform updates and tech news summaries.' }
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

          <div className="cp-panel" style={{borderColor: 'rgba(239, 68, 68, 0.2)'}}>
            <h3 className="cp-section" style={{color: '#ef4444'}}>Danger Zone</h3>
            <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>Once you delete your company account, there is no going back. Please be certain.</p>
            <button className="logo-edit-btn" style={{borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', marginTop: 8, width: 'fit-content'}}>Delete Account</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <div className="cp-header">
        <h1>Company Profile</h1>
        <button className="cp-save-btn" onClick={() => setSaved(true)}>
          <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="cp-grid">
        {/* Logo + Brand */}
        <div className="cp-panel brand-panel">
          <div className="brand-logo-wrap">
            <div className="brand-logo"><Building2 size={36} /></div>
            <button className="logo-edit-btn"><Camera size={14} /> Change Logo</button>
          </div>
          <h2 className="brand-name">{form.name}</h2>
          <p className="brand-tagline">{form.tagline}</p>
          <div className="brand-meta">
            <span><Globe size={13} /> <a href={form.website} target="_blank" rel="noreferrer">{form.website.replace('https://', '')}</a></span>
            <span><Users size={13} /> {form.size} employees</span>
            <span><Building2 size={13} /> Founded {form.founded}</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="cp-panel">
          <h3 className="cp-section">Company Information</h3>
          <div className="cp-row">
            <div className="cp-field"><label>Company Name</label><input name="name" value={form.name} onChange={handleChange} className="cp-input" /></div>
            <div className="cp-field"><label>Tagline</label><input name="tagline" value={form.tagline} onChange={handleChange} className="cp-input" /></div>
          </div>
          <div className="cp-row">
            <div className="cp-field"><label>Industry</label>
              <select name="industry" value={form.industry} onChange={handleChange} className="cp-input">
                {['Software & Technology','Finance & FinTech','Healthcare','E-Commerce','Media','Education','Other'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="cp-field"><label>Company Size</label>
              <select name="size" value={form.size} onChange={handleChange} className="cp-input">
                {['1-10','11-50','51-200','201-500','500-1000','1000+'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="cp-field"><label>About the Company</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="cp-textarea" rows={4} />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="cp-panel">
          <h3 className="cp-section">Contact & Location</h3>
          <div className="cp-row">
            <div className="cp-field"><label>Website</label><input name="website" value={form.website} onChange={handleChange} className="cp-input" /></div>
            <div className="cp-field"><label>HR Email</label><input name="email" value={form.email} onChange={handleChange} className="cp-input" /></div>
          </div>
          <div className="cp-row">
            <div className="cp-field"><label>Headquarters City</label><input name="headquartersCity" value={form.headquartersCity} onChange={handleChange} className="cp-input" /></div>
            <div className="cp-field"><label>Country</label><input name="headquartersCountry" value={form.headquartersCountry} onChange={handleChange} className="cp-input" /></div>
            <div className="cp-field"><label>Founded Year</label><input name="founded" value={form.founded} onChange={handleChange} className="cp-input" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}