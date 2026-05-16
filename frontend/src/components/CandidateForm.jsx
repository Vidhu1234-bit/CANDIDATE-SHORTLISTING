// CandidateForm.jsx — Form to add or edit a candidate

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Code, Clock, FileText, Save, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CandidateForm = ({ editCandidate, onSuccess, onCancel }) => {
  // Form state — all the values in the form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // If editing, pre-fill the form with existing candidate data
  useEffect(() => {
    if (editCandidate) {
      setFormData({
        name: editCandidate.name || '',
        email: editCandidate.email || '',
        skills: Array.isArray(editCandidate.skills)
          ? editCandidate.skills.join(', ')
          : editCandidate.skills || '',
        experience: editCandidate.experience?.toString() || '',
        bio: editCandidate.bio || ''
      });
    }
  }, [editCandidate]);

  // Handle input changes — updates form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form before submitting
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.skills.trim()) newErrors.skills = 'At least one skill is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
      newErrors.experience = 'Experience must be a positive number';
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience)
      };

      let response;
      if (editCandidate) {
        // UPDATE existing candidate
        response = await axios.put(
          `${API_URL}/api/candidates/${editCandidate._id}`,
          payload
        );
      } else {
        // CREATE new candidate
        response = await axios.post(`${API_URL}/api/candidates`, payload);
      }

      toast.success(response.data.message);
      onSuccess(); // Tell parent component to refresh the list

      // Reset form if adding new
      if (!editCandidate) {
        setFormData({ name: '', email: '', skills: '', experience: '', bio: '' });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
      errors[fieldName] ? 'border-red-500' : 'border-slate-700'
    }`;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {editCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <User size={14} className="inline mr-1" /> Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className={inputClass('name')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <Mail size={14} className="inline mr-1" /> Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. john@example.com"
            className={inputClass('email')}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Skills Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <Code size={14} className="inline mr-1" /> Skills * (comma separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB, Python"
            className={inputClass('skills')}
          />
          {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
          <p className="text-slate-500 text-xs mt-1">Separate skills with commas</p>
        </div>

        {/* Experience Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <Clock size={14} className="inline mr-1" /> Years of Experience *
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 3"
            min="0"
            max="50"
            className={inputClass('experience')}
          />
          {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <FileText size={14} className="inline mr-1" /> Bio / Projects
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Describe the candidate's background, projects, achievements..."
            rows={3}
            className={`${inputClass('bio')} resize-none`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              {editCandidate ? 'Update Candidate' : 'Add Candidate'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;