import React from 'react';
import logo from '@/assets/logo.png';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-encre flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="GareConnect" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg" />
          <h1 className="font-display text-2xl font-semibold text-papier">{title}</h1>
          {subtitle && <p className="text-papier/50 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="bg-papier rounded-2xl p-6 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
