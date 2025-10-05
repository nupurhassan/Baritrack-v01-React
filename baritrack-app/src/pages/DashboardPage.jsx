import React from 'react';
import WeightChart from '../components/WeightChart';
import BottomNav from '../components/BottomNav';
import { generateChartData, isOffTrack } from '../utils/chartData';
import { calculateExpectedWeight, calculateBMI, formatWeight, formatPercentageLoss, lbsToKg } from '../utils/calculations';

const DashboardPage = ({
  userData,
  weightEntries,
  currentDay,
  newWeight,
  setNewWeight,
  onWeightSubmit,
  chartTimeframe,
  setChartTimeframe,
  onNavigate
}) => {
  const weeksSinceSurgery = Math.floor(currentDay / 7);
  const currentWeightEntry = weightEntries.find(entry => entry.week === weeksSinceSurgery);
  const currentWeight = currentWeightEntry?.weight;
  const expectedWeight = calculateExpectedWeight(weeksSinceSurgery, userData.surgeryWeight, userData.weightUnit, userData.surgeryType);

  const startWeight = parseFloat(userData.surgeryWeight);
  const weightLoss = currentWeight ? startWeight - currentWeight : 0;
  const weightLossPercentage = currentWeight && startWeight ? ((startWeight - currentWeight) / startWeight) * 100 : 0;

  const currentWeightKg = userData.weightUnit === 'lbs' && currentWeight ? lbsToKg(currentWeight) : currentWeight;
  const heightCm = userData.heightUnit === 'in' ? parseFloat(userData.height) * 2.54 : parseFloat(userData.height);
  const currentBMI = currentWeightKg ? calculateBMI(currentWeightKg, heightCm) : null;

  const chartData = generateChartData(chartTimeframe, currentDay, userData, weightEntries);
  const offTrack = isOffTrack(currentDay, userData, weightEntries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pb-24">
      <div className="bg-gray-900/50 backdrop-blur p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Good morning! <span className="ml-2">👋</span>
            </h1>
            <p className="text-gray-400">{weeksSinceSurgery} weeks post-surgery</p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {offTrack && (
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-orange-500 text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-orange-400">Gentle Check-In</h3>
                <p className="text-sm text-gray-300 mt-1">
                  You're slightly off your expected trajectory. This is normal!
                  Consider reviewing your nutrition or speaking with your care team.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Your Progress</h3>
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-orange-100 text-sm mb-1">Current Weight</p>
              <p className="text-2xl font-bold">
                {currentWeight ? formatWeight(currentWeight, userData.weightUnit) : 'No data'}
              </p>
            </div>
            <div>
              <p className="text-orange-100 text-sm mb-1">Weight Lost</p>
              <p className="text-2xl font-bold">
                {weightLoss > 0 ? formatWeight(weightLoss, userData.weightUnit) : '0 ' + userData.weightUnit}
              </p>
              <p className="text-xs text-orange-200">
                {weightLoss > 0 ? formatPercentageLoss(weightLossPercentage) + ' of initial weight' : '0% of initial weight'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-orange-100 text-sm">Expected: {formatWeight(expectedWeight, userData.weightUnit)}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${offTrack ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span className="text-sm font-medium">{offTrack ? 'Off track' : 'On track'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-400">BMI</h3>
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <p className="text-2xl font-bold">
              {currentBMI ? currentBMI.toFixed(1) : '--'}
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-400">Surgery Type</h3>
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <p className="text-lg font-semibold">
              {userData.surgeryType.replace(' (BPD-DS)', '')}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-orange-500 text-xl">+</span>
            <h3 className="text-xl font-semibold">Log Today's Weight</h3>
          </div>

          <div className="flex space-x-3 mb-3">
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder={`Enter weight (${userData.weightUnit})`}
              step="0.1"
              min="1"
            />
            <button
              type="button"
              onClick={onWeightSubmit}
              disabled={!newWeight}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              Add
            </button>
          </div>

          <p className="text-sm text-gray-400">
            Best time to weigh: first thing in the morning
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
              <h3 className="text-lg font-semibold">Weight Journey</h3>
            </div>

            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setChartTimeframe('daily')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  chartTimeframe === 'daily'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setChartTimeframe('weekly')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  chartTimeframe === 'weekly'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <WeightChart
            chartData={chartData}
            chartTimeframe={chartTimeframe}
            weightUnit={userData.weightUnit}
          />

          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Expected Weight</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Your Weight</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="dashboard" onNavigate={onNavigate} />
    </div>
  );
};

export default DashboardPage;
