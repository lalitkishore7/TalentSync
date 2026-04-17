import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Eye, EyeOff, Check, Upload, Building2, GraduationCap, MapPin, FileCheck, Globe, Layers, Calendar } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { loginUser, registerUser, setUserDirectly } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Content tailoring based on role
  const isStudent = role === 'student';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // Company specific
    companyName: '',
    gstNumber: '',
    regId: '',
    hqAddress: '',
    // Student specific
    university: '',
    degree: '',
    year: '1st Year'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && (!formData.firstName || !formData.lastName))) {
      setError('Please fill in all account details.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginUser(formData.email, formData.password);
      } else {
        const payload = { ...formData, role: isStudent ? 'student' : 'company', isVerified: isStudent };
        data = await registerUser(payload);
      }
      navigate('/dashboard/' + (data.user?.role || role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = isStudent
    ? [
      { id: 1, label: 'Account Access' },
      { id: 2, label: 'Academic Profile' },
      { id: 3, label: 'Success' }
    ]
    : [
      { id: 1, label: 'Account Access' },
      { id: 2, label: 'Legal Verification' },
      { id: 3, label: 'Wait for Approval' }
    ];

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side Visual Content */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <Shield size={24} /> TalentSync
            </div>

            <h1 className="auth-title">
              {step === 1 ? 'Join the Network' : (isStudent ? 'Your Future Starts Here' : 'Protecting Talent')}
            </h1>
            <p className="auth-subtitle">
              {step === 1 
                ? `Create your ${role} account to get started.`
                : (isStudent ? "Tell us about your studies to find the best job matches." : "Provide your company legal information for government verification.")}
            </p>

            <div className="auth-steps">
              {steps.map((s, index) => (
                <div key={s.id} className={`step-item ${step >= s.id ? 'active' : ''}`}>
                  <div className="step-number">
                    {step > s.id ? <Check size={12} /> : s.id}
                  </div>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-container">
          <div className="auth-top-nav">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} /> Back
            </Link>
            {!isLogin && step === 2 && (
              <button className="step-back-btn" onClick={() => setStep(1)}>
                Change Account Info
              </button>
            )}
          </div>

          <div className="form-header">
            <h2 className="form-title">
              {isLogin ? 'Welcome Back' : (step === 1 ? 'Create Account' : (isStudent ? 'Education Details' : 'Legal Verification'))}
            </h2>
            <p className="form-subtitle">
              {isLogin
                ? 'Access your TalentSync dashboard.'
                : (step === 1 ? 'Step 1 of 2: Basic Information' : 'Step 2 of 2: Finalizing Registration')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {!isLogin && step === 1 && (
                  <div className="social-login">
                    <button type="button" className="btn-social">
                      <Globe size={20} className="icon-google" />
                      <span>Google</span>
                    </button>
                    <button type="button" className="btn-social">
                      <Layers size={20} className="icon-github" />
                      <span>GitHub</span>
                    </button>
                  </div>
                )}
                <div className="auth-divider">
                  <span>OR</span>
                </div>


                <form className="auth-form" onSubmit={isLogin ? handleSubmit : handleNext}>
                  {error && <div className="error-alert">{error}</div>}

                  {!isLogin && (
                    <div className="form-row">
                      <div className="input-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="auth-input" placeholder="John" required />
                      </div>
                      <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="auth-input" placeholder="Doe" required />
                      </div>
                    </div>
                  )}

                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="auth-input" placeholder="john@example.com" required />
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-input"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-submit">
                    {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Continue to Step 2')}
                  </button>
                </form>

                <div className="auth-footer">
                  {isLogin ? "New to TalentSync?" : "Already joined?"}
                  <button onClick={() => { setIsLogin(!isLogin); setStep(1); }}>
                    {isLogin ? 'Create Account' : 'Log in here'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form className="auth-form" onSubmit={handleSubmit}>
                  {isStudent ? (
                    <>
                      <div className="input-group">
                        <label>University / Institution</label>
                        <div className="input-with-icon">
                          <Building2 size={16} />
                          <input type="text" name="university" value={formData.university} onChange={handleChange} className="auth-input" required />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Degree Program</label>
                        <div className="input-with-icon">
                          <GraduationCap size={16} />
                          <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="auth-input" required />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Year of Study</label>
                        <div className="input-with-icon">
                          <Calendar size={16} />
                          <select name="year" value={formData.year} onChange={handleChange} className="auth-input">
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                            <option>Graduate</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="input-group">
                        <label>Company Legal Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="auth-input" placeholder="TechCorp Intl." required />
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label>GST / PAN Number</label>
                          <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="auth-input" placeholder="GSTIN1234..." required />
                        </div>
                        <div className="input-group">
                          <label>Government Reg ID</label>
                          <input type="text" name="regId" value={formData.regId} onChange={handleChange} className="auth-input" placeholder="REG-9901" required />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Corporate Headquarters Address</label>
                        <div className="input-with-icon">
                          <MapPin size={16} />
                          <input type="text" name="hqAddress" value={formData.hqAddress} onChange={handleChange} className="auth-input" placeholder="123 Business Way, SF" required />
                        </div>
                      </div>

                      <div className="upload-section">
                        <label>Upload Registration Documents (PDF/JPG)</label>
                        <div className={`upload-zone ${uploadedFile ? 'has-file' : ''}`} onClick={() => setUploadedFile('gov_doc.pdf')}>
                          {uploadedFile ? (
                            <div className="file-info">
                              <FileCheck size={24} className="success-icon" />
                              <span>{uploadedFile} uploaded</span>
                            </div>
                          ) : (
                            <>
                              <Upload size={24} />
                              <p>Click to browse or drag documents here</p>
                              <span>Government certification, tax docs, or CIN</span>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Finalizing...' : 'Register and Continue'}
                  </button>
                  <p className="terms-text">
                    By clicking Register, you agree to our <a href="#">Terms of Service</a> and <a href="#">Verification Guidelines</a>.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
