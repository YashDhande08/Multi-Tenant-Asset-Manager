import React from 'react';

const Card = ({ children, title, className = '', headerAction }) => {
  return (
    <div className={`app-card card-interactive p-6 theme-transition ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
