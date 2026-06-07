import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { chatService } from '../services/chatService';
import { roomService } from '../services/roomService';
import { createSocket } from '../services/websocketService';

export default function GroupChat() {
  const { roomId } = useParams();
  const { token, user, logout } = useAuth();
  const { users, rooms, notifications, setNotifications, refresh } = useWorkspaceData();
  const [messages, setMessages] = useState([]);
  const room = rooms.find((item) => item.id === roomId);

  useEffect(() => {
    roomService.join(roomId).catch(() => {});
    chatService.roomHistory(roomId).then(setMessages).catch(() => {});
  }, [roomId]);

  useEffect(() => {
    if (!token) return undefined;
    const client = createSocket(token, {
      onConnect: (stomp) => {
        window.chatClient = stomp;
        stomp.subscribe(`/topic/group/${roomId}`, (frame) => setMessages((prev) => [...prev, JSON.parse(frame.body)]));
        stomp.subscribe('/user/queue/notifications', (frame) => {
          const notification = JSON.parse(frame.body);
          setNotifications((items) => [notification, ...items.filter((item) => item.id !== notification.id)]);
          if (user?.desktopNotifications && window.Notification?.permission === 'granted') {
            new Notification(notification.title, { body: notification.message });
          }
        });
      },
    });
    return () => {
      window.chatClient = null;
      client.deactivate();
    };
  }, [token, roomId, user, setNotifications]);

  async function createRoom() {
    const name = window.prompt('Group name');
    if (!name) return;
    await roomService.create({ name });
    refresh();
  }

  const mergeMessage = (message) => {
    setMessages((prev) => prev.some((item) => item.id === message.id) ? prev.map((item) => (item.id === message.id ? message : item)) : [...prev, message]);
  };

  const publish = async (payload) => {
    if (window.chatClient?.connected) {
      window.chatClient.publish(payload);
      return;
    }
    const body = JSON.parse(payload.body);
    mergeMessage(await chatService.sendRoom(roomId, body));
  };

  return (
    <main className="bg-app min-h-screen p-0 md:p-4">
      <div className="mx-auto flex h-screen max-w-7xl gap-4 md:h-[calc(100vh-2rem)]">
        <div className="hidden md:block">
          <Sidebar
            user={user}
            users={users}
            rooms={rooms}
            notifications={notifications}
            onNotificationsRead={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}
            onCreateRoom={createRoom}
            onLogout={logout}
          />
        </div>
        <ChatBox
          title={room?.name || 'Group chat'}
          subtitle={`${room?.members?.length || 0} members`}
          avatar={room?.groupImage}
          messages={messages}
          currentEmail={user?.email}
          onSend={(payload) => publish({ destination: '/app/chat.group', body: JSON.stringify({ ...payload, roomId }) })}
          onUpload={async (file) => {
            const attachment = await chatService.upload(file, { roomId });
            const message = await chatService.sendRoom(roomId, {
              roomId,
              fileUrl: attachment.fileUrl,
              fileName: attachment.fileName,
              fileType: attachment.fileType,
              fileSize: attachment.fileSize,
              messageType: attachment.fileType?.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
            });
            mergeMessage(message);
          }}
          onEdit={chatService.editMessage}
          onDelete={chatService.deleteMessage}
        />
      </div>
    </main>
  );
}
