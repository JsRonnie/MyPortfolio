import { useEffect, useState, useRef } from 'react';

const MIN_DELAY_MS = 650; // ensure loading state is visible briefly for smoother UX
const COOLDOWN_MS = 3000; // avoid spamming APIs when clicking fast

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function isRateLimitQuote(obj) {
  if (!obj) return false;
  const t = String(obj.q || '').toLowerCase();
  const a = String(obj.a || '').toLowerCase();
  return t.includes('too many requests') || a.includes('zenquotes.io');
}

async function fetchZenQuote(signal) {
  // Try local dev proxy first (vite server proxy). This avoids CORS during development.
  try {
  const resLocal = await fetch('/api/zenquotes?_=' + Date.now(), { signal });
    if (resLocal.ok) {
      const dataLocal = await resLocal.json();
      if (Array.isArray(dataLocal) && dataLocal.length > 0) {
        const item = { q: dataLocal[0].q, a: dataLocal[0].a };
        if (isRateLimitQuote(item)) throw new Error('ZenQuotes rate-limited content');
        return item;
      }
    }
  } catch (e) {
    // ignore and try public proxy
  }

  // Many browsers block direct requests to zenquotes due to CORS.
  // Use AllOrigins proxy as a secondary fallback.
  const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://zenquotes.io/api/random') + '&_=' + Date.now();
  const res = await fetch(proxy, { signal });
  if (!res.ok) throw new Error(`ZenQuotes (proxy) HTTP ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    const item = { q: data[0].q, a: data[0].a };
    if (isRateLimitQuote(item)) throw new Error('ZenQuotes rate-limited content');
    return item;
  }
  throw new Error('ZenQuotes returned unexpected data');
}

async function fetchQuotable(signal) {
  const res = await fetch('https://api.quotable.io/random?tags=inspirational|wisdom&_=' + Date.now(), { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Quotable HTTP ${res.status}`);
  const data = await res.json();
  return { q: data.content, a: data.author };
}

async function fetchServerQuote(signal) {
  // Works on Vercel (serverless function). In local dev it may 404 and we will fall back.
  const res = await fetch('/api/quote?rand=' + Date.now(), { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Server quote HTTP ${res.status}`);
  const data = await res.json();
  if (data && data.q) return { q: data.q, a: data.a };
  throw new Error('Server quote returned unexpected data');
}

export default function DailyQuote({ className, style }) {
  const [quote, setQuote] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const controllerRef = useRef(null);
  const retryRef = useRef(null);
  const lastFetchRef = useRef(0);

  async function doFetch() {
    if (loading) return; // prevent overlapping fetches
    // simple cooldown to reduce rate limits
    const now = Date.now();
    if (now - lastFetchRef.current < COOLDOWN_MS) return;
    lastFetchRef.current = now;
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) { /* noop */ }
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    setError(null);
    setLoading(true);
    const start = Date.now();
    try {
      // Prefer our own server function in production for reliability
      const s = await fetchServerQuote(controller.signal);
      const elapsed = Date.now() - start;
      if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
      setQuote(s.q);
      setAuthor(s.a || 'Unknown');
      try { localStorage.setItem('dailyQuote', JSON.stringify({ q: s.q, a: s.a || 'Unknown', t: Date.now() })); } catch (e) { /* ignore */ }
    } catch (err) {
      // ignore aborts silently
      if (err && err.name === 'AbortError') {
        console.info('Fetch aborted');
        setLoading(false);
        return;
      }
      console.warn('Server quote failed, falling back', err.message);
      try {
        // Next try Quotable directly, then ZenQuotes via proxy
        const q1 = await fetchQuotable(controller.signal);
        const elapsed = Date.now() - start;
        if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
        setQuote(q1.q);
        setAuthor(q1.a || 'Unknown');
        try { localStorage.setItem('dailyQuote', JSON.stringify({ q: q1.q, a: q1.a || 'Unknown', t: Date.now() })); } catch (e) { /* ignore */ }
      } catch (err2) {
        try {
          const z = await fetchZenQuote(controller.signal);
          const elapsed = Date.now() - start;
          if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
          setQuote(z.q);
          setAuthor(z.a || 'Unknown');
          try { localStorage.setItem('dailyQuote', JSON.stringify({ q: z.q, a: z.a || 'Unknown', t: Date.now() })); } catch (e) { /* ignore */ }
        } catch (err3) {
          // If we hit a 429 (Too Many Requests) from the proxy or source, report it and do not retry immediately
          const is429 = (err3 && err3.message && err3.message.includes('429')) || (err3 && err3.status === 429);
          if (is429) {
            console.warn('Rate limited (429) from quote source', err3);
            setError('Rate limited; using a saved quote.');
            setLoading(false);
            return;
          }
          console.error('All quote sources failed', err3);
          // If we have a cached quote, show it and display a milder error message
          const cached = (() => {
            try { return JSON.parse(localStorage.getItem('dailyQuote')); } catch (e) { return null; }
          })();
          if (cached && cached.q) {
            const elapsed = Date.now() - start;
            if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
            setQuote(cached.q);
            setAuthor(cached.a || 'Unknown');
            setError('Using saved quote — live fetch failed.');
          } else {
            // Use a small built-in fallback list so the widget always shows something offline
            const builtins = [
              { q: 'Stay hungry. Stay foolish.', a: 'Steve Jobs' },
              { q: 'The only limit to our realization of tomorrow is our doubts of today.', a: 'Franklin D. Roosevelt' },
              { q: 'Do what you can, with what you have, where you are.', a: 'Theodore Roosevelt' },
              { q: 'You miss 100% of the shots you don’t take.', a: 'Wayne Gretzky' }
            ];
            const pick = builtins[Math.floor(Math.random() * builtins.length)];
            const elapsed = Date.now() - start;
            if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
            setQuote(pick.q);
            setAuthor(pick.a);
            setError('Showing offline fallback quote — live fetch failed.');
          }

          // schedule a single retry after 4s (but only if not rate-limited)
          if (!retryRef.current && !(err3 && err3.message && err3.message.includes('429'))) {
            retryRef.current = setTimeout(() => {
              retryRef.current = null;
              doFetch();
            }, 4000);
          }
        }
      }
    } finally {
      setLoading(false);
      setAnimKey(k => k + 1); // trigger fade animation
    }
  }

  useEffect(() => {
    // show cached quote immediately if available
    try {
      const cached = JSON.parse(localStorage.getItem('dailyQuote'));
      if (cached && cached.q) {
        setQuote(cached.q);
        setAuthor(cached.a || 'Unknown');
      }
    } catch (e) { /* ignore parse errors */ }

    doFetch();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className} style={{ ...(style || {}), maxWidth: 420 }}>
      <div style={{ padding: '.9rem 1rem', borderRadius: 12, background: 'linear-gradient(180deg,#0f0f0f,#151515)', border: '1px solid #222', color: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '.95rem', color: '#d6f26a' }}>Quote</h4>
          <button
            onClick={() => doFetch()}
            aria-label="New Quote"
            style={{
              background: '#222',
              color: '#d6f26a',
              border: '1px solid #333',
              padding: '.35rem .6rem',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontWeight: 600
            }}
            disabled={loading}
          >
            New
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: '.6rem' }}>
            <div className="skeleton skeleton-quote" style={{ height: 64, borderRadius: 8 }} />
          </div>
        )}
        {error && <p style={{ marginTop: '.6rem', color: '#f77474' }}>{error}</p>}

        <div style={{ transition: 'opacity .35s ease', opacity: loading ? 0.2 : 1 }} key={animKey}>
          {!loading && !error && quote && (
            <blockquote style={{ marginTop: '.6rem', marginBottom: 0, fontStyle: 'italic', color: '#e6e6e6' }}>
              “{quote}”
              <cite style={{ display: 'block', marginTop: '.5rem', textAlign: 'right', color: '#bdbdbd', fontWeight: 600 }}>— {author}</cite>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
