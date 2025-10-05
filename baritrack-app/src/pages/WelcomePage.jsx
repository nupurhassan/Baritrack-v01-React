import React from 'react';

const WelcomePage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-orange-800 to-red-800 text-white flex flex-col justify-center items-center p-6">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6 tracking-tight">BariTrack</h1>
        <p className="text-xl text-gray-200 mb-2">Your intelligent companion for</p>
        <p className="text-xl text-orange-200 font-semibold mb-16">bariatric surgery success</p>
      </div>

      <div className="space-y-4 mb-12 w-full max-w-lg">
        <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-5 flex items-center space-x-4 border border-gray-600/30">
          <div className="w-14 h-14 bg-orange-700/40 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="12" r="8"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Smart Progress Tracking</h3>
            <p className="text-sm text-gray-300">Evidence-based weight goals</p>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-5 flex items-center space-x-4 border border-gray-600/30">
          <div className="w-14 h-14 bg-orange-700/40 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Effortless Check-ins</h3>
            <p className="text-sm text-gray-300">Weekly weight logging made simple</p>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-5 flex items-center space-x-4 border border-gray-600/30">
          <div className="w-14 h-14 bg-orange-700/40 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Compassionate Support</h3>
            <p className="text-sm text-gray-300">Encouraging, never judgmental</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-5 px-8 rounded-3xl w-full max-w-lg transition-all duration-300 shadow-xl flex items-center justify-center space-x-3"
      >
        <span className="text-lg">Begin Your Journey</span>
        <span className="text-xl">→</span>
      </button>

      <p className="text-sm text-orange-200 mt-6 flex items-center">
        <span className="mr-2">⚡</span>
        Setup takes less than 2 minutes
      </p>
    </div>
  );
};

export default WelcomePage;
