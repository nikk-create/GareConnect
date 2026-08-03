import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useGare } from '@/lib/GareContext';

const ICONS = { success: CheckCircle2, warn: AlertTriangle, error: XCircle, info: Info };
const STYLES = {
  success: 'bg-primary/15 border-primary/30 text-primary',
  warn: 'bg-warn/15 border-warn/30 text-warn',
  error: 'bg-destructive/15 border-destructive/30 text-destructive',
  info: 'bg-accent/15 border-accent/30 text-accent',
};

export default function ToastContainer() {
  const { toasts } = useGare() || { toasts: [] };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[92%] max-w-sm pointer-events-none safe-top">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium glass shadow-lg ${STYLES[t.type] || STYLES.info}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-foreground">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
