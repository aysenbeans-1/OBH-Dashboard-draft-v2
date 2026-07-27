import { useEffect, useState, useRef, useCallback } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes = 900,000 ms
const WARNING_THRESHOLD_MS = 2 * 60 * 1000;   // Show warning at 2 minutes remaining
const PING_INTERVAL_MS = 2 * 60 * 1000;       // Heartbeat check / extend rolling token every 2 mins

export function SessionManager({ user, onLogout, onTokenRefresh, children }) {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeRemainingMs, setTimeRemainingMs] = useState(INACTIVITY_TIMEOUT_MS);
  const [showWarning, setShowWarning] = useState(false);
  
  const lastPingTimeRef = useRef(Date.now());
  const isVerifyingRef = useRef(false);

  // Helper to trigger backend verification & rolling token extension
  const verifyAndExtendSession = useCallback(async (force = false) => {
    const token = localStorage.getItem('otp_token');
    if (!token || !user) return;

    const now = Date.now();
    // Throttle automatic pings unless forced
    if (!force && now - lastPingTimeRef.current < PING_INTERVAL_MS) {
      return;
    }

    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    try {
      lastPingTimeRef.current = now;
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Session was invalidated or token expired
        const reasonMessage = data.message || 'Your session has ended. Please log in again.';
        onLogout(reasonMessage);
        return;
      }

      if (data.refreshedToken) {
        localStorage.setItem('otp_token', data.refreshedToken);
        if (onTokenRefresh) onTokenRefresh(data.refreshedToken);
      }
    } catch (err) {
      console.warn('Session verification network error:', err);
    } finally {
      isVerifyingRef.current = false;
    }
  }, [user, onLogout, onTokenRefresh]);

  // Handle user activity events
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    
    // Reset warning if active
    setShowWarning(false);

    // Send backend ping if enough time elapsed since last ping
    if (now - lastPingTimeRef.current >= PING_INTERVAL_MS) {
      verifyAndExtendSession(true);
    }
  }, [verifyAndExtendSession]);

  // Set up event listeners for user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    let throttleTimeout = null;
    const throttledHandler = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleUserActivity();
          throttleTimeout = null;
        }, 1000);
      }
    };

    activityEvents.forEach(evt => window.addEventListener(evt, throttledHandler, { passive: true }));

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, throttledHandler));
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [user, handleUserActivity]);

  // Inactivity countdown timer tick loop (Layer 1)
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const inactiveMs = now - lastActivity;
      const remaining = INACTIVITY_TIMEOUT_MS - inactiveMs;

      if (remaining <= 0) {
        clearInterval(intervalId);
        onLogout('Session timed out after 15 minutes of inactivity.');
      } else {
        setTimeRemainingMs(remaining);
        if (remaining <= WARNING_THRESHOLD_MS) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user, lastActivity, onLogout]);

  // Periodic heartbeat session verification (Layer 2 & 3 server check)
  useEffect(() => {
    if (!user) return;

    const heartbeatInterval = setInterval(() => {
      verifyAndExtendSession(false);
    }, 60 * 1000);

    return () => clearInterval(heartbeatInterval);
  }, [user, verifyAndExtendSession]);

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleManualExtend = () => {
    handleUserActivity();
    verifyAndExtendSession(true);
    setShowWarning(false);
  };

  return (
    <>
      {children}

      {/* Floating 15-min Inactivity Warning Banner */}
      {showWarning && user && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-amber-500/40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Inactivity Session Warning</h4>
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  {formatTime(timeRemainingMs)}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                You have been inactive. For your security, your session will automatically log out in <strong className="text-white">{formatTime(timeRemainingMs)}</strong>.
              </p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => onLogout('Logged out manually from inactivity prompt.')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white rounded border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                >
                  Logout Now
                </button>
                <button
                  onClick={handleManualExtend}
                  className="px-3 py-1 text-[11px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 rounded shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Extend Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
