import React from 'react';

const BottomNav = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur border-t border-gray-700">
      <div className="flex">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex-1 py-4 flex flex-col items-center space-y-1 focus:outline-none focus:bg-gray-800/50"
        >
          <svg className={`w-6 h-6 ${currentScreen === 'dashboard' ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
          </svg>
          <span className={`text-xs font-medium ${currentScreen === 'dashboard' ? 'text-orange-500' : 'text-gray-400'}`}>Progress</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="flex-1 py-4 flex flex-col items-center space-y-1 focus:outline-none focus:bg-gray-800/50"
        >
          <svg className={`w-6 h-6 ${currentScreen === 'profile' ? 'text-orange-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span className={`text-xs font-medium ${currentScreen === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
