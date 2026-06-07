import { Bell, Lock, Moon, Save, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState({
    desktopNotifications: user?.desktopNotifications ?? true,
    soundNotifications: user?.soundNotifications ?? true,
    privateLastSeen: user?.privateLastSeen ?? false,
  });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function savePreferences(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/users/profile', profile);
      localStorage.setItem('chatsphere_user', JSON.stringify(data));
      setUser(data);
      setMessage('Settings saved');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save settings');
    }
  }

  async function requestDesktopPermission() {
    if (!('Notification' in window)) {
      setError('Desktop notifications are not supported in this browser');
      return;
    }
    const permission = await Notification.requestPermission();
    setMessage(permission === 'granted' ? 'Desktop notifications enabled' : 'Desktop notifications were not enabled');
  }

  async function changePassword(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await authService.changePassword(password);
      setPassword({ currentPassword: '', newPassword: '' });
      setMessage('Password changed');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not change password');
    }
  }

  return (
    <main className="bg-app min-h-screen p-4 text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="glass flex items-center justify-between rounded-2xl p-5">
          <div>
            <h1 className="text-2xl font-black">Settings</h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
          <Link className="btn btn-ghost" to="/">Back</Link>
        </header>

        {(message || error) && (
          <div className={`rounded-xl p-3 text-sm ${error ? 'bg-rose-500/15 text-rose-100' : 'bg-emerald-500/15 text-emerald-100'}`}>
            {error || message}
          </div>
        )}

        <form onSubmit={savePreferences} className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Bell size={18} className="text-teal-200" />
            <h2 className="font-black">Notifications & Privacy</h2>
          </div>
          <div className="grid gap-3">
            <label className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span>Desktop notifications</span>
              <input type="checkbox" checked={profile.desktopNotifications} onChange={(event) => setProfile({ ...profile, desktopNotifications: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span>Sound notifications</span>
              <input type="checkbox" checked={profile.soundNotifications} onChange={(event) => setProfile({ ...profile, soundNotifications: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span>Hide last seen</span>
              <input type="checkbox" checked={profile.privateLastSeen} onChange={(event) => setProfile({ ...profile, privateLastSeen: event.target.checked })} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary"><Save size={18} />Save settings</button>
            <button type="button" onClick={requestDesktopPermission} className="btn btn-ghost"><Bell size={18} />Allow desktop alerts</button>
          </div>
        </form>

        <form onSubmit={changePassword} className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lock size={18} className="text-teal-200" />
            <h2 className="font-black">Password</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" type="password" placeholder="Current password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} />
            <input className="input" type="password" placeholder="New password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} />
          </div>
          <button className="btn btn-primary mt-4"><Shield size={18} />Change password</button>
        </form>

        <section className="glass rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-2">
            <Moon size={18} className="text-teal-200" />
            <h2 className="font-black">Theme</h2>
          </div>
          <div className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button onClick={() => setTheme('dark')} className={`rounded-lg px-4 py-2 text-sm font-bold ${theme === 'dark' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>Dark</button>
            <button onClick={() => setTheme('light')} className={`rounded-lg px-4 py-2 text-sm font-bold ${theme === 'light' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>Light</button>
          </div>
        </section>
      </div>
    </main>
  );
}
