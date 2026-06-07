import { Bell, CheckCheck, LogOut, MessageCircle, Moon, Plus, Search, Settings, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Avatar from './Avatar';
import RoomList from './RoomList';
import UserList from './UserList';
import { useTheme } from '../context/ThemeContext';
import { chatService } from '../services/chatService';
import { timeLabel } from '../utils/date';

export default function Sidebar({ user, users, rooms, onSearch, onCreateRoom, onLogout, notifications = [], onNotificationsRead }) {
  const { toggleTheme, theme } = useTheme();
  const [openNotifications, setOpenNotifications] = useState(false);
  const unread = notifications.filter((item) => !item.read).length;

  async function markRead() {
    await chatService.markNotificationsRead().catch(() => {});
    onNotificationsRead?.();
  }

  return (
    <aside className="glass flex h-full w-full flex-col overflow-hidden rounded-none md:w-[360px] md:rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <Link to="/profile" className="flex min-w-0 items-center gap-3">
          <Avatar user={user} online />
          <div className="min-w-0">
            <div className="truncate text-lg font-black">ChatSphere</div>
            <div className="truncate text-xs text-slate-400">{user?.name}</div>
          </div>
        </Link>
        <div className="relative flex gap-1">
          <button title="Notifications" onClick={() => setOpenNotifications((value) => !value)} className="btn btn-ghost relative h-10 w-10 p-0">
            <Bell size={17} />
            {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-teal-300 px-1 text-[10px] font-black text-slate-950">{unread}</span>}
          </button>
          {openNotifications && (
            <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 p-3">
                <div className="font-black">Notifications</div>
                <button onClick={markRead} title="Mark all read" className="btn btn-ghost h-8 px-2 py-0 text-xs"><CheckCheck size={14} />Read</button>
              </div>
              <div className="scrollbar-soft max-h-80 overflow-y-auto p-2">
                {notifications.length ? notifications.map((item) => (
                  <Link
                    key={item.id}
                    to={item.type === 'PRIVATE_MESSAGE' ? `/chat/${encodeURIComponent(item.actorEmail || item.linkId || '')}` : '/'}
                    onClick={() => setOpenNotifications(false)}
                    className={`block rounded-xl p-3 hover:bg-white/8 ${item.read ? 'opacity-70' : 'bg-teal-400/10'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold">{item.title}</p>
                      <span className="shrink-0 text-[10px] text-slate-500">{timeLabel(item.createdAt)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.actorEmail ? `${item.actorEmail}: ` : ''}{item.message}</p>
                  </Link>
                )) : (
                  <div className="p-6 text-center text-sm text-slate-400">No notifications yet</div>
                )}
              </div>
            </div>
          )}
          <Link title="Settings" to="/settings" className="btn btn-ghost h-10 w-10 p-0"><Settings size={17} /></Link>
          <button title="Logout" onClick={onLogout} className="btn btn-ghost h-10 w-10 p-0"><LogOut size={17} /></button>
        </div>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input className="input pl-10" placeholder="Search users, groups, files..." onChange={(event) => onSearch?.(event.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 pb-3">
        <button className="btn btn-primary flex-1"><MessageCircle size={17} />Chats</button>
        <button title="New group" onClick={onCreateRoom} className="btn btn-ghost h-11 w-11 p-0"><Plus size={18} /></button>
        <button title={theme === 'dark' ? 'Light mode' : 'Dark mode'} onClick={toggleTheme} className="btn btn-ghost h-11 w-11 p-0"><Moon size={18} /></button>
      </div>
      <div className="scrollbar-soft flex-1 overflow-y-auto px-2 pb-4">
        <section>
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Direct messages</div>
          <UserList users={users} currentUser={user} />
        </section>
        <section className="mt-4">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">Groups</div>
          <RoomList rooms={rooms} />
        </section>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/10 p-4 text-xs text-slate-400">
        <div className="flex items-center gap-2"><UserRound size={14} /> Online-first secure messaging</div>
      </motion.div>
    </aside>
  );
}
