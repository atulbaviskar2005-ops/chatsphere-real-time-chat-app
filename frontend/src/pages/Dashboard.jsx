import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { roomService } from '../services/roomService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { users, rooms, notifications, setNotifications, refresh } = useWorkspaceData();

  async function createRoom() {
    const name = window.prompt('Group name');
    if (!name) return;
    const room = await roomService.create({ name, description: 'New ChatSphere group' });
    await refresh();
    navigate(`/rooms/${room.id}`);
  }

  return (
    <main className="bg-app min-h-screen p-0 md:p-4">
      <div className="mx-auto flex h-screen max-w-7xl gap-4 md:h-[calc(100vh-2rem)]">
        <Sidebar
          user={user}
          users={users}
          rooms={rooms}
          notifications={notifications}
          onNotificationsRead={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}
          onCreateRoom={createRoom}
          onLogout={logout}
        />
        <div className="hidden flex-1 md:block">
          <ChatBox title="Welcome to ChatSphere" subtitle="Choose a direct message or group to begin" messages={[]} currentEmail={user?.email} />
        </div>
      </div>
    </main>
  );
}
