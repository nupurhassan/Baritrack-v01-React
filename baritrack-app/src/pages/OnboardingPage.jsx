import React from 'react';

const OnboardingPage = ({ step, userData, setUserData, onNext, onPrev, onComplete }) => {
  const nextStep = () => {
    if (step < 4) {
      onNext();
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={onPrev}
            disabled={step === 1}
            className="p-2 disabled:opacity-50"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex space-x-2">
            {[1,2,3,4].map(s => (
              <div key={s} className={`h-2 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-orange-500 w-8' : 'bg-gray-600 w-2'
              }`}></div>
            ))}
          </div>
          <div className="w-6"></div>
        </div>

        <div className="space-y-6">
          {step === 1 && (
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

          {step === 2 && (
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

          {step === 3 && (
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

          {step === 4 && (
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
            <span>{step === 4 ? 'Start tracking' : 'Continue'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
