// Calculate expected weight based on surgery type and time (CORRECTED FORMULAS)
  const calculateExpectedWeight = (weeks) => {
    const startWeightKg = getSurgeryWeightInKg();
    if (!startWeightKg) return startWeightKg;

    const months = weeks / 4.33; // Convert weeks to months
    let expectedLossPercentage = 0;

    // Use the EXACT formulas you provided
    if (userData.surgeryType === 'Gastric Bypass') {
      if (months <= 1) {
        expectedLossPercentage = 0.10 * (months / 1); // Linear to 10% at month 1
      } else if (months <= 3) {
        expectedLossPercentage = 0.10 + (0.15 * (months - 1) / 2); // 10% to 25% from month 1 to 3
      } else if (months <= 6) {
        expectedLossPercentage = 0.25 + (0.25 * (months - 3) / 3); // 25% to 50% from month 3 to 6
      } else {
        expectedLossPercentage = 0.50; // Cap at 50%
      }
    } else if (userData.surgeryType === 'Gastric Sleeve') {
      if (months <= 1) {
        expectedLossPercentage = 0.08 * (months / 1); // Linear to 8% at month 1
      } else if (months <= 3) {
        expectedLossPercentage = 0.08 + (0.12 * (months - 1) / 2); // 8% to 20% from month 1 to 3
      } else if (months <= 6) {
        expectedLossPercentage = 0.20 + (0.25 * (months - 3) / 3); // 20% to 45% from month 3 to 6
      } else {
        expectedLossPercentage = 0.45; // Cap at 45%
      }
    } else if (userData.surgeryType === 'Duodenal Switch (BPD-DS)') {
      if (months <= 1) {
        expectedLossPercentage = 0.12 * (months / 1); // Linear to 12% at month 1
      } else if (months <= 3) {
        expectedLossPercentage = 0.12 + (0.23 * (months - 1) / 2); // 12% to 35% from month 1 to 3
      } else if (months <= 6) {
        expectedLossPercentage = 0.35 + (0.35 * (months - 3) / 3); // 35% to 70% from month 3 to 6
      } else {
        expectedLossPercentage = 0.70; // Cap at 70%
      }
    }

    // CORRECTED: Expected weight = Starting weight - (Starting weight × loss percentage)
    const expectedWeightKg = startWeightKg - (startWeightKg * expectedLossPercentage);

    // Convert back to user's preferred unit
    return userData.weightUnit === 'lbs' ? kgToLbs(expectedWeightKg) : expectedWeightKg;
  };import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BariTrackApp = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userData, setUserData] = useState({
    surgeryDate: '',
    gender: '',
    age: '',
    surgeryWeight: '',
    height: '',
    race: '',
    surgeryType: '',
    weightUnit: 'kg',
    heightUnit: 'cm'
  });
  const [weightEntries, setWeightEntries] = useState([]);
  const [showWeightEntry, setShowWeightEntry] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  const [chartTimeframe, setChartTimeframe] = useState('weekly'); // 'daily' or 'weekly'

  // Unit conversion functions
  const kgToLbs = (kg) => kg * 2.20462;
  const lbsToKg = (lbs) => lbs / 2.20462;
  const cmToFtIn = (cm) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return { feet, inches: remainingInches };
  };

  // Get surgery weight in kg for calculations
  const getSurgeryWeightInKg = () => {
    const weight = parseFloat(userData.surgeryWeight);
    return userData.weightUnit === 'lbs' ? lbsToKg(weight) : weight;
  };

  // Calculate weeks since surgery
  const getWeeksSinceSurgery = () => {
    return Math.floor(currentDay / 7);
  };

  // Calculate expected weight based on surgery type and time
  const calculateExpectedWeight = (weeks) => {
    const startWeightKg = getSurgeryWeightInKg();
    if (!startWeightKg) return startWeightKg;

    const months = weeks / 4.33;
    let expectedLossPercentage = 0;

    if (userData.surgeryType === 'Gastric Bypass') {
      if (months <= 1) expectedLossPercentage = 0.10 * months;
      else if (months <= 3) expectedLossPercentage = 0.10 + (0.15 * (months - 1) / 2);
      else if (months <= 6) expectedLossPercentage = 0.25 + (0.25 * (months - 3) / 3);
      else expectedLossPercentage = 0.50;
    } else if (userData.surgeryType === 'Gastric Sleeve') {
      if (months <= 1) expectedLossPercentage = 0.08 * months;
      else if (months <= 3) expectedLossPercentage = 0.08 + (0.12 * (months - 1) / 2);
      else if (months <= 6) expectedLossPercentage = 0.20 + (0.25 * (months - 3) / 3);
      else expectedLossPercentage = 0.45;
    } else if (userData.surgeryType === 'Duodenal Switch (BPD-DS)') {
      if (months <= 1) expectedLossPercentage = 0.12 * months;
      else if (months <= 3) expectedLossPercentage = 0.12 + (0.23 * (months - 1) / 2);
      else if (months <= 6) expectedLossPercentage = 0.35 + (0.35 * (months - 3) / 3);
      else expectedLossPercentage = 0.70;
    }

    const expectedWeightKg = startWeightKg - (startWeightKg * expectedLossPercentage);
    return userData.weightUnit === 'lbs' ? kgToLbs(expectedWeightKg) : expectedWeightKg;
  };

  // Calculate BMI
  const calculateBMI = (weightKg, heightCm) => {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  };

  // Generate chart data with daily/weekly options
  const generateChartData = () => {
    const data = [];
    const startWeight = parseFloat(userData.surgeryWeight);

    if (chartTimeframe === 'daily') {
      const maxDays = Math.max(currentDay + 30, 30); // Ensure we show at least 30 days
      for (let day = 0; day <= maxDays; day++) {
        const weeks = day / 7;
        const expectedWeight = calculateExpectedWeight(weeks);

        // Find actual entry for this day, or use starting weight for day 0
        let actualEntry = weightEntries.find(entry => entry.day === day);
        let actualWeight = null;

        // For day 0, show the starting weight
        if (day === 0) {
          actualWeight = startWeight;
        } else {
          actualWeight = actualEntry ? actualEntry.weight : null;
        }

        data.push({
          timepoint: day,
          timeLabel: `Day ${day}`,
          expectedWeight: day === 0 ? startWeight : expectedWeight, // Start from initial weight
          actualWeight: actualWeight
        });
      }
    } else {
      // Weekly view
      const maxWeeks = Math.max(getWeeksSinceSurgery() + 4, 26); // Show current progress + buffer, min 6 months
      for (let week = 0; week <= maxWeeks; week++) {
        const expectedWeight = calculateExpectedWeight(week);

        // Find actual entry for this week, or use starting weight for week 0
        let actualEntry = weightEntries.find(entry => entry.week === week);
        let actualWeight = null;

        // For week 0, show the starting weight
        if (week === 0) {
          actualWeight = startWeight;
        } else {
          actualWeight = actualEntry ? actualEntry.weight : null;
        }

        data.push({
          timepoint: week,
          timeLabel: `Week ${week}`,
          expectedWeight: week === 0 ? startWeight : expectedWeight, // Start from initial weight
          actualWeight: actualWeight
        });
      }
    }

    return data;
  };

  // Check if user is off track
  const isOffTrack = () => {
    const currentWeek = getWeeksSinceSurgery();
    const latestEntry = weightEntries.find(entry => entry.week === currentWeek);

    if (!latestEntry) return false;

    const expectedWeight = calculateExpectedWeight(currentWeek);
    const actualWeight = latestEntry.weight;
    const deviation = ((actualWeight - expectedWeight) / expectedWeight) * 100;

    return deviation >= 15;
  };

  const handleWeightSubmit = () => {
    if (newWeight) {
      const newDay = currentDay + 1;
      setCurrentDay(newDay);

      const currentWeek = Math.floor(newDay / 7);
      const updatedEntries = weightEntries.filter(entry => entry.week !== currentWeek && entry.day !== newDay);
      updatedEntries.push({
        week: currentWeek,
        day: newDay,
        weight: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0]
      });

      setWeightEntries(updatedEntries);
      setNewWeight('');
      setShowWeightEntry(false);
    }
  };

  // Format weight display
  const formatWeight = (weight) => {
    if (!weight) return 'No data';
    return `${weight.toFixed(1)} ${userData.weightUnit}`;
  };

  // Format percentage loss
  const formatPercentageLoss = (percentage) => {
    if (!percentage) return '0%';
    return `${percentage.toFixed(1)}%`;
  };

  // Format height display
  const formatHeight = () => {
    if (!userData.height) return '';
    if (userData.heightUnit === 'cm') {
      return `${userData.height} cm`;
    } else {
      const heightInCm = userData.heightUnit === 'in' ? parseFloat(userData.height) * 2.54 : parseFloat(userData.height);
      const { feet, inches } = cmToFtIn(heightInCm);
      return `${feet}'${inches}"`;
    }
  };

  // Welcome Screen
  const WelcomeScreen = () => (
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
        onClick={() => setCurrentScreen('onboarding')}
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

  // Onboarding Screen
  const OnboardingScreen = () => {
    const nextStep = () => {
      if (onboardingStep < 4) {
        setOnboardingStep(onboardingStep + 1);
      } else {
        setCurrentScreen('dashboard');
      }
    };

    const prevStep = () => {
      if (onboardingStep > 1) {
        setOnboardingStep(onboardingStep - 1);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <button
              onClick={prevStep}
              disabled={onboardingStep === 1}
              className="p-2 disabled:opacity-50"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex space-x-2">
              {[1,2,3,4].map(step => (
                <div key={step} className={`h-2 rounded-full transition-all duration-300 ${
                  step <= onboardingStep ? 'bg-orange-500 w-8' : 'bg-gray-600 w-2'
                }`}></div>
              ))}
            </div>
            <div className="w-6"></div>
          </div>

          <div className="space-y-6">
            {onboardingStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold mb-2">When was your surgery?</h2>
                <p className="text-gray-400 mb-8">We'll use this to track your progress timeline</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Surgery date</label>
                    <input
                      type="date"
                      value={userData.surgeryDate}
                      onChange={(e) => setUserData({...userData, surgeryDate: e.target.value})}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="mm/dd/yyyy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Type of surgery</label>
                    <div className="space-y-3">
                      {[
                        { value: 'Gastric Bypass', label: 'Gastric Bypass', desc: 'Standard procedure' },
                        { value: 'Gastric Sleeve', label: 'Gastric Sleeve', desc: 'Least weight loss' },
                        { value: 'Duodenal Switch (BPD-DS)', label: 'Duodenal Switch', desc: 'Most weight loss' }
                      ].map(surgery => (
                        <button
                          key={surgery.value}
                          type="button"
                          onClick={() => setUserData({...userData, surgeryType: surgery.value})}
                          className={`w-full p-4 rounded-2xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
                            userData.surgeryType === surgery.value
                              ? 'bg-orange-500/20 border-2 border-orange-500'
                              : 'bg-gray-700/30 border border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="font-semibold">{surgery.label}</div>
                          <div className="text-sm text-gray-400">{surgery.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold mb-2">About you</h2>
                <p className="text-gray-400 mb-8">Help us personalize your experience</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Gender</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map(gender => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setUserData({...userData, gender})}
                          className={`p-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
                            userData.gender === gender
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Age</label>
                    <input
                      type="number"
                      value={userData.age}
                      onChange={(e) => setUserData({...userData, age: e.target.value})}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold mb-2">Your measurements</h2>
                <p className="text-gray-400 mb-8">This helps us calculate your progress accurately</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Weight at surgery ({userData.weightUnit})</label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={userData.surgeryWeight}
                        onChange={(e) => setUserData({...userData, surgeryWeight: e.target.value})}
                        className="flex-1 p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        placeholder={userData.weightUnit === 'kg' ? '92' : '203'}
                        step="0.1"
                        min="1"
                      />
                      <select
                        value={userData.weightUnit}
                        onChange={(e) => setUserData({...userData, weightUnit: e.target.value})}
                        className="p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Height ({userData.heightUnit})</label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        value={userData.height}
                        onChange={(e) => setUserData({...userData, height: e.target.value})}
                        className="flex-1 p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        placeholder={userData.heightUnit === 'cm' ? '170' : '67'}
                        min="1"
                      />
                      <select
                        value={userData.heightUnit}
                        onChange={(e) => setUserData({...userData, heightUnit: e.target.value})}
                        className="p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      >
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {onboardingStep === 4 && (
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
                <p className="text-gray-400 mb-8">Let's start tracking your amazing progress</p>

                <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Your profile summary:</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Surgery:</span>
                      <span className="font-medium">{userData.surgeryType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="font-medium">{userData.surgeryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Starting weight:</span>
                      <span className="font-medium">{userData.surgeryWeight} {userData.weightUnit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12">
            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <span>{onboardingStep === 4 ? 'Start tracking' : 'Continue'}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Screen
  const DashboardScreen = () => {
    const weeksSinceSurgery = getWeeksSinceSurgery();
    const currentWeightEntry = weightEntries.find(entry => entry.week === weeksSinceSurgery);
    const currentWeight = currentWeightEntry?.weight;
    const expectedWeight = calculateExpectedWeight(weeksSinceSurgery);

    const startWeight = parseFloat(userData.surgeryWeight);
    const weightLoss = currentWeight ? startWeight - currentWeight : 0;
    const weightLossPercentage = currentWeight && startWeight ? ((startWeight - currentWeight) / startWeight) * 100 : 0;
    const expectedLossPercentage = startWeight ? ((startWeight - expectedWeight) / startWeight) * 100 : 0;

    const currentWeightKg = userData.weightUnit === 'lbs' && currentWeight ? lbsToKg(currentWeight) : currentWeight;
    const heightCm = userData.heightUnit === 'in' ? parseFloat(userData.height) * 2.54 : parseFloat(userData.height);
    const currentBMI = currentWeightKg ? calculateBMI(currentWeightKg, heightCm) : null;

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
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isOffTrack() && (
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
                  {currentWeight ? formatWeight(currentWeight) : 'No data'}
                </p>
              </div>
              <div>
                <p className="text-orange-100 text-sm mb-1">Weight Lost</p>
                <p className="text-2xl font-bold">
                  {weightLoss > 0 ? formatWeight(weightLoss) : '0 ' + userData.weightUnit}
                </p>
                <p className="text-xs text-orange-200">
                  {weightLoss > 0 ? formatPercentageLoss(weightLossPercentage) + ' of initial weight' : '0% of initial weight'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-orange-100 text-sm">Expected: {formatWeight(expectedWeight)}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOffTrack() ? 'bg-red-400' : 'bg-green-400'}`}></div>
                <span className="text-sm font-medium">{isOffTrack() ? 'Off track' : 'On track'}</span>
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
                onClick={handleWeightSubmit}
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

              {/* Daily/Weekly Toggle */}
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

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="timepoint"
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{
                      value: chartTimeframe === 'daily' ? 'Days' : 'Weeks',
                      position: 'insideBottom',
                      offset: -5,
                      style: { textAnchor: 'middle', fill: '#9CA3AF' }
                    }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: `Weight (${userData.weightUnit})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      color: '#F9FAFB'
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                    formatter={(value, name, props) => {
                      if (!value) return ['No data', name];
                      const formattedValue = `${value.toFixed(1)} ${userData.weightUnit}`;
                      // Use the name directly from the Line component
                      return [formattedValue, name];
                    }}
                    labelFormatter={(label) => chartTimeframe === 'daily' ? `Day ${label}` : `Week ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="expectedWeight"
                    stroke="#F97316"
                    strokeWidth={3}
                    name="Expected Weight"
                    connectNulls={true}
                    dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actualWeight"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Your Weight"
                    connectNulls={true}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

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

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur border-t border-gray-700">
          <div className="flex">
            <button
              type="button"
              className="flex-1 py-4 flex flex-col items-center space-y-1 focus:outline-none focus:bg-gray-800/50"
            >
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
              <span className="text-xs font-medium text-orange-500">Progress</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('profile')}
              className="flex-1 py-4 flex flex-col items-center space-y-1 focus:outline-none focus:bg-gray-800/50"
            >
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-xs font-medium text-gray-400">Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Profile Screen
  const ProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pb-24">
      <div className="bg-gray-900/50 backdrop-blur p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            type="button"
            onClick={() => setCurrentScreen('dashboard')}
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
              <span className="font-medium">{formatHeight()}</span>
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
              <span className="font-medium">{getWeeksSinceSurgery()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weight entries logged:</span>
              <span className="font-medium">{weightEntries.length}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setUserData({
              surgeryDate: '',
              gender: '',
              age: '',
              surgeryWeight: '',
              height: '',
              race: '',
              surgeryType: '',
              weightUnit: 'kg',
              heightUnit: 'cm'
            });
            setWeightEntries([]);
            setCurrentDay(0);
            setOnboardingStep(1);
            setCurrentScreen('welcome');
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          Reset Profile
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur border-t border-gray-700">
        <div className="flex">
          <button
            type="button"
            onClick={() => setCurrentScreen('dashboard')}
            className="flex-1 py-4 flex flex-col items-center space-y-1 focus:outline-none focus:bg-gray-800/50"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
            </svg>
            <span className="text-xs font-medium text-gray-400">Progress</span>
          </button>
          <button
            type="button"
            className="flex-1 py-4 flex flex-col items-center space-y-1 focus:outline-none focus:bg-gray-800/50"
          >
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs font-medium text-orange-500">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Weight Entry Modal
  const WeightEntryModal = () => {
    if (!showWeightEntry) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
          <h3 className="text-xl font-bold mb-4">Log Your Weight</h3>
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-3">Weight ({userData.weightUnit})</label>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder={`Enter current weight in ${userData.weightUnit}`}
              step="0.1"
              min="1"
              autoFocus
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowWeightEntry(false)}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleWeightSubmit}
              disabled={!newWeight}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main App Render
  return (
    <div className="font-sans min-h-screen">
      {currentScreen === 'welcome' && <WelcomeScreen />}
      {currentScreen === 'onboarding' && <OnboardingScreen />}
      {currentScreen === 'dashboard' && <DashboardScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      <WeightEntryModal />
    </div>
  );
};

export default BariTrackApp;