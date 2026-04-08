import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventDetailsCardProps {
  className?: string;
}

export function EventDetailsCard({ className = '' }: EventDetailsCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {process.env.NEXT_PUBLIC_EVENT_NAME}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          <span>
            {new Date(process.env.NEXT_PUBLIC_EVENT_DATE || '').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
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