// AIShortlist.jsx — AI-powered candidate analysis using OpenRouter

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Brain, Sparkles, MessageSquare, FileText } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AIShortlist = ({ jobData }) => {
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [activeTab, setActiveTab] = useState('ranking');

  const runAIAnalysis = async () => {
    if (!jobData?.requiredSkills) {
      toast.error('Please run job matching first to set required skills');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/ai/shortlist`, {
        ...jobData,
        jobTitle: jobData.jobTitle || 'Software Developer'
      });
      setAiResults(response.data);
      toast.success('AI analysis complete!');
    } catch (error) {
      const message = error.response?.data?.message || 'AI analysis failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'ranking', label: 'AI Ranking', icon: Sparkles },
    { id: 'questions', label: 'Interview Questions', icon: MessageSquare },
    { id: 'recommendation', label: 'Recommendation', icon: FileText }
  ];

  // Format AI text nicely (preserve line breaks)
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
          <Brain size={20} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">AI-Powered Shortlisting</h2>
          <p className="text-slate-400 text-sm">Powered by OpenRouter / Mistral AI</p>
        </div>
      </div>

      {/* Run AI Button */}
      <button
        onClick={runAIAnalysis}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mb-6"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI is analyzing candidates...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Run AI Analysis
          </>
        )}
      </button>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 animate-pulse">🤖</div>
          <p className="text-slate-300 font-medium">AI is reading candidate profiles...</p>
          <p className="text-slate-500 text-sm mt-1">This may take 10-20 seconds</p>
        </div>
      )}

      {/* AI Results */}
      {aiResults && !loading && (
        <div className="fade-in">
          {/* Stats */}
          <div className="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-700">
            <p className="text-slate-400 text-sm">
              ✅ Analyzed <span className="text-white font-medium">{aiResults.totalCandidatesAnalyzed}</span> candidates
              for <span className="text-indigo-400 font-medium">{aiResults.jobTitle}</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-slate-900 p-1 rounded-lg">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  activeTab === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
            {activeTab === 'ranking' && formatText(aiResults.aiRanking)}
            {activeTab === 'questions' && formatText(aiResults.interviewQuestions)}
            {activeTab === 'recommendation' && formatText(aiResults.recommendation)}
          </div>
        </div>
      )}

      {/* If no job data yet */}
      {!jobData?.requiredSkills && !aiResults && !loading && (
        <div className="text-center py-8 text-slate-500">
          <Brain size={40} className="mx-auto mb-3 opacity-30" />
          <p>Run job matching first, then AI analysis will use those requirements.</p>
        </div>
      )}
    </div>
  );
};

export default AIShortlist;