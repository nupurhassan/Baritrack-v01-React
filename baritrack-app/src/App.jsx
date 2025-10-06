import React, { useState, useEffect } from 'react';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [onboardingStep, setOnboardingStep] = useState(1);

  // User data (stored in memory - in real app this would be in database)
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'demo@example.com',
      password: 'password123',
      name: 'Demo User',
      hasCompletedOnboarding: true,
      userData: {
        surgeryDate: '2024-01-15',
        gender: 'Male',
        age: '35',
        surgeryWeight: '450',
        height: '63',
        race: '',
        surgeryType: 'Duodenal Switch (BPD-DS)',
        weightUnit: 'lbs',
        heightUnit: 'in'
      },
      weightEntries: [
        { week: 1, day: 7, weight: 442, date: '2024-01-22' },
        { week: 2, day: 14, weight: 435, date: '2024-01-29' },
        { week: 3, day: 21, weight: 428, date: '2024-02-05' }
      ],
      currentDay: 21
    }
  ]);

  // Current session user data
  const [userData, setUserData] = useState({
    surgeryDate: '',
    gender: '',
    age: '',
    surgeryWeight: '450',
    height: '63',
    race: '',
    surgeryType: 'Duodenal Switch (BPD-DS)',
    weightUnit: 'lbs',
    heightUnit: 'in'
  });
  const [weightEntries, setWeightEntries] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  const [chartTimeframe, setChartTimeframe] = useState('weekly');

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUserId = localStorage.getItem('currentUserId');

    if (storedAuth === 'true' && storedUserId) {
      const user = users.find(u => u.id === parseInt(storedUserId));
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        loadUserData(user);

        // Navigate directly to dashboard if onboarding is complete
        if (user.hasCompletedOnboarding) {
          setCurrentScreen('dashboard');
        } else {
          setCurrentScreen('onboarding');
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to load data for a user record into state
  const loadUserData = (user) => {
    setUserData(user.userData || {});
    setWeightEntries(user.weightEntries || []);
    setCurrentDay(user.currentDay || 0);
  };

  // Handle login
  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUserId', user.id.toString());
      loadUserData(user);

      if (user.hasCompletedOnboarding) {
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('onboarding');
      }

      return true;
    }
    return false;
  };

  // Handle signup
  const handleSignUp = (email, password, name) => {
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      hasCompletedOnboarding: false,
      userData: {
        surgeryDate: '',
        gender: '',
        age: '',
        surgeryWeight: '450',
        height: '63',
        race: '',
        surgeryType: 'Duodenal Switch (BPD-DS)',
        weightUnit: 'lbs',
        heightUnit: 'in'
      },
      weightEntries: [],
      currentDay: 0
    };

    setUsers([...users, newUser]);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUserId', newUser.id.toString());
    loadUserData(newUser);
    setCurrentScreen('onboarding');
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserId');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen('welcome');
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    if (!currentUser) return;
    const updated = users.map(u =>
      u.id === currentUser.id
        ? { ...u, hasCompletedOnboarding: true, userData }
        : u
    );
    setUsers(updated);
    setCurrentScreen('dashboard');
  };

  // Handle weight submit
  const handleWeightSubmit = () => {
    if (!newWeight) return;
    const today = new Date();
    const entry = {
      week: Math.floor(currentDay / 7),
      day: currentDay,
      weight: parseFloat(newWeight),
      date: today.toISOString().split('T')[0]
    };
    const updatedEntries = [...weightEntries, entry];
    setWeightEntries(updatedEntries);
    setNewWeight('');

    if (!currentUser) return;
    const updatedUsers = users.map(u =>
      u.id === currentUser.id ? { ...u, weightEntries: updatedEntries } : u
    );
    setUsers(updatedUsers);
  };

  // Reset demo data
  const handleReset = () => {
    setUserData({
      surgeryDate: '',
      gender: '',
      age: '',
      surgeryWeight: '450',
      height: '63',
      race: '',
      surgeryType: 'Duodenal Switch (BPD-DS)',
      weightUnit: 'lbs',
      heightUnit: 'in'
    });
    setWeightEntries([]);
    setCurrentDay(0);
    setChartTimeframe('weekly');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {currentScreen === 'welcome' && !isAuthenticated && (
        <WelcomePage
          onLogin={() => setCurrentScreen('login')}
          onSignUp={() => setCurrentScreen('signup')}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      )}

      {currentScreen === 'login' && !isAuthenticated && (
        <LoginPage
          onLogin={handleLogin}
          onSignUp={() => setCurrentScreen('signup')}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      )}

      {currentScreen === 'signup' && (
        <SignUpPage
          onSignUp={handleSignUp}
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPasswordPage
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'onboarding' && isAuthenticated && (
        <OnboardingPage
          step={onboardingStep}
          userData={userData}
          setUserData={setUserData}
          onNext={() => setOnboardingStep(onboardingStep + 1)}
          onPrev={() => setOnboardingStep(onboardingStep - 1)}
          onComplete={handleOnboardingComplete}
        />
      )}

      {currentScreen === 'dashboard' && isAuthenticated && (
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

      {currentScreen === 'profile' && isAuthenticated && (
        <ProfilePage
          userData={userData}
          currentDay={currentDay}
          weightEntries={weightEntries}
          onReset={handleReset}
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default App;
