// Candidates.jsx — Page to manage all candidates

import { useState } from 'react';
import CandidateForm from '../components/CandidateForm';
import CandidateList from '../components/CandidateList';
import { Plus, X } from 'lucide-react';

const Candidates = () => {
  const [showForm, setShowForm] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // triggers useEffect in CandidateList
    if (editCandidate) {
      setEditCandidate(null);
      setShowForm(false);
    }
  };

  const handleEdit = (candidate) => {
    setEditCandidate(candidate);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Candidates</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and search candidate profiles</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditCandidate(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
            showForm
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {showForm ? <><X size={16} /> Close Form</> : <><Plus size={16} /> Add Candidate</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form — shows on left when open */}
        {(showForm || editCandidate) && (
          <div className="lg:col-span-1">
            <CandidateForm
              editCandidate={editCandidate}
              onSuccess={handleSuccess}
              onCancel={() => { setShowForm(false); setEditCandidate(null); }}
            />
          </div>
        )}

        {/* Candidate List */}
        <div className={showForm || editCandidate ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CandidateList
            onEdit={handleEdit}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default Candidates;