import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SESSION_KEY = 'portfolio_viewer_session';
const LAST_PING_KEY = 'portfolio_viewer_last_ping';
const PING_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function useViewerTracker() {
  useEffect(() => {
    if (!supabase) return;
    try {
      const now = Date.now();
      const lastPing = Number(localStorage.getItem(LAST_PING_KEY) || 0);
      if (now - lastPing < PING_INTERVAL_MS) return;

      let sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
      }

      const payload = {
        session_id: sessionId,
        user_agent: navigator.userAgent?.slice(0, 250) || 'unknown'
      };

      supabase
        .from('viewer_events')
        .insert(payload)
        .then(() => {
          localStorage.setItem(LAST_PING_KEY, String(now));
        })
        .catch(() => {
          // ignore failures silently in UI context
        });
    } catch (err) {
      console.error('Viewer tracker failed', err);
    }
  }, []);
}
