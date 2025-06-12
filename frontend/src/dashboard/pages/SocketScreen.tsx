import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../../auth';
import { encrypt, decrypt } from '../../encryption';

interface Message {
  from: 'user' | 'server';
  text: string;
  time: string;
}

const SocketScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const socket = io('https://chatbackend-joh5.onrender.com', {
      auth: { token: getToken() },
      transports: ['websocket']
    });

    socket.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err.message);
    });

    socket.on('transaction_ack', (data: string) => {
      try {
        const decrypted = decrypt(data);
        const msgText =
          typeof decrypted === 'string'
            ? decrypted
            : JSON.stringify(decrypted, null, 2);

        setMessages((prev) => [
          ...prev,
          { from: 'server', text: msgText, time: new Date().toLocaleTimeString() }
        ]);
      } catch (err) {
        console.error('Decryption failed:', err);
        setMessages((prev) => [
          ...prev,
          { from: 'server', text: '[Error decrypting message]', time: new Date().toLocaleTimeString() }
        ]);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    try {
      const encrypted = encrypt({ msg: message });
      socketRef.current?.emit('transaction', encrypted);
      setMessages((prev) => [
        ...prev,
        { from: 'user', text: message, time: new Date().toLocaleTimeString() }
      ]);
      setMessage('');
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 text-black">
      <div className="text-black mb-4">📊 Welcome to the Dashboard Home</div>
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl flex flex-col">
        <h2 className="text-2xl text-black">🔐 Encrypted Socket Chat</h2>

        <div className="flex-1 overflow-y-auto h-80 border rounded p-3 bg-gray-50 space-y-2 text-black">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] p-2 rounded break-words text-sm border ${msg.from === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-200 mr-auto'
                } text-black`}
            >
              <div>{msg.text}</div>
              <div className="text-xs opacity-60 mt-1 text-right">{msg.time}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 mt-4">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocketScreen;
