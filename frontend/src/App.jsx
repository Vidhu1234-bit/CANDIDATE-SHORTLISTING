// App.jsx — Main application component
// Sets up routing between different pages

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import JobMatch from './pages/JobMatch';
import AIResults from './pages/AIResults';

function App() {
  return (
    <Router>
      {/* Toast notifications appear here — top right of screen */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }}
      />

      {/* Navigation bar at the top */}
      <Navbar />

      {/* Main content area */}
      <main className="min-h-screen bg-slate-900 pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/job-match" element={<JobMatch />} />
          <Route path="/ai-results" element={<AIResults />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;