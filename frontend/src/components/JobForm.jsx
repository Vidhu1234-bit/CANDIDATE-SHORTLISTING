// JobForm.jsx — Form for recruiter to enter job requirements

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Briefcase, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JobForm = ({ onResults }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    requiredSkills: '',
    preferredSkills: '',
    minExperience: '',
    jobDescription: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMatch = async () => {
    if (!formData.requiredSkills.trim()) {
      toast.error('Please enter at least one required skill');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/match`, {
        requiredSkills: formData.requiredSkills,
        preferredSkills: formData.preferredSkills,
        minExperience: formData.minExperience
      });
      onResults(response.data, formData);
      toast.success(`Found ${response.data.results.length} candidates!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Matching failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all";

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
          <Briefcase size={16} className="text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Job Requirements</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Full Stack Developer"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Required Skills * <span className="text-slate-500 font-normal">(comma separated)</span>
          </label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Preferred Skills <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="preferredSkills"
            value={formData.preferredSkills}
            onChange={handleChange}
            placeholder="e.g. Docker, AWS, GraphQL"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Minimum Experience (years)
          </label>
          <input
            type="number"
            name="minExperience"
            value={formData.minExperience}
            onChange={handleChange}
            placeholder="e.g. 2"
            min="0"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Job Description <span className="text-slate-500 font-normal">(optional, for AI)</span>
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          onClick={handleMatch}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Matching...
            </>
          ) : (
            <>
              <Search size={16} />
              Find Matching Candidates
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobForm;