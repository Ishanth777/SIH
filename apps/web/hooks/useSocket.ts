import { useEffect, useState } from 'react';

export const useSocket = (token?: string) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // TODO: Implement Socket.IO reconnect logic here for the web app
    // Ensure this hook properly reconnects to the Gateway to receive real-time updates.
  }, [token]);

  return { socket, isConnected };
};
