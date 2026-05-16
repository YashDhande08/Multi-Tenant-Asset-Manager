import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium theme-transition btn-motion';
  const variants = {
    primary: 'app-btn-primary',
    secondary: 'app-btn-secondary',
    danger: 'app-btn-danger',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
