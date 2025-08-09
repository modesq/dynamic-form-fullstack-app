import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" />
          </div>
          <div className="hidden md:block text-sm text-gray-400">
            Dynamic Forms
          </div>
        </div>
      </div>
    </header>
  );
}