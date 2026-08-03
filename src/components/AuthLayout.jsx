import React from 'react';
import logo from '@/assets/logo.png';

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10 safe-top safe-bottom">
      {/* Ambient glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="GareConnect" className="w-16 h-16 rounded-2xl mx-auto mb-4 glow-primary" />
          {Icon && (
            <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <h1 className="text-2xl font-extrabold font-outfit text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm mt-1.5">{subtitle}</p>}
        </div>

        <div className="glass rounded-3xl border border-border/50 p-6 shadow-2xl">
          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}
