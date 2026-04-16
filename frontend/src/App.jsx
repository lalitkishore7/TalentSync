import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import AIRecommendedJobs from './pages/student/AIRecommendedJobs';
import ApplyJob from './pages/student/ApplyJob';
import ResumeUpload from './pages/student/ResumeUpload';
import SavedJobs from './pages/student/SavedJobs';
import ITNewsFeed from './pages/student/ITNewsFeed';
import StudentProfile from './pages/student/StudentProfile';
import JobDetails from './pages/student/JobDetails';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostJob from './pages/company/PostJob';
import ManageJobs from './pages/company/ManageJobs';
import CompanyProfile from './pages/company/CompanyProfile';
import VerificationStatus from './pages/company/VerificationStatus';
import CompanyVerificationForm from './pages/company/CompanyVerificationForm';
import Candidates from './pages/company/Candidates';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:role" element={<Login />} />

          {/* Student Dashboard */}
          <Route path="/dashboard/student" element={<Dashboard role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="jobs" element={<AIRecommendedJobs />} />
            <Route path="apply/:jobId?" element={<ApplyJob />} />
            <Route path="resume" element={<ResumeUpload />} />
            <Route path="saved" element={<SavedJobs />} />
            <Route path="news" element={<ITNewsFeed />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="jobs/:jobId" element={<JobDetails />} />
          </Route>

          {/* Company Dashboard */}
          <Route path="/dashboard/company" element={<Dashboard role="company" />}>
            <Route index element={<CompanyDashboard />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="verification" element={<VerificationStatus />} />
            <Route path="verify-form" element={<CompanyVerificationForm />} />
            <Route path="candidates" element={<Candidates />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
