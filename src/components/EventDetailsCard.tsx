import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventDetailsCardProps {
  className?: string;
}

export function EventDetailsCard({ className = '' }: EventDetailsCardProps) {
  const rawDate = process.env.NEXT_PUBLIC_EVENT_DATE || '';
  const eventDate = new Date(rawDate);
  const formattedDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Saturday, June 20, 2026';

  const venueName = process.env.NEXT_PUBLIC_VENUE_NAME || 'Rockwood Park Golf Course';
  const venueAddress = process.env.NEXT_PUBLIC_VENUE_ADDRESS || '1851 Jacksboro Hwy, Fort Worth, TX 76114';
  const registrationTime = process.env.NEXT_PUBLIC_REGISTRATION_TIME || '7:00 AM';
  const shotgunStart = process.env.NEXT_PUBLIC_SHOTGUN_START || '8:00 AM';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {process.env.NEXT_PUBLIC_EVENT_NAME || 'Rockwood Park Charity Golf Tournament'}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-2 text-primary-600" />
          <span>{process.env.NEXT_PUBLIC_VENUE_NAME}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-2 text-primary-600 ml-7" />
          <span>{process.env.NEXT_PUBLIC_VENUE_ADDRESS}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-primary-600" />
          <span>Registration: {process.env.NEXT_PUBLIC_REGISTRATION_TIME}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-primary-600 ml-7" />
          <span>Shotgun Start: {process.env.NEXT_PUBLIC_SHOTGUN_START}</span>
        </div>
      </div>
    </div>
  );
}