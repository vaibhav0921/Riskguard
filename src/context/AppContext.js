import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { loginAction, logoutAction, setSubscription } from '../store/authSlice';

const AppContext = createContext(null);

export const PLANS = {
  basic: {
    id: 'basic', name: 'Basic', price: 799, currency: '₹',
    months: 1, duration: '1 month access', icon: '🔰', badge: 'BASIC',
    color: 'var(--sky)',
    features: ['Consecutive loss rule', 'Daily loss % limit', 'Max trades per day', 'Auto daily reset'],
  },
  pro: {
    id: 'pro', name: 'Pro', price: 1399, currency: '₹',
    months: 2, duration: '2 months access', icon: '⚡', badge: 'PRO',
    color: 'var(--lime)', featured: true,
    features: ['Everything in Basic', 'Priority support', 'Rule override via app', 'Live status dashboard'],
  },
  advanced: {
    id: 'advanced', name: 'Advanced', price: 1999, currency: '₹',
    months: 6, duration: '6 months access', icon: '🏆', badge: 'ADV',
    color: 'var(--gold)',
    features: ['Everything in Pro', 'Unlimited accounts', 'Advanced analytics', 'Dedicated support'],
  },
};

export function getDaysRemaining(expiryDateISO) {
  if (!expiryDateISO) return null;
  const diff = new Date(expiryDateISO) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatExpiry(expiryDateISO) {
  if (!expiryDateISO) return '—';
  return new Date(expiryDateISO).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function AppProvider({ children }) {
  const dispatch = useDispatch();
  const onLogoutRef = useRef(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toast, setToast] = useState(null);

  const login = useCallback((email, account) => {
    dispatch(loginAction({ email, account }));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    if (onLogoutRef.current) onLogoutRef.current();
  }, [dispatch]);

  const setLogoutCallback = useCallback((fn) => {
    onLogoutRef.current = fn;
  }, []);

  const activateSubscription = useCallback((planId, overrideData) => {
    if (overrideData) {
      dispatch(setSubscription(overrideData));
      return;
    }
    const plan = PLANS[planId];
    if (!plan) return;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + plan.months);
    dispatch(setSubscription({
      planId,
      planName: plan.name,
      expiryDate: expiry.toISOString(),
      activatedAt: new Date().toISOString(),
    }));
  }, [dispatch]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <AppContext.Provider value={{
      login, logout, setLogoutCallback,
      activateSubscription,
      selectedPlan, setSelectedPlan,
      toast, showToast, hideToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
