import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin001';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('portfolioAdminAuthed') === 'true');
  const [error, setError] = useState('');

  const handleLogin = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
      sessionStorage.setItem('portfolioAdminAuthed', 'true');
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('portfolioAdminAuthed');
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} error={error} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
