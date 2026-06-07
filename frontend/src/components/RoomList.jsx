import { Hash } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoomList({ rooms = [] }) {
  return (
    <div className="space-y-1">
      {rooms.map((room) => (
        <Link key={room.id} to={`/rooms/${room.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/8">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-800 text-teal-200">
            <Hash size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-100">{room.name}</div>
            <div className="truncate text-xs text-slate-400">{room.members?.length || 0} members</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
