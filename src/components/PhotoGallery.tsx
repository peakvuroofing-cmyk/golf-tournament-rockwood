'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ROCKWOOD_PHOTOS = [
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_1-3ac51550fc0be35bf3991c34d54ac18b.jpg',
    alt: 'Rockwood Park Golf Course - Hole 1',
    title: 'Championship Course Layout'
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_2-0dd410cb797b22c245f912808440008d.jpg',
    alt: 'Rockwood Park Golf Course - Fairway',
    title: 'Pristine Fairways'
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_3-af0227a75d1b128374c831ccf5126f75.jpg',
    alt: 'Rockwood Park Golf Course - Greens',
    title: 'Tournament Grade Greens'
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_4-02bfde1de46c48d52967485d3e836cf6.jpg',
    alt: 'Rockwood Park Golf Course - Scenic Hole',
    title: 'Scenic Holes'
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_5-459e2281f460e96528668fc1101ea055.jpg',
    alt: 'Rockwood Park Golf Course - Water Feature',
    title: 'Strategic Water Features'
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_6-f3e1c68b5f8c42d9a7b1c2d3e4f5g6h7.jpg',
    alt: 'Rockwood Park Golf Course - Sunset',
    title: 'Beautiful Setting'
  },
];

export function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + ROCKWOOD_PHOTOS.length) % ROCKWOOD_PHOTOS.length);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % ROCKWOOD_PHOTOS.length);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROCKWOOD_PHOTOS.map((photo, index) => (
          <div
            key={index}
            onClick={() => openModal(index)}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={400}
              height={256}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
              <div className="w-full p-4 text-white transform translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-semibold">{photo.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <div className="max-w-4xl w-full">
            <Image
              src={ROCKWOOD_PHOTOS[selectedIndex].src}
              alt={ROCKWOOD_PHOTOS[selectedIndex].alt}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
            <p className="text-white text-center mt-4 font-semibold">
              {ROCKWOOD_PHOTOS[selectedIndex].title}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {selectedIndex + 1} / {ROCKWOOD_PHOTOS.length}
          </div>
        </div>
      )}
    </>
  );
}