import React from 'react';
import BottomNav from '../components/BottomNav';
import { formatHeight } from '../utils/calculations';

const ProfilePage = ({ userData, currentDay, weightEntries, onReset, onNavigate }) => {
  const weeksSinceSurgery = Math.floor(currentDay / 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pb-24">
      <div className="bg-gray-900/50 backdrop-blur p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-orange-500 font-medium focus:outline-none focus:underline"
          >
            Done
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Your Journey</h2>
          <p className="text-gray-400">Tracking your progress since {userData.surgeryDate}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Surgery Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="font-medium">{userData.surgeryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="font-medium">{userData.surgeryType}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Gender:</span>
              <span className="font-medium">{userData.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Age:</span>
              <span className="font-medium">{userData.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Height:</span>
              <span className="font-medium">{formatHeight(userData.height, userData.heightUnit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Starting Weight:</span>
              <span className="font-medium">{userData.surgeryWeight} {userData.weightUnit}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Progress Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Days since surgery:</span>
              <span className="font-medium">{currentDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weeks since surgery:</span>
              <span className="font-medium">{weeksSinceSurgery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weight entries logged:</span>
              <span className="font-medium">{weightEntries.length}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          Reset Profile
        </button>
      </div>

      <BottomNav currentScreen="profile" onNavigate={onNavigate} />
    </div>
  );
};

export default ProfilePage;
