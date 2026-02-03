'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Photo {
  id: number;
  filename: string;
  path: string;
  uploaded_at: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      fetchPhotos(apiKey);
    }
  }, []);

  const fetchPhotos = async (apiKey: string) => {
    try {
      const response = await fetch('/api/photos', {
        headers: { 'X-API-Key': apiKey },
      });
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Photos</h1>
          <Link href="/" className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="aspect-square bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-white/20"
            >
              <img
                src={photo.path}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="max-w-4xl max-h-full">
              <img
                src={selectedPhoto.path}
                alt={selectedPhoto.filename}
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
