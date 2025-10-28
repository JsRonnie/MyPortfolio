// Vercel Serverless Function: Unified quote endpoint with caching and fallbacks
// Returns: { q: string, a: string }

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes CDN/server cache
let memoryCache = { ts: 0, q: null, a: null };

function timeoutFetch(resource, options = {}) {
  const { timeout = 3000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, { ...rest, signal: controller.signal }).finally(() => clearTimeout(id));
}

async function getQuotable() {
  const res = await timeoutFetch('https://api.quotable.io/random?tags=inspirational|wisdom', { cache: 'no-store', timeout: 4000 });
  if (!res.ok) throw new Error(`Quotable HTTP ${res.status}`);
  const d = await res.json();
  return { q: d.content, a: d.author };
}

function isRateLimitedQuote(obj) {
  if (!obj) return false;
  const t = String(obj.q || '').toLowerCase();
  const a = String(obj.a || '').toLowerCase();
  return t.includes('too many requests') || a.includes('zenquotes.io');
}

async function getZenQuotes() {
  const res = await timeoutFetch('https://zenquotes.io/api/random', { timeout: 4000 });
  if (!res.ok) throw new Error(`ZenQuotes HTTP ${res.status}`);
  const arr = await res.json();
  if (!Array.isArray(arr) || !arr.length) throw new Error('ZenQuotes unexpected');
  const item = { q: arr[0].q, a: arr[0].a };
  if (isRateLimitedQuote(item)) throw new Error('ZenQuotes rate-limited content');
  return item;
}

const FALLBACKS = [
  { q: 'Stay hungry. Stay foolish.', a: 'Steve Jobs' },
  { q: 'The only limit to our realization of tomorrow is our doubts of today.', a: 'Franklin D. Roosevelt' },
  { q: 'Do what you can, with what you have, where you are.', a: 'Theodore Roosevelt' },
  { q: 'You miss 100% of the shots you don’t take.', a: 'Wayne Gretzky' }
];

export default async function handler(req, res) {
  try {
    // basic in-memory cache
    const now = Date.now();
    const bypass = 'refresh' in (req.query || {});
    if (!bypass && memoryCache.q && now - memoryCache.ts < CACHE_TTL_MS) {
      res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
      return res.status(200).json({ q: memoryCache.q, a: memoryCache.a, cached: true });
    }

    // Try providers in order
    let data = null;
    try { data = await getQuotable(); }
    catch {}
    if (!data) {
      try { data = await getZenQuotes(); } catch {}
    }
    if (!data) {
      data = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    }

    memoryCache = { ts: Date.now(), q: data.q, a: data.a };
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
    return res.status(200).json({ q: data.q, a: data.a });
  } catch (e) {
    const fb = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    res.setHeader('Cache-Control', 's-maxage=120');
    return res.status(200).json({ q: fb.q, a: fb.a, fallback: true });
  }
}
