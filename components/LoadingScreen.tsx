'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-chess-dark flex items-center justify-center z-50">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
        >
          ♔
        </motion.div>
        <motion.h2 className="text-2xl font-bold text-chess-gold">
          The Magister Awakens...
        </motion.h2>
      </motion.div>
    </div>
  );
}