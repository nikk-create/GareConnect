import React from 'react';
import { X } from 'lucide-react';
import { useGare } from '@/lib/GareContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheet({ name, title, children }) {
  const { activeSheet, closeSheet } = useGare();
  const isOpen = activeSheet === name;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeSheet}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden rounded-t-3xl bg-card border-t border-border/50 shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div>
                <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-3" />
                <h2 className="text-lg font-extrabold font-outfit">{title}</h2>
              </div>
              <button
                onClick={closeSheet}
                className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-8 overflow-y-auto max-h-[calc(90vh-80px)] no-scrollbar safe-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
