// AIResults.jsx — AI shortlisting page

import { useState } from 'react';
import JobForm from '../components/JobForm';
import AIShortlist from '../components/AIShortlist';

const AIResults = () => {
  const [jobData, setJobData] = useState(null);

  const handleResults = (results, formData) => {
    setJobData(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Shortlisting</h1>
        <p className="text-slate-400 text-sm mt-1">
          Let AI analyze and rank candidates using advanced language models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <JobForm onResults={handleResults} />
        </div>
        <div>
          <AIShortlist jobData={jobData} />
        </div>
      </div>
    </div>
  );
};

export default AIResults;