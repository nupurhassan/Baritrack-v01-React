import React from 'react';
import BottomNav from '../components/BottomNav';
import { formatHeight, calculateBMI, lbsToKg } from '../utils/calculations';

const ProfilePage = ({ userData, currentDay, weightEntries, onReset, onNavigate, onLogout, currentUser }) => {
  const weeksSinceSurgery = Math.floor(currentDay / 7);

  // Get latest weight
  const latestWeightEntry = weightEntries.length > 0
    ? weightEntries.reduce((latest, entry) => entry.day > latest.day ? entry : latest)
    : null;
  const currentWeight = latestWeightEntry?.weight;

  // Calculate BMI if we have current weight
  const currentWeightKg = userData.weightUnit === 'lbs' && currentWeight ? lbsToKg(currentWeight) : currentWeight;
  const heightCm = userData.heightUnit === 'in' ? parseFloat(userData.height) * 2.54 : parseFloat(userData.height);
  const currentBMI = currentWeightKg ? calculateBMI(currentWeightKg, heightCm) : null;

  // Calculate total weight loss
  const startWeight = parseFloat(userData.surgeryWeight);
  const weightLoss = currentWeight ? startWeight - currentWeight : 0;
  const weightLossPercentage = currentWeight && startWeight ? ((startWeight - currentWeight) / startWeight) * 100 : 0;

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
        {/* User Avatar and Info */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            {currentUser?.name ? (
              <span className="text-4xl font-bold text-white">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold">{currentUser?.name || 'User'}</h2>
          <p className="text-gray-400">{currentUser?.email}</p>
          {userData.surgeryDate && (
            <p className="text-sm text-gray-500 mt-2">
              Member since {userData.surgeryDate}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm">Total Lost</span>
              <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-2xl font-bold">{weightLoss.toFixed(1)} {userData.weightUnit}</p>
            <p className="text-xs text-green-200">{weightLossPercentage.toFixed(1)}% of initial</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">Current BMI</span>
              <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold">{currentBMI ? currentBMI.toFixed(1) : '--'}</p>
            <p className="text-xs text-blue-200">
              {currentBMI ? (currentBMI < 25 ? 'Healthy' : currentBMI < 30 ? 'Overweight' : 'Obese') : 'No data'}
            </p>
          </div>
        </div>

        {/* Surgery Information */}
        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Surgery Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="font-medium">{userData.surgeryDate || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="font-medium">{userData.surgeryType || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Starting Weight:</span>
              <span className="font-medium">
                {userData.surgeryWeight ? `${userData.surgeryWeight} ${userData.weightUnit}` : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Gender:</span>
              <span className="font-medium">{userData.gender || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Age:</span>
              <span className="font-medium">{userData.age || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Height:</span>
              <span className="font-medium">
                {userData.height ? formatHeight(userData.height, userData.heightUnit) : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
            </svg>
            Progress Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Days tracking:</span>
              <span className="font-medium">{currentDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weeks post-surgery:</span>
              <span className="font-medium">{weeksSinceSurgery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weight entries:</span>
              <span className="font-medium">{weightEntries.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current weight:</span>
              <span className="font-medium">
                {currentWeight ? `${currentWeight.toFixed(1)} ${userData.weightUnit}` : 'No data'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset Profile & Start Over</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center pt-6">
          <p className="text-xs text-gray-500">BariTrack v1.0.0</p>
          <p className="text-xs text-gray-600 mt-1">© 2024 BariTrack. All rights reserved.</p>
        </div>
      </div>

      <BottomNav currentScreen="profile" onNavigate={onNavigate} />
    </div>
  );
};

export default ProfilePage;