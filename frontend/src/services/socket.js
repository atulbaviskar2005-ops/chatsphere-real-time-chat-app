import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const wsBase = import.meta.env.VITE_WS_URL || 'http://localhost:8081/ws';

export function createSocket(token, handlers = {}) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${wsBase}?token=${encodeURIComponent(token)}`),
    reconnectDelay: 2500,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      handlers.onConnect?.(client);
      client.publish({ destination: '/app/user.online', body: '{}' });
    },
    onStompError: (frame) => handlers.onError?.(frame.headers.message || 'WebSocket error'),
  });
  client.activate();
  return client;
}
