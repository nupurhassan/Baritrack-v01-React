import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
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
  const [newWeight, setNewWeight] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  const [chartTimeframe, setChartTimeframe] = useState('weekly');

  const handleWeightSubmit = () => {
    if (newWeight) {
      const newDay = currentDay + 1;
      setCurrentDay(newDay);

      const currentWeek = Math.floor(newDay / 7);
      // Remove only the entry for this specific day if it exists (to avoid duplicates)
      const updatedEntries = weightEntries.filter(entry => entry.day !== newDay);
      updatedEntries.push({
        week: currentWeek,
        day: newDay,
        weight: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0]
      });

      setWeightEntries(updatedEntries);
      setNewWeight('');
    }
  };

  const handleReset = () => {
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
  };

  return (
    <div className="font-sans min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomePage onStart={() => setCurrentScreen('onboarding')} />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingPage
          step={onboardingStep}
          userData={userData}
          setUserData={setUserData}
          onNext={() => setOnboardingStep(onboardingStep + 1)}
          onPrev={() => setOnboardingStep(onboardingStep - 1)}
          onComplete={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'dashboard' && (
        <DashboardPage
          userData={userData}
          weightEntries={weightEntries}
          currentDay={currentDay}
          newWeight={newWeight}
          setNewWeight={setNewWeight}
          onWeightSubmit={handleWeightSubmit}
          chartTimeframe={chartTimeframe}
          setChartTimeframe={setChartTimeframe}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfilePage
          userData={userData}
          currentDay={currentDay}
          weightEntries={weightEntries}
          onReset={handleReset}
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
};

export default App;
