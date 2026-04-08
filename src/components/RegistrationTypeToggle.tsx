import React from 'react';
import { User, Users } from 'lucide-react';

interface RegistrationTypeToggleProps {
  selectedType: 'individual' | 'team';
  onTypeChange: (type: 'individual' | 'team') => void;
  className?: string;
}

export function RegistrationTypeToggle({
  selectedType,
  onTypeChange,
  className = ''
}: RegistrationTypeToggleProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Registration Type</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onTypeChange('individual')}
          className={`
            p-4 border-2 rounded-lg text-left transition-all
            ${selectedType === 'individual'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center">
            <User className={`h-6 w-6 mr-3 ${selectedType === 'individual' ? 'text-primary-600' : 'text-gray-400'}`} />
            <div>
              <h4 className="font-medium">Individual Registration</h4>
              <p className="text-sm opacity-75">Register as a single player</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange('team')}
          className={`
            p-4 border-2 rounded-lg text-left transition-all
            ${selectedType === 'team'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center">
            <Users className={`h-6 w-6 mr-3 ${selectedType === 'team' ? 'text-primary-600' : 'text-gray-400'}`} />
            <div>
              <h4 className="font-medium">Team Registration</h4>
              <p className="text-sm opacity-75">Register a team of 4 players</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}