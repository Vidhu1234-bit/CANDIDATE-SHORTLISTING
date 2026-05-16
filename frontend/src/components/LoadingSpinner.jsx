// LoadingSpinner.jsx — Shows a spinning animation while data loads

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-700"></div>
        {/* Spinning inner ring */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-400 text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;