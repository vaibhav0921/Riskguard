import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppProvider, useApp } from './context/AppContext';
import { logoutAction } from './store/authSlice';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import PlansPage from './pages/PlansPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
// Navbar intentionally removed — sidebar in DashboardPage handles all navigation

function AppRouter({ theme, toggleTheme }) {
  const user = useSelector(s => s.auth.user);
  const subscription = useSelector(s => s.auth.subscription);
  const dispatch = useDispatch();
  const { setLogoutCallback } = useApp();

  const wasOnDashboard = localStorage.getItem('rg_session') === 'active';
  const [route, setRoute] = useState(user && subscription && wasOnDashboard ? 'app' : 'landing');
  const [activeTab, setActiveTab] = useState('home');
  const [loginIntent, setLoginIntent] = useState(null);

  const goTo = (r) => setRoute(r);

  useEffect(() => {
    setLogoutCallback(() => {
      dispatch(logoutAction());
      localStorage.removeItem('rg_session');
      setRoute('landing');
      setActiveTab('home');
      setLoginIntent(null);
    });
  }, [setLogoutCallback, dispatch]);

  const renderPage = () => {
    switch (route) {

      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => { setLoginIntent(null); setRoute('login'); }}
            onTryFree={() => { setLoginIntent('trial'); setRoute('login'); }}
          />
        );

      case 'login':
        return (
          <LoginPage
            onSuccess={() => goTo('app')}
            onNeedPlans={() => goTo('plans')}
          />
        );

      case 'plans':
        return (
          <PlansPage
            onContinue={() => goTo('payment')}
            onTrialSuccess={() => { setActiveTab('home'); goTo('app'); }}
          />
        );

      case 'payment':
        return (
          <PaymentPage
            onBack={() => goTo('plans')}
            onSuccess={() => goTo('success')}
          />
        );

      case 'success':
        return (
          <SuccessPage
            onDashboard={() => { setActiveTab('home'); goTo('app'); }}
          />
        );

      // All dashboard tabs go through DashboardPage — sidebar handles routing
      case 'app':
        return (
          <DashboardPage
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onGoGuide={() => setActiveTab('guide')}
            onSubscriptionExpired={() => {
              localStorage.removeItem('rg_session');
              goTo('plans');
            }}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );

      default:
        return (
          <LoginPage
            onSuccess={() => goTo('app')}
            onNeedPlans={() => goTo('plans')}
          />
        );
    }
  };

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      {renderPage()}
      <Toast />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('rg_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rg_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppProvider>
      <AppRouter theme={theme} toggleTheme={toggleTheme} />
    </AppProvider>
  );
}