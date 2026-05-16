// MatchChart.jsx — Bar chart showing candidate match scores

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const MatchChart = ({ results }) => {
  if (!results || !results.results || results.results.length === 0) return null;

  // Prepare data for chart — take top 10 candidates
  const chartData = results.results.slice(0, 10).map(r => ({
    name: r.candidate.name.split(' ')[0], // First name only for space
    score: r.matchScore,
    rank: r.rank
  }));

  // Colors based on rank
  const getColor = (rank) => {
    if (rank === 'High Match') return '#10b981';   // green
    if (rank === 'Medium Match') return '#f59e0b'; // yellow
    return '#ef4444';                              // red
  };

  // Custom tooltip that appears when you hover over a bar
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{label}</p>
          <p className="text-indigo-400">Score: {payload[0].value}%</p>
          <p className="text-slate-400 text-xs">{payload[0].payload.rank}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 fade-in">
      <h3 className="text-white font-semibold mb-1">Match Score Comparison</h3>
      <p className="text-slate-400 text-sm mb-6">Top {chartData.length} candidates by score</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.rank)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center">
        {[
          { color: '#10b981', label: 'High Match (≥70%)' },
          { color: '#f59e0b', label: 'Medium Match (40-69%)' },
          { color: '#ef4444', label: 'Low Match (<40%)' }
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-slate-400 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchChart;