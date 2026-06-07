import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { lastSeenLabel } from '../utils/date';

export default function UserList({ users = [], currentUser }) {
  return (
    <div className="space-y-1">
      {users.filter((u) => u.email !== currentUser?.email).map((user) => (
        <Link key={user.id || user.email} to={`/chat/${encodeURIComponent(user.email)}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/8">
          <Avatar user={user} online={user.status === 'ONLINE'} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-100">{user.name}</div>
            <div className="truncate text-xs text-slate-400">{user.status === 'ONLINE' ? 'Online' : lastSeenLabel(user.lastSeen)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
