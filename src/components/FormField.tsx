import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  options,
  multiline = false,
  rows = 3,
  className = '',
}: FormFieldProps) {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    ${error ? 'border-red-300' : 'border-gray-300'}
  `;

  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClasses = 'mt-1 text-sm text-red-600';

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={baseInputClasses}
          required={required}
        />
      ) : options ? (
        <select
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          className={baseInputClasses}
          required={required}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value as boolean}
            onChange={onChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            required={required}
          />
          <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
            {placeholder || label}
          </label>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={baseInputClasses}
          required={required}
        />
      )}

      {error && <p className={errorClasses}>{error}</p>}
    </div>
  );
}