import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = typeof window !== 'undefined' && window.self !== window.top;

export function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
}

export function genererCodeTicket() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TQ-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function genererCodeVoyage() {
  const chars = '0123456789';
  let code = 'V';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
