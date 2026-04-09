import { useEffect, useRef, useState } from 'react';

const MIN_DELAY_MS = 650;
const COOLDOWN_MS = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRateLimitQuote(obj) {
  if (!obj) return false;
  const text = String(obj.q || '').toLowerCase();
  const author = String(obj.a || '').toLowerCase();
  return text.includes('too many requests') || author.includes('zenquotes.io');
}

async function fetchZenQuote(signal) {
  try {
    const localResponse = await fetch(`/api/zenquotes?_=${Date.now()}`, { signal });
    if (localResponse.ok) {
      const localData = await localResponse.json();
      if (Array.isArray(localData) && localData.length > 0) {
        const item = { q: localData[0].q, a: localData[0].a };
        if (isRateLimitQuote(item)) throw new Error('ZenQuotes rate-limited content');
        return item;
      }
    }
  } catch (error) {
    // Ignore and try the public proxy next.
  }

  const proxyUrl =
    'https://api.allorigins.win/raw?url=' +
    encodeURIComponent('https://zenquotes.io/api/random') +
    `&_=${Date.now()}`;
  const response = await fetch(proxyUrl, { signal });
  if (!response.ok) throw new Error(`ZenQuotes (proxy) HTTP ${response.status}`);

  const data = await response.json();
  if (Array.isArray(data) && data.length > 0) {
    const item = { q: data[0].q, a: data[0].a };
    if (isRateLimitQuote(item)) throw new Error('ZenQuotes rate-limited content');
    return item;
  }

  throw new Error('ZenQuotes returned unexpected data');
}

async function fetchQuotable(signal) {
  const response = await fetch(`https://api.quotable.io/random?tags=inspirational|wisdom&_=${Date.now()}`, {
    signal,
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`Quotable HTTP ${response.status}`);

  const data = await response.json();
  return { q: data.content, a: data.author };
}

async function fetchServerQuote(signal, forceRefresh = false) {
  const query = forceRefresh ? 'refresh=1' : `rand=${Date.now()}`;
  const response = await fetch(`/api/quote?${query}`, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Server quote HTTP ${response.status}`);

  const data = await response.json();
  if (data?.q) return { q: data.q, a: data.a };

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

  async function doFetch(forceRefresh = false) {
    if (loading) return;

    const now = Date.now();
    if (now - lastFetchRef.current < COOLDOWN_MS) return;
    lastFetchRef.current = now;

    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (error) {
        // No-op.
      }
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setError(null);
    setLoading(true);
    const start = Date.now();

    try {
      const serverQuote = await fetchServerQuote(controller.signal, forceRefresh);
      const elapsed = Date.now() - start;
      if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);

      setQuote(serverQuote.q);
      setAuthor(serverQuote.a || 'Unknown');
      try {
        localStorage.setItem(
          'dailyQuote',
          JSON.stringify({ q: serverQuote.q, a: serverQuote.a || 'Unknown', t: Date.now() })
        );
      } catch (error) {
        // Ignore localStorage errors.
      }
    } catch (serverError) {
      if (serverError?.name === 'AbortError') {
        setLoading(false);
        return;
      }

      try {
        const quotableQuote = await fetchQuotable(controller.signal);
        const elapsed = Date.now() - start;
        if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);

        setQuote(quotableQuote.q);
        setAuthor(quotableQuote.a || 'Unknown');
        try {
          localStorage.setItem(
            'dailyQuote',
            JSON.stringify({ q: quotableQuote.q, a: quotableQuote.a || 'Unknown', t: Date.now() })
          );
        } catch (error) {
          // Ignore localStorage errors.
        }
      } catch (quotableError) {
        try {
          const zenQuote = await fetchZenQuote(controller.signal);
          const elapsed = Date.now() - start;
          if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);

          setQuote(zenQuote.q);
          setAuthor(zenQuote.a || 'Unknown');
          try {
            localStorage.setItem(
              'dailyQuote',
              JSON.stringify({ q: zenQuote.q, a: zenQuote.a || 'Unknown', t: Date.now() })
            );
          } catch (error) {
            // Ignore localStorage errors.
          }
        } catch (finalError) {
          const is429 =
            (finalError && finalError.message && finalError.message.includes('429')) ||
            (finalError && finalError.status === 429);

          if (is429) {
            setError('Rate limited; using a saved quote.');
            setLoading(false);
            return;
          }

          const cached = (() => {
            try {
              return JSON.parse(localStorage.getItem('dailyQuote'));
            } catch (error) {
              return null;
            }
          })();

          if (cached?.q) {
            const elapsed = Date.now() - start;
            if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
            setQuote(cached.q);
            setAuthor(cached.a || 'Unknown');
            setError('Using saved quote while live fetch is unavailable.');
          } else {
            const builtins = [
              { q: 'Stay hungry. Stay foolish.', a: 'Steve Jobs' },
              { q: 'The only limit to our realization of tomorrow is our doubts of today.', a: 'Franklin D. Roosevelt' },
              { q: 'Do what you can, with what you have, where you are.', a: 'Theodore Roosevelt' },
              { q: "You miss 100% of the shots you don't take.", a: 'Wayne Gretzky' }
            ];
            const pick = builtins[Math.floor(Math.random() * builtins.length)];
            const elapsed = Date.now() - start;
            if (elapsed < MIN_DELAY_MS) await sleep(MIN_DELAY_MS - elapsed);
            setQuote(pick.q);
            setAuthor(pick.a);
            setError('Showing an offline fallback quote.');
          }

          if (!retryRef.current && !(finalError && finalError.message && finalError.message.includes('429'))) {
            retryRef.current = setTimeout(() => {
              retryRef.current = null;
              doFetch(false);
            }, 4000);
          }
        }
      }
    } finally {
      setLoading(false);
      setAnimKey((key) => key + 1);
    }
  }

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('dailyQuote'));
      if (cached?.q) {
        setQuote(cached.q);
        setAuthor(cached.a || 'Unknown');
      }
    } catch (error) {
      // Ignore parse errors.
    }

    doFetch();

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className} style={{ ...(style || {}), maxWidth: 420 }}>
      <div
        style={{
          padding: '.95rem 1rem',
          borderRadius: 18,
          background: 'linear-gradient(180deg, rgba(10, 18, 33, 0.94), rgba(13, 26, 45, 0.92))',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          color: '#f8fafc',
          boxShadow: '0 18px 36px rgba(0,0,0,0.22)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '.95rem', color: '#67e8f9', letterSpacing: '.04em' }}>Quote</h4>
          <button
            onClick={() => doFetch(true)}
            aria-label="New Quote"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '.4rem .8rem',
              borderRadius: 10,
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

        {error && <p style={{ marginTop: '.7rem', color: '#fca5a5' }}>{error}</p>}

        <div style={{ transition: 'opacity .35s ease', opacity: loading ? 0.2 : 1 }} key={animKey}>
          {!loading && !error && quote && (
            <blockquote style={{ marginTop: '.75rem', marginBottom: 0, fontStyle: 'italic', color: '#e2e8f0' }}>
              "{quote}"
              <cite
                style={{
                  display: 'block',
                  marginTop: '.75rem',
                  textAlign: 'right',
                  color: '#94a3b8',
                  fontWeight: 600
                }}
              >
                - {author}
              </cite>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
