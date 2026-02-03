'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CallLog {
  id: string;
  number: string;
  type: number;
  date: number;
  duration: number;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      fetchCalls(apiKey);
    }
  }, []);

  const fetchCalls = async (apiKey: string) => {
    try {
      const response = await fetch('/api/calls', {
        headers: { 'X-API-Key': apiKey },
      });
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    }
  };

  const getCallType = (type: number) => {
    switch (type) {
      case 1: return { label: 'Incoming', icon: '📞', color: 'text-green-400' };
      case 2: return { label: 'Outgoing', icon: '📱', color: 'text-blue-400' };
      case 3: return { label: 'Missed', icon: '❌', color: 'text-red-400' };
      default: return { label: 'Unknown', icon: '❓', color: 'text-gray-400' };
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Call Logs</h1>
          <Link href="/" className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
            ← Back
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden border border-white/20">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Number</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Duration</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => {
                const callType = getCallType(call.type);
                return (
                  <tr key={call.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <span className={`${callType.color} flex items-center gap-2`}>
                        <span>{callType.icon}</span>
                        <span>{callType.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-mono">{call.number}</td>
                    <td className="px-4 py-3 text-gray-300">{formatDuration(call.duration)}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(call.date).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
