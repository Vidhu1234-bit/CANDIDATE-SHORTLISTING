// Dashboard.jsx — Home page with stats overview

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Star, TrendingUp, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/candidates`);
        const candidates = response.data.data;
        setStats({
          total: candidates.length,
          shortlisted: candidates.filter(c => c.isShortlisted).length
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.total,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
      border: 'border-indigo-400/20'
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20'
    },
    {
      title: 'Match Rate',
      value: stats.total > 0 ? `${Math.round((stats.shortlisted / stats.total) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/20'
    },
    {
      title: 'AI Enabled',
      value: 'Active',
      icon: Brain,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/20'
    }
  ];

  const quickActions = [
    {
      title: 'Add Candidates',
      description: 'Add candidate profiles to the system',
      path: '/candidates',
      icon: '👤',
      color: 'from-indigo-600 to-indigo-800'
    },
    {
      title: 'Job Matching',
      description: 'Match candidates to job requirements',
      path: '/job-match',
      icon: '🎯',
      color: 'from-cyan-600 to-cyan-800'
    },
    {
      title: 'AI Shortlist',
      description: 'Use AI to rank and analyze candidates',
      path: '/ai-results',
      icon: '🤖',
      color: 'from-purple-600 to-purple-800'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to <span className="gradient-text">TalentAI</span>
        </h1>
        <p className="text-slate-400">
          AI-powered candidate shortlisting for smarter hiring decisions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ title, value, icon: Icon, color, bg, border }) => (
          <div
            key={title}
            className={`bg-slate-800 rounded-xl border ${border} p-5 card-hover fade-in`}
          >
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className={`text-2xl font-bold ${color}`}>
              {loading ? '...' : value}
            </div>
            <div className="text-slate-400 text-sm mt-1">{title}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActions.map(({ title, description, path, icon, color }) => (
          <Link
            key={path}
            to={path}
            className={`bg-gradient-to-br ${color} rounded-xl p-6 card-hover fade-in block`}
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
            <p className="text-white/70 text-sm">{description}</p>
          </Link>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 fade-in">
        <h2 className="text-white font-semibold text-lg mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Add Candidates', desc: 'Enter candidate details, skills, and experience', icon: '👤' },
            { step: '2', title: 'Set Job Requirements', desc: 'Define the skills and experience needed', icon: '📋' },
            { step: '3', title: 'Run Matching', desc: 'System calculates match scores automatically', icon: '🎯' },
            { step: '4', title: 'AI Analysis', desc: 'AI ranks candidates and generates insights', icon: '🤖' }
          ].map(({ step, title, desc, icon }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
                {icon}
              </div>
              <div className="text-indigo-400 text-xs font-medium mb-1">Step {step}</div>
              <div className="text-white font-medium text-sm mb-1">{title}</div>
              <div className="text-slate-500 text-xs">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;