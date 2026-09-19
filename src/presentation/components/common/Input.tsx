import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="input-field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`input-control ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
