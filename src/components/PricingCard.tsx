import React from 'react';
import { DollarSign, Users, User } from 'lucide-react';

interface PricingCardProps {
  className?: string;
}

export function PricingCard({ className = '' }: PricingCardProps) {
  const individualPrice = parseInt(process.env.NEXT_PUBLIC_INDIVIDUAL_PRICE || '135');
  const teamPrice = parseInt(process.env.NEXT_PUBLIC_TEAM_PRICE || '500');

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Registration Pricing</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <User className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Individual</h4>
              <p className="text-sm text-gray-600">Single player registration</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary-600 tabular-nums tracking-tight">${individualPrice}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Team of 4</h4>
              <p className="text-sm text-gray-600">Complete team registration</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary-600 tabular-nums tracking-tight">${teamPrice}</span>
            <p className="text-sm text-gray-600 tabular-nums">${Math.round(teamPrice / 4)}/person</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Includes:</strong> Golf, BBQ lunch, prizes, and charity contribution
        </p>
      </div>
    </div>
  );
}