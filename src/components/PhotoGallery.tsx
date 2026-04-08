'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ROCKWOOD_PHOTOS = [
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_1-3ac51550fc0be35bf3991c34d54ac18b.jpg',
    alt: 'Rockwood Park Golf Course fairway',
    title: 'Lush Fairways',
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_2-0dd410cb797b22c245f912808440008d.jpg',
    alt: 'Rockwood Park Golf Course hole overview',
    title: 'Signature Holes',
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_3-af0227a75d1b128374c831ccf5126f75.jpg',
    alt: 'Golf greens at Rockwood Park',
    title: 'Perfect Greens',
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_4-02bfde1de46c48d52967485d3e836cf6.jpg',
    alt: 'Rockwood Park scenic hole',
    title: 'Scenic Views',
  },
  {
    src: 'https://www.fortworthgolf.org/media/widgetkit/rockwood-park_5-459e2281f460e96528668fc1101ea055.jpg',
    alt: 'Water feature at the golf course',
    title: 'Water Features',
  },
  {
    src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golf course sunset silhouette',
    title: 'Sunset Fairway',
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    alt: 'Players walking on a golf course',
    title: 'Tournament Day',
  },
  {
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golf course with rolling hills',
    title: 'Rolling Greens',
  },
  {
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golf course clubhouse and course view',
    title: 'Clubhouse View',
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
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-3">Photo Gallery</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Explore Rockwood Park</h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
          Click any image to enlarge and use the arrows to browse the gallery in full view.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROCKWOOD_PHOTOS.map((photo, index) => (
          <div
            key={index}
            onClick={() => openModal(index)}
            className="relative group cursor-pointer overflow-hidden rounded-[2rem] shadow-2xl transition-shadow hover:shadow-black/20"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={480}
              height={320}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-90">
              <p className="text-sm uppercase tracking-[0.25em] text-primary-300 mb-1">{photo.title}</p>
              <p className="text-sm">{photo.alt}</p>
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