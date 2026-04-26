import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatus, fetchRules, validateUser } from '../api';
import {
  setEAData,
  setEADisconnected,
  setRules,
  setLoading,
  setError,
} from '../store/statusSlice';
import { setSubscription, logoutAction } from '../store/authSlice'; // ADDED: logoutAction

const POLL_INTERVAL = 15000;

export function usePolling(onSubscriptionExpired) { // ADDED: onSubscriptionExpired param
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);
  const timerRef = useRef(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!user?.email || !user?.account) return;

    const poll = async () => {
      try {
        const res = await fetchStatus(user.email, user.account);
        const data = res.data;

        console.log('[Poll] Raw status:', data);

        const connected =
          data?.eaconnected === true ||
          data?.eaConnected === true ||
          data?.isEAConnected === true;

        console.log('[Poll] EA connected:', connected);

        if (connected) {
          dispatch(setEAData(data));
        } else {
          dispatch(setEADisconnected());
        }

        try {
          const rRes = await fetchRules(user.email, user.account);
          dispatch(setRules(rRes.data));
        } catch (e) {
          console.warn('[Poll] Rules fetch failed (non-critical):', e.message);
        }

        try {
          const vRes = await validateUser(user.email, user.account);
          const vData = vRes.data;
          if (vData?.active && vData?.expiryDate) {
            const planMap = { BASIC: 'basic', PRO: 'pro', ADVANCED: 'advanced' };
            dispatch(setSubscription({
              planId: planMap[vData.plan] || 'pro',
              planName: vData.plan,
              expiryDate: vData.expiryDate,
              activatedAt: new Date().toISOString(),
            }));
          } else if (vData?.active === false) {
            // ADDED: subscription expired/inactive — kick user out of dashboard
            console.warn('[Poll] Subscription inactive — redirecting to plans.');
            localStorage.removeItem('rg_session');
            dispatch(setSubscription(null));
            dispatch(logoutAction());
            if (onSubscriptionExpired) onSubscriptionExpired();
          }
        } catch (e) {
          console.warn('[Poll] Validate failed (non-critical):', e.message);
        }

      } catch (err) {
        console.warn('[Poll] fetchStatus failed:', err.message);
        dispatch(setError('Cannot reach backend. Retrying...'));
      }
    };

    if (isFirstRun.current) {
      isFirstRun.current = false;
      dispatch(setLoading(true));
      poll();
    }

    timerRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user?.email, user?.account, dispatch, onSubscriptionExpired]);
}