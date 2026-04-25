import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector }   from 'react-redux';
import { AppProvider, useApp }        from './context/AppContext';
import { logoutAction }               from './store/authSlice';
import Toast         from './components/Toast';
import Navbar        from './components/Navbar';
import LoginPage     from './pages/LoginPage';
import PlansPage     from './pages/PlansPage';
import PaymentPage   from './pages/PaymentPage';
import SuccessPage   from './pages/SuccessPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage  from './pages/SettingsPage';
import EAGuidePage   from './pages/EAGuidePage';
import TermsPage     from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

function AppRouter() {
  // Auth now comes from Redux store
  const user     = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  // AppContext still needed for toast, selectedPlan, activateSubscription
  const { setLogoutCallback } = useApp();

  const [route,     setRoute]     = useState('login');
  const [activeTab, setActiveTab] = useState('home');

  const goTo = (r) => setRoute(r);

  // Wire logout to clear Redux state + reset route
  useEffect(() => {
    setLogoutCallback(() => {
      dispatch(logoutAction());
      setRoute('login');
      setActiveTab('home');
    });
  }, [setLogoutCallback, dispatch]);

  // Restore session on mount if user is already in Redux/localStorage
  useEffect(() => {
    if (user && route === 'login') {
      goTo('app');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPage = () => {
    switch (route) {

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
            {activeTab === 'home'  && <DashboardPage onGoGuide={() => setActiveTab('guide')} />}
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
      <div className="noise"   aria-hidden="true" />
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
