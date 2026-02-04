'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Commentary {
  text: string;
  expression: string;
  tone: string;
}

interface CommentaryBubbleProps {
  commentary: Commentary | null;
}

export function CommentaryBubble({ commentary }: CommentaryBubbleProps) {
  if (!commentary) return null;

  return (
    <div className="max-w-[350px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={commentary.text}
          className="commentary-bubble"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p className="commentary-text">
            "{commentary.text}"
          </motion.p>
          <motion.div 
            className="mt-3 text-sm text-chess-gold font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            👑 The Magister
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}