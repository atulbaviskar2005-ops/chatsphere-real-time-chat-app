import { Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', profileImage: user?.profileImage || '', desktopNotifications: user?.desktopNotifications ?? true, soundNotifications: user?.soundNotifications ?? true });

  async function submit(event) {
    event.preventDefault();
    const { data } = await api.put('/users/profile', form);
    localStorage.setItem('chatsphere_user', JSON.stringify(data));
    setUser(data);
    navigate('/');
  }

  return (
    <main className="bg-app min-h-screen p-4">
      <form onSubmit={submit} className="glass mx-auto max-w-2xl rounded-2xl p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={form.name} image={form.profileImage} online size="h-16 w-16" />
          <div>
            <h1 className="text-2xl font-black">Profile</h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="grid gap-4">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Profile image URL" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />
          <textarea className="input min-h-28 resize-none" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <label className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm"><span>Desktop notifications</span><input type="checkbox" checked={form.desktopNotifications} onChange={(e) => setForm({ ...form, desktopNotifications: e.target.checked })} /></label>
          <label className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm"><span>Sound notifications</span><input type="checkbox" checked={form.soundNotifications} onChange={(e) => setForm({ ...form, soundNotifications: e.target.checked })} /></label>
        </div>
        <button className="btn btn-primary mt-6"><Save size={18} />Save profile</button>
      </form>
    </main>
  );
}
