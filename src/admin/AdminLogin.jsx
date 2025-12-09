import { useState } from 'react';

export default function AdminLogin({ onLogin, error }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin?.(form.username.trim(), form.password.trim());
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: '#151515', padding: '2.5rem', borderRadius: '18px', border: '1px solid #222', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', textAlign: 'center' }}>Admin Login</h1>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <span>Username</span>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
            required
            style={{ padding: '.75rem', borderRadius: '10px', border: '1px solid #333', background: '#111', color: '#fff' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
            required
            style={{ padding: '.75rem', borderRadius: '10px', border: '1px solid #333', background: '#111', color: '#fff' }}
          />
        </label>
        {error && <p style={{ color: '#f87171', margin: 0 }}>{error}</p>}
        <button type="submit" style={{ background: '#d6f26a', border: 'none', borderRadius: '999px', padding: '.85rem 1rem', fontWeight: 700, cursor: 'pointer', color: '#121212', marginTop: '.5rem' }}>
          Sign In
        </button>
        <p style={{ color: '#8f8f8f', fontSize: '.85rem', margin: 0, textAlign: 'center' }}>Use the credentials you configured (default admin / admin001).</p>
      </form>
    </div>
  );
}
