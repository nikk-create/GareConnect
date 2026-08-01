import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useGare } from '@/lib/GareContext';

const ICONS = { success: CheckCircle2, warn: AlertTriangle, info: Info };
const COLORS = { success: 'bg-emerald-600', warn: 'bg-or text-encre', info: 'bg-ciel' };

export function ToastContainer() {
  const { toasts } = useGare() || { toasts: [] };
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[92%] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm shadow-lg ${COLORS[t.type] || COLORS.info}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
