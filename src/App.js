import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppProvider, useApp } from './context/AppContext';
import { logoutAction, setSubscription } from './store/authSlice';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PlansPage from './pages/PlansPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import EAGuidePage from './pages/EAGuidePage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import LandingPage from './pages/LandingPage';

function AppRouter() {
  // Auth now comes from Redux store
  const user = useSelector(s => s.auth.user);
  const subscription = useSelector(s => s.auth.subscription);
  const dispatch = useDispatch();

  // AppContext still needed for toast, selectedPlan, activateSubscription
  const { setLogoutCallback } = useApp();

  // Restore session only if user was previously on the dashboard (not mid-payment).
  // localStorage 'rg_session' is set to 'active' only after successful login+subscription.
  // It is cleared when user is on plans/payment flow so refresh there goes to login.
  const wasOnDashboard = localStorage.getItem('rg_session') === 'active';

  // const [route, setRoute] = useState(wasOnDashboard ? 'app' : 'login');
  const [route, setRoute] = useState(user && subscription && wasOnDashboard ? 'app' : 'landing');
  const [activeTab, setActiveTab] = useState('home');

  const goTo = (r) => setRoute(r);

  // Wire logout to clear Redux state + reset route
  useEffect(() => {
    setLogoutCallback(() => {
      dispatch(logoutAction());
      localStorage.removeItem('rg_session');
      setRoute('login');
      setActiveTab('home');
    });
  }, [setLogoutCallback, dispatch]);


  const renderPage = () => {
    switch (route) {

      case 'landing':
        return <LandingPage onGetStarted={() => setRoute('login')} />;
      case 'login':
        return (
          <LoginPage
            onSuccess={() => goTo('app')}
            onNeedPlans={() => goTo('plans')}
          />
        );


      case 'plans':
        return <PlansPage onContinue={() => goTo('payment')} />;

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

      case 'app':
        return (
          <>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'home' && <DashboardPage onGoGuide={() => setActiveTab('guide')} onSubscriptionExpired={() => { localStorage.removeItem('rg_session'); goTo('plans'); }} />}
            {activeTab === 'rules' && <SettingsPage />}
            {activeTab === 'guide' && <EAGuidePage />}
            {activeTab === 'contact' && <ContactPage />}
            {activeTab === 'terms' && <TermsPage />}
          </>
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
  return (
    // AppProvider kept for toast + plan selection state during checkout flow
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}