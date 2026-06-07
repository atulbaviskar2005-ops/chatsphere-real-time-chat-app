import { useEffect, useState } from 'react';
import { chatService } from '../services/chatService';
import { roomService } from '../services/roomService';

export function useWorkspaceData() {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const refresh = async () => {
    const [nextUsers, nextRooms, nextNotifications] = await Promise.all([
      chatService.users(),
      roomService.all(),
      chatService.notifications().catch(() => []),
    ]);
    setUsers(nextUsers);
    setRooms(nextRooms);
    setNotifications(nextNotifications);
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  return { users, setUsers, rooms, setRooms, notifications, setNotifications, refresh };
}
