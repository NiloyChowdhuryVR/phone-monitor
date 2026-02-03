'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Video {
  id: number;
  filename: string;
  path: string;
  uploaded_at: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      fetchVideos(apiKey);
    }
  }, []);

  const fetchVideos = async (apiKey: string) => {
    try {
      const response = await fetch('/api/videos', {
        headers: { 'X-API-Key': apiKey },
      });
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Videos</h1>
          <Link href="/" className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden border border-white/20">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={video.path}
              />
              <div className="p-4">
                <p className="text-white text-sm truncate">{video.filename}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(video.uploaded_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
