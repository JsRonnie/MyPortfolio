// Vercel Serverless Function: Proxies Web3Forms without exposing your access key.
// Set WEB3FORMS_ACCESS_KEY in your environment (Vercel Project Settings or local .env).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }
  const ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
  if (!ACCESS_KEY) {
    res.status(500).json({ success: false, message: 'Missing WEB3FORMS_ACCESS_KEY on server' });
    return;
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => {
        try { resolve(data ? JSON.parse(data) : {}); }
        catch (e) { reject(e); }
      });
      req.on('error', reject);
    });

    const { name = '', email = '', subject = '', message = '', captcha = '' } = body || {};

    // Build Web3Forms payload as multipart/form-data
    const form = new FormData();
    form.append('access_key', ACCESS_KEY);
    if (captcha) form.append('h-captcha-response', captcha);
    form.append('name', String(name));
    form.append('email', String(email));
    form.append('subject', String(subject));
    form.append('message', String(message));

    const upstream = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: form });
    const data = await upstream.json();

    res.status(data?.success ? 200 : upstream.status || 400).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Proxy error', error: String(err?.message || err) });
  }
}
