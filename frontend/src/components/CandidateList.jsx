// CandidateList.jsx — Displays all candidates in a searchable, filterable list

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Trash2, Edit, Star, StarOff, Filter, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CandidateList = ({ onEdit, refreshTrigger }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Fetch candidates whenever search/filter changes or refresh is triggered
  useEffect(() => {
    fetchCandidates();
  }, [search, filterSkill, filterExp, refreshTrigger]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // Build URL with query parameters for search and filter
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterSkill) params.append('skills', filterSkill);
      if (filterExp) params.append('minExp', filterExp);

      const response = await axios.get(
        `${API_URL}/api/candidates?${params.toString()}`
      );
      setCandidates(response.data.data);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/candidates/${id}`);
      toast.success('Candidate deleted');
      setDeleteId(null);
      fetchCandidates();
    } catch (error) {
      toast.error('Failed to delete candidate');
    }
  };

  const handleToggleShortlist = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/api/candidates/${id}/shortlist`);
      toast.success(response.data.message);
      fetchCandidates();
    } catch (error) {
      toast.error('Failed to update shortlist');
    }
  };

  const getRankColor = (score) => {
    if (score >= 70) return 'text-green-400 bg-green-400/10';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const clearFilters = () => {
    setSearch('');
    setFilterSkill('');
    setFilterExp('');
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Search and Filter Bar */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Skill filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterSkill}
              onChange={e => setFilterSkill(e.target.value)}
              placeholder="Filter by skill..."
              className="w-full sm:w-40 bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Experience filter */}
          <select
            value={filterExp}
            onChange={e => setFilterExp(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Experience</option>
            <option value="1">1+ years</option>
            <option value="2">2+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
          </select>

          {/* Clear filters */}
          {(search || filterSkill || filterExp) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-white text-sm"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-slate-400 text-sm">
        {loading ? 'Loading...' : `${candidates.length} candidate(s) found`}
      </p>

      {/* Loading State */}
      {loading && <LoadingSpinner text="Loading candidates..." />}

      {/* Empty State */}
      {!loading && candidates.length === 0 && (
        <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-white font-medium mb-2">No candidates found</h3>
          <p className="text-slate-400 text-sm">
            {search || filterSkill || filterExp
              ? 'Try adjusting your search or filters'
              : 'Add your first candidate using the form'}
          </p>
        </div>
      )}

      {/* Candidate Cards */}
      {!loading && candidates.map((candidate) => (
        <div
          key={candidate._id}
          className="bg-slate-800 rounded-xl border border-slate-700 p-5 card-hover"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Candidate Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-white font-semibold text-lg">{candidate.name}</h3>
                {candidate.isShortlisted && (
                  <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/20">
                    ⭐ Shortlisted
                  </span>
                )}
                {candidate.lastMatchScore !== null && candidate.lastMatchScore !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRankColor(candidate.lastMatchScore)}`}>
                    {candidate.lastMatchScore}% match
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-2">{candidate.email}</p>
              <p className="text-slate-400 text-sm mb-3">
                🕐 {candidate.experience} year{candidate.experience !== 1 ? 's' : ''} experience
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {candidate.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Bio */}
              {candidate.bio && (
                <p className="text-slate-500 text-sm line-clamp-2">{candidate.bio}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleToggleShortlist(candidate._id)}
                className={`p-2 rounded-lg transition-all ${
                  candidate.isShortlisted
                    ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                    : 'text-slate-400 bg-slate-700 hover:text-yellow-400 hover:bg-yellow-400/10'
                }`}
                title={candidate.isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
              >
                {candidate.isShortlisted ? <Star size={16} fill="currentColor" /> : <Star size={16} />}
              </button>

              <button
                onClick={() => onEdit && onEdit(candidate)}
                className="p-2 rounded-lg text-slate-400 bg-slate-700 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                title="Edit candidate"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => setDeleteId(candidate._id)}
                className="p-2 rounded-lg text-slate-400 bg-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Delete candidate"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {deleteId === candidate._id && (
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
              <p className="text-sm text-red-400">
                ⚠️ Are you sure you want to delete this candidate?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(candidate._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CandidateList;