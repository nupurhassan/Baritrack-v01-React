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
        surgeryWeight: '250',
        height: '70',
        race: '',
        surgeryType: 'Gastric Bypass',
        weightUnit: 'lbs',
        heightUnit: 'in'
      },
      weightEntries: [
        { week: 1, day: 7, weight: 242, date: '2024-01-22' },
        { week: 2, day: 14, weight: 235, date: '2024-01-29' },
        { week: 3, day: 21, weight: 228, date: '2024-02-05' }
      ],
      currentDay: 21
    }
  ]);

  // User-specific data
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
  }, []);

  // Load user data
  const loadUserData = (user) => {
    if (user.userData) {
      setUserData(user.userData);
    }
    if (user.weightEntries) {
      setWeightEntries(user.weightEntries);
    }
    if (user.currentDay !== undefined) {
      setCurrentDay(user.currentDay);
    }
  };

  // Save user data
  const saveUserData = () => {
    if (currentUser) {
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            userData,
            weightEntries,
            currentDay,
            hasCompletedOnboarding: true
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      setCurrentUser({
        ...currentUser,
        userData,
        weightEntries,
        currentDay,
        hasCompletedOnboarding: true
      });
    }
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
        surgeryWeight: '',
        height: '',
        race: '',
        surgeryType: '',
        weightUnit: 'kg',
        heightUnit: 'cm'
      },
      weightEntries: [],
      currentDay: 0
    };

    setUsers([...users, newUser]);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUserId', newUser.id.toString());
    setCurrentScreen('onboarding');
    return true;
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserId');
    setCurrentScreen('login');
    // Reset user data
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
  };

  // Handle weight submission
  const handleWeightSubmit = () => {
    if (newWeight) {
      const newDay = currentDay + 1;
      setCurrentDay(newDay);

      const currentWeek = Math.floor(newDay / 7);
      const updatedEntries = weightEntries.filter(entry => entry.day !== newDay);
      updatedEntries.push({
        week: currentWeek,
        day: newDay,
        weight: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0]
      });

      setWeightEntries(updatedEntries);
      setNewWeight('');

      // Save to user data
      if (currentUser) {
        const updatedUsers = users.map(user => {
          if (user.id === currentUser.id) {
            return {
              ...user,
              weightEntries: updatedEntries,
              currentDay: newDay
            };
          }
          return user;
        });
        setUsers(updatedUsers);
      }
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    saveUserData();
    setCurrentScreen('dashboard');
  };

  // Handle profile reset
  const handleReset = () => {
    if (currentUser) {
      const resetData = {
        surgeryDate: '',
        gender: '',
        age: '',
        surgeryWeight: '',
        height: '',
        race: '',
        surgeryType: '',
        weightUnit: 'kg',
        heightUnit: 'cm'
      };

      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            userData: resetData,
            weightEntries: [],
            currentDay: 0,
            hasCompletedOnboarding: false
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setUserData(resetData);
      setWeightEntries([]);
      setCurrentDay(0);
      setOnboardingStep(1);
      setCurrentScreen('onboarding');
    }
  };

  return (
    <div className="font-sans min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomePage onStart={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
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
          currentUser={currentUser}
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