import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../auth';
import { encrypt, decrypt } from '../encryption';

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

  // useEffect(() => {
  //   inputRef.current?.focus();

  //   const socket = io('http://localhost:4000', {
  //     auth: { token: getToken() },
  //     transports: ['websocket']
  //   });

  //   socket.on('connect_error', (err) => {
  //     console.error('Socket Connection Error:', err.message);
  //   });

  //   socket.on('transaction_ack', (data: string) => {
  //     try {
  //       const decrypted = decrypt(data);
  //       const msgText =
  //         typeof decrypted === 'string'
  //           ? decrypted
  //           : JSON.stringify(decrypted, null, 2);

  //       setMessages((prev) => [
  //         ...prev,
  //         { from: 'server', text: msgText, time: new Date().toLocaleTimeString() }
  //       ]);
  //     } catch (err) {
  //       console.error('Decryption failed:', err);
  //       setMessages((prev) => [
  //         ...prev,
  //         { from: 'server', text: '[Error decrypting message]', time: new Date().toLocaleTimeString() }
  //       ]);
  //     }
  //   });

  //   socketRef.current = socket;

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
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

        let msgText = '';

        if (typeof decrypted === 'string') {
          msgText = decrypted;
        } else if (typeof decrypted === 'object') {
          const mainMessage = decrypted.message || '';
          const innerMsg = decrypted.receivedData?.msg || '';
          msgText = `${mainMessage}${innerMsg ? ` - ${innerMsg}` : ''}` || '[No message in response]';
        } else {
          msgText = '[Unknown message format]';
        }

        console.log(decrypted, "decrypted")
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 text-xl font-semibold">
          🔐 Encrypted Socket Chat
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50 h-[500px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words ${msg.from === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-200 text-gray-800 mr-auto'
                }`}
            >
              <div>{msg.text}</div>
              <div className="text-[10px] opacity-60 mt-1 text-right">{msg.time}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t px-6 py-3 bg-white flex gap-2 items-center">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocketScreen;
