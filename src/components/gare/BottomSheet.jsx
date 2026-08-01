import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function BottomSheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-encre/40 z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-papier rounded-t-3xl z-50 max-h-[88vh] overflow-y-auto"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-papier px-5 pt-4 pb-3 border-b border-encre/5 flex items-center justify-between">
              <div className="w-10 h-1 bg-encre/15 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <h3 className="font-display font-semibold text-encre mt-2">{title}</h3>
              <button onClick={onClose} className="mt-2 w-8 h-8 rounded-full bg-encre/5 flex items-center justify-center">
                <X className="w-4 h-4 text-encre/60" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
