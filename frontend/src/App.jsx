import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/dashboard/:role" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
