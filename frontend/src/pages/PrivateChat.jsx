import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { chatService } from '../services/chatService';
import { createSocket } from '../services/websocketService';
import { roomService } from '../services/roomService';

export default function PrivateChat() {
  const { email } = useParams();
  const otherEmail = decodeURIComponent(email);
  const { token, user, logout } = useAuth();
  const { users, rooms, notifications, setNotifications, refresh } = useWorkspaceData();
  const [messages, setMessages] = useState([]);
  const other = useMemo(() => users.find((u) => u.email === otherEmail), [users, otherEmail]);

  useEffect(() => {
    chatService.privateHistory(otherEmail).then(setMessages).catch(() => {});
  }, [otherEmail]);

  const mergeMessage = (message) => {
    setMessages((prev) => prev.some((item) => item.id === message.id) ? prev.map((item) => (item.id === message.id ? message : item)) : [...prev, message]);
  };

  const send = async (payload) => {
    if (window.chatClient?.connected) {
      window.chatClient.publish(payload);
      return;
    }
    const body = JSON.parse(payload.body);
    mergeMessage(await chatService.sendPrivate(otherEmail, body));
  };
  async function createRoom() {
    const name = window.prompt('Group name');
    if (!name) return;
    await roomService.create({ name });
    refresh();
  }

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
        <SocketBridge token={token} user={user} setMessages={setMessages} setNotifications={setNotifications} otherEmail={otherEmail} />
        <ChatBox
          title={other?.name || otherEmail}
          subtitle={other?.lastSeen ? undefined : 'Direct message'}
          avatar={other?.profileImage}
          online={other?.status === 'ONLINE'}
          messages={messages}
          currentEmail={user?.email}
          onSend={(payload) => send({ destination: '/app/chat.private', body: JSON.stringify({ ...payload, receiverEmail: otherEmail }) })}
          onUpload={async (file) => {
            const attachment = await chatService.upload(file, { receiverEmail: otherEmail });
            const message = await chatService.sendPrivate(otherEmail, {
              receiverEmail: otherEmail,
              fileUrl: attachment.fileUrl,
              fileName: attachment.fileName,
              fileType: attachment.fileType,
              fileSize: attachment.fileSize,
              messageType: attachment.fileType?.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
            });
            mergeMessage(message);
          }}
          onEdit={async (id, content) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content, edited: true } : m))) || chatService.editMessage(id, content)}
          onDelete={async (id) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, deleted: true, content: '' } : m))) || chatService.deleteMessage(id)}
        />
      </div>
    </main>
  );
}

function SocketBridge({ token, user, setMessages, setNotifications, otherEmail }) {
  useEffect(() => {
    if (!token) return undefined;
    const client = createSocket(token, {
      onConnect: (stomp) => {
        window.chatClient = stomp;
        stomp.subscribe('/user/queue/messages', (frame) => {
          const message = JSON.parse(frame.body);
          if ([message.senderEmail, message.receiverEmail].includes(otherEmail)) {
            setMessages((prev) => prev.some((m) => m.id === message.id) ? prev.map((m) => (m.id === message.id ? message : m)) : [...prev, message]);
          }
        });
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
  }, [token, user, otherEmail, setMessages, setNotifications]);
  return null;
}
