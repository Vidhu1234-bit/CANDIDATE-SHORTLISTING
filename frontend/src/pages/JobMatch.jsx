
// JobMatch.jsx — Job matching page with results and chart

import { useState } from 'react';
import JobForm from '../components/JobForm';
import MatchResults from '../components/MatchResults';
import MatchChart from '../components/MatchChart';

const JobMatch = () => {
  const [matchResults, setMatchResults] = useState(null);
  const [jobData, setJobData] = useState(null);

  const handleResults = (results, formData) => {
    setMatchResults(results);
    setJobData(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Job Matching</h1>
        <p className="text-slate-400 text-sm mt-1">
          Enter job requirements to find the best matching candidates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Form */}
        <div className="lg:col-span-1">
          <JobForm onResults={handleResults} />
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {matchResults ? (
            <>
              <MatchChart results={matchResults} />
              <MatchResults results={matchResults} />
            </>
          ) : (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-white font-medium mb-2">Ready to Match</h3>
              <p className="text-slate-400 text-sm">
                Fill in the job requirements on the left and click "Find Matching Candidates"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatch;