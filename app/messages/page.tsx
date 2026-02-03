'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  address: string;
  body: string;
  date: number;
  type: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      fetchMessages(apiKey);
    }
  }, []);

  const fetchMessages = async (apiKey: string) => {
    try {
      const response = await fetch('/api/sms', {
        headers: { 'X-API-Key': apiKey },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.address.includes(search) || msg.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Messages</h1>
          <Link href="/" className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
            ← Back
          </Link>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-400 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-300 font-semibold">{msg.address}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.date).toLocaleString()}
                </span>
              </div>
              <p className="text-white">{msg.body}</p>
              <span className={`text-xs ${msg.type === 1 ? 'text-green-400' : 'text-blue-400'} mt-2 inline-block`}>
                {msg.type === 1 ? '📥 Received' : '📤 Sent'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
