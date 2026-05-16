// MatchResults.jsx — Shows the match results after job matching

import { CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MatchResults = ({ results }) => {
  if (!results) return null;

  const getRankBadge = (rank) => {
    const styles = {
      'High Match': 'bg-green-400/10 text-green-400 border-green-400/20',
      'Medium Match': 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      'Low Match': 'bg-red-400/10 text-red-400 border-red-400/20'
    };
    return styles[rank] || styles['Low Match'];
  };

  const getRankIcon = (rank) => {
    if (rank === 'High Match') return <CheckCircle size={14} />;
    if (rank === 'Medium Match') return <AlertCircle size={14} />;
    return <XCircle size={14} />;
  };

  const handleShortlist = async (candidateId) => {
    try {
      const response = await axios.patch(`${API_URL}/api/candidates/${candidateId}/shortlist`);
      toast.success(response.data.message);
    } catch {
      toast.error('Failed to update shortlist');
    }
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Match', count: results.highMatches, color: 'text-green-400' },
          { label: 'Medium Match', count: results.mediumMatches, color: 'text-yellow-400' },
          { label: 'Low Match', count: results.lowMatches, color: 'text-red-400' }
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.results.map((result, index) => (
          <div
            key={result.candidate._id}
            className="bg-slate-800 rounded-xl border border-slate-700 p-4 card-hover"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Rank Number */}
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 shrink-0">
                #{index + 1}
              </div>

              {/* Candidate Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-white font-semibold">{result.candidate.name}</h3>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getRankBadge(result.rank)}`}>
                    {getRankIcon(result.rank)} {result.rank}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{result.candidate.email}</p>
                <p className="text-slate-400 text-xs">⏱ {result.candidate.experience}y exp</p>

                {/* Matched Skills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.matchedRequiredSkills.map((skill, i) => (
                    <span key={i} className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full">
                      ✓ {skill}
                    </span>
                  ))}
                  {result.missingRequiredSkills.map((skill, i) => (
                    <span key={i} className="text-xs bg-red-400/10 text-red-400 px-2 py-0.5 rounded-full">
                      ✗ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <div className={`text-2xl font-bold ${
                  result.matchScore >= 70 ? 'text-green-400' :
                  result.matchScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {result.matchScore}%
                </div>
                <div className="text-slate-500 text-xs">match score</div>

                {/* Score Bar */}
                <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      result.matchScore >= 70 ? 'bg-green-400' :
                      result.matchScore >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${result.matchScore}%` }}
                  />
                </div>
              </div>

              {/* Shortlist Button */}
              <button
                onClick={() => handleShortlist(result.candidate._id)}
                className="p-2 rounded-lg text-slate-400 bg-slate-700 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all shrink-0"
                title="Add to shortlist"
              >
                <Star size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchResults;