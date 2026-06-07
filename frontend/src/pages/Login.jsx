import { MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  }

  return (
    <main className="bg-app grid min-h-screen place-items-center p-4">
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-7 shadow-glow">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400 text-slate-950"><MessageSquare /></div>
          <div>
            <h1 className="text-3xl font-black">ChatSphere</h1>
            <p className="text-sm text-slate-400">Secure real-time conversations</p>
          </div>
        </div>
        {error && <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div>}
        <div className="space-y-3">
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary mt-5 w-full">Login</button>
        <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
          <Link className="text-teal-200 hover:text-white" to="/register">Create account</Link>
          <span className="flex items-center gap-1"><ShieldCheck size={14} /> JWT protected</span>
        </div>
      </motion.form>
    </main>
  );
}
